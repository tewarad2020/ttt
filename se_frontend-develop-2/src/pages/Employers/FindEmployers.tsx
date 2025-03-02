/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { NavbarEmp } from "../../components/NavbarEmp";
import Sidebar from "../../components/SidebarEmp";
import JobCardEmp from "../../components/JobCardEmp";
import Footer from "../../components/Footer";
import {
  Box,
  Divider,
  Drawer,
  Group,
  MultiSelect,
  Pagination,
  Select,
  Stack,
  TextInput,
  Text,
  RangeSlider,
} from "@mantine/core";
import { getAllJobFindingPosts } from "../../api/JobSeeker";

interface Job {
  id: string;
  title: string;
  description: string;
  jobLocation: string;
  expectedSalary: number;
  workDates: string;
  workHoursRange: string;
  status: string;
  jobPostType: string;
  jobSeekerType: string;
  jobSeekerId: string;
  oauthJobSeekerId: string | null;
  createdAt: string;
  updatedAt: string;
  skills: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
  jobCategories: {
    id: string;
    name: string;
    description: string;
  }[];
}

export interface Filters {
  searchTerm: string;
  selectedJobCategories: string[];
  selectedJobTypes: string[];
  selectedSkills: string[];
  salaryRange: [number, number];
  startTime: string | null;
  endTime: string | null;
  selectedLocations: string[];
  selectedWorkDays: string[];
  sortBy: string | null;
  sortOrder: "asc" | "desc";
}
import { useUser } from "../../context/UserContext";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { provinces } from "../../data/provinces";
const jobTypes = ["FULLTIME", "PARTTIME", "FREELANCE"];

function FindEmp() {
  const {
    user,
    isLoading,
    refetchjobseeker,
    refetchemployer,
    refetchCompany,
    isStale,
    setUser,
  } = useUser();
  const [isHaveUser, setIsHaveUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [itemsPerPage] = useState(9);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    selectedJobCategories: [],
    selectedJobTypes: [],
    selectedSkills: [],
    salaryRange: [0, 200000],
    startTime: null,
    endTime: null,
    selectedLocations: [],
    selectedWorkDays: [],
    sortBy: null,
    sortOrder: "asc",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobFindingPosts();
        setJobs(response.data.jobPosts as Job[]);
      } catch (error) {
        console.error("Failed to fetch job finding posts:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    refetchjobseeker();
    refetchCompany();
    refetchemployer();
    // console.log("current user:", user);
    // console.log("isLoading:", isLoading);
    // console.log("isHaveUser :", isHaveUser);
    // console.log("isStale :", isStale);
    setIsHaveUser(!!user);
  }, [user, isLoading, isStale]);

  useEffect(() => {
    refetchjobseeker();
    refetchCompany();
    refetchemployer();
    // console.log("current user:", user);
    // console.log("isLoading:", isLoading);
    // console.log("isHaveUser :", isHaveUser);
    // console.log("isStale :", isStale);
    setIsHaveUser(!!user);
  }, [user, isLoading, isStale]);

  const handleMultiSelectChange = useCallback(
    (field: keyof Filters) => (values: string[]) => {
      setFilters((prev) => ({
        ...prev,
        [field]: values.includes("ทั้งหมด") ? [] : values,
      }));
    },
    [setFilters]
  );

  const sortOptions = [
    { value: "salary_asc", label: "เงินเดือน(น้อยไปมาก)" },
    { value: "salary_desc", label: "เงินเดือน(มากไปน้อย)" },
    { value: "date_asc", label: "วันที่ลงประกาศ(เก่าไปใหม่)" },
    { value: "date_desc", label: "วันที่ลงประกาศ(ใหม่ไปเก่า)" },
  ];

  const workHours = Array.from({ length: 48 }, (_, i) => ({
    value: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
    label: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
  }));

  const filterJobs = (jobs: Job[]): Job[] => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesCategories =
        filters.selectedJobCategories.length === 0 ||
        job.jobCategories.some((cat) =>
          filters.selectedJobCategories.includes(cat.name)
        );

      const matchesJobTypes =
        filters.selectedJobTypes.length === 0 ||
        filters.selectedJobTypes.includes(job.jobPostType);

      const matchesSalary =
        job.expectedSalary >= filters.salaryRange[0] &&
        job.expectedSalary <= filters.salaryRange[1];

      const matchesWorkHours = () => {
        if (!filters.startTime || !filters.endTime) return true;
        const [startH, startM] = filters.startTime.split(":").map(Number);
        const [endH, endM] = filters.endTime.split(":").map(Number);
        const jobStart = parseInt(
          job.workHoursRange.split("-")[0].replace(":", "")
        );
        const jobEnd = parseInt(
          job.workHoursRange.split("-")[1].replace(":", "")
        );
        const filterStart = startH * 100 + startM;
        const filterEnd = endH * 100 + endM;
        return jobStart >= filterStart && jobEnd <= filterEnd;
      };

      const matchesLocations =
        filters.selectedLocations.length === 0 ||
        filters.selectedLocations.includes(job.jobLocation);

      const matchesWorkDays =
        filters.selectedWorkDays.length === 0 ||
        filters.selectedWorkDays.some((day) => job.workDates.includes(day));

      return (
        matchesSearch &&
        matchesCategories &&
        matchesJobTypes &&
        matchesSalary &&
        matchesWorkHours() &&
        matchesLocations &&
        matchesWorkDays
      );
    });
  };

  // ในส่วน sortJobs ของ FindEmp.tsx
  const sortJobs = (jobs: Job[]): Job[] => {
    if (!filters.sortBy) return jobs;

    return [...jobs].sort((a, b) => {
      switch (filters.sortBy) {
        case "salary":
          return filters.sortOrder === "asc"
            ? a.expectedSalary - b.expectedSalary
            : b.expectedSalary - a.expectedSalary;
        // case 'date':
        //   const dateA = new Date(a.createdAt).getTime();
        //   const dateB = new Date(b.createdAt).getTime();
        //   return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        default:
          return 0;
      }
    });
  };

  const GreenSlider = ({
    value,
    onChange,
  }: {
    value: [number, number];
    onChange: (value: [number, number]) => void;
  }) => {
    return (
      <RangeSlider
        min={0}
        max={200000}
        step={1000}
        value={value}
        onChange={(val) => onChange(val as [number, number])}
        onChangeEnd={(val) => onChange(val as [number, number])}
        marks={[
          { value: 0, label: "0" },
          { value: 50000, label: "50k" },
          { value: 100000, label: "100k" },
          { value: 150000, label: "150k" },
          { value: 200000, label: "200k" },
        ]}
        styles={{
          track: {
            background: "linear-gradient(to right, #A7F3D0,seagreen)",
            height: "8px",
            borderRadius: "4px",
          },
          bar: {
            background: "linear-gradient(to right,#A7F3D0,seagreen",
          },
          thumb: {
            backgroundColor: "#10B981", // สีหัวเลื่อน
            border: "3px solid white",
            width: "18px",
            height: "18px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)", // เพิ่มเงาให้ดูเด่น
          },
          markLabel: {
            color: "black", // สีตัวเลขใกล้เคียงกับธีม,
            fontSize: "m",
          },
        }}
      />
    );
  };

  const filteredJobs = sortJobs(filterJobs(jobs));
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="min-h-screen flex flex-col font-kanit">
      <NavbarEmp
        user={user}
        isLoading={isLoading}
        isHaveUser={isHaveUser}
        refetchjobseeker={refetchjobseeker}
        refetchemployer={refetchemployer}
        refetchCompany={refetchCompany}
        isStale={isStale}
        setUser={setUser}
      />
      <div className="flex flex-row flex-grow">
        <Sidebar filters={filters} setFilters={setFilters} />
        <div className="w-full md:w-3/4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="kanit-medium text-2xl">ค้นหางาน</h1>
            <button
              onClick={() => setOpened(true)}
              className="block md:hidden border border-seagreen text-seagreen font-bold py-2 px-4 rounded hover:bg-seagreen hover:text-white transition duration-300 ease-in-out"
            >
              <FaMagnifyingGlass />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="kanit-regular text-gray-500 text-xl">
                  ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา
                </p>
              </div>
            ) : (
              currentJobs.map((job: Job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <JobCardEmp
                    id={job.id}
                    title={job.title}
                    location={job.jobLocation}
                    salary={job.expectedSalary}
                    workDays={job.workDates}
                    workHours={job.workHoursRange}
                    jobCategories={job.jobCategories}
                  />
                </motion.div>
              ))
            )}
          </div>
          {filteredJobs.length > itemsPerPage && (
            <div className="flex items-center justify-center mt-6">
              <Pagination
                total={Math.ceil(filteredJobs.length / itemsPerPage)}
                value={currentPage}
                onChange={setCurrentPage}
                classNames={{
                  control: "border-0",
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="ค้นหางาน"
        size="xl"
        padding="lg"
        className="kanit-regular"
      >
        <Box className="bg-white shadow-md rounded-lg p-6 w-full">
          <Stack>
            <TextInput
              className="kanit-regular"
              placeholder="ค้นหาด้วยคำที่ใกล้เคียง..."
              label="ค้นหา"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
            />

            <Divider label="ข้อมูลงาน" labelPosition="center" my={4} />

            <MultiSelect
              data={["ทั้งหมด", ...jobTypes]}
              label="ชนิดงาน"
              placeholder="เลือกประเภทงาน"
              value={filters.selectedJobTypes}
              onChange={handleMultiSelectChange("selectedJobTypes")}
              clearable
              searchable
              className="kanit-regular"
            />

            <Box>
              <Text size="sm" className="kanit-regular">
                เงินเดือน: ฿{filters.salaryRange[0].toLocaleString()} - ฿
                {filters.salaryRange[1].toLocaleString()}
              </Text>
              <GreenSlider
                value={filters.salaryRange}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, salaryRange: value }))
                }
              />
            </Box>

            <Divider label="เวลาทำงาน" labelPosition="center" my={4} />

            <Group grow>
              <Select
                label="เวลาเริ่มงาน"
                placeholder="เลือกเวลา"
                data={workHours}
                value={filters.startTime}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, startTime: value }))
                }
                clearable
                className="kanit-regular"
              />
              <Select
                label="เวลาเลิกงาน"
                placeholder="เลือกเวลา"
                data={workHours}
                value={filters.endTime}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, endTime: value }))
                }
                clearable
                className="kanit-regular"
              />
            </Group>

            {/* <MultiSelect
                        data={["ทั้งหมด", ...workDays]}
                        label="วันทำงาน"
                        placeholder="เลือกวันทำงาน"
                        value={filters.selectedWorkDays}
                        onChange={handleMultiSelectChange("selectedWorkDays")}
                        clearable
                        searchable
                        className="kanit-regular"
                      /> */}

            <Divider label="สถานที่ทำงาน" labelPosition="center" my={4} />

            <MultiSelect
              data={provinces}
              label="สถานที่ทำงาน"
              placeholder="เลือกสถานที่"
              value={filters.selectedLocations}
              onChange={handleMultiSelectChange("selectedLocations")}
              clearable
              searchable
              className="kanit-regular"
            />

            <Divider my={4} />

            <Group grow>
              <Select
                label="เรียงตาม"
                placeholder="เลือกการเรียงลำดับ"
                value={`${filters.sortBy}_${filters.sortOrder}`}
                onChange={(value) => {
                  if (value) {
                    const [sortBy, sortOrder] = value.split("_") as [
                      string,
                      "asc" | "desc"
                    ];
                    setFilters((prev) => ({
                      ...prev,
                      sortBy,
                      sortOrder,
                    }));
                  }
                }}
                data={sortOptions}
                rightSection={
                  filters.sortBy && (
                    <span className="text-sm">
                      {filters.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )
                }
                className="kanit-regular"
              />
            </Group>
          </Stack>
        </Box>
      </Drawer>
    </div>
  );
}

export default FindEmp;
