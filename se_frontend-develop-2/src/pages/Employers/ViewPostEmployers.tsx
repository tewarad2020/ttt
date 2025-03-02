import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { NavbarEmp } from "../../components/NavbarEmp";
import Footer from "../../components/Footer";
import { updateJobPostById } from "../../api/EmployerAndCompany";
import { useUser } from "../../context/UserContext";
import { MultiSelect } from "@mantine/core";
import { provinces } from "../../data/provinces";
import { getAllSkills } from "../../api/Skills";
import { getAllCategories } from "../../api/JobCategories";

interface Job {
  id: number;
  title: string;
  jobLocation: string;
  salary: number;
  workDates: string;
  workHoursRange: string;
  description: string;
  requirements: string;
  postedAt: string;
  skills: { id: string; name: string; description: string }[];
  jobCategories: { id: string; name: string; description: string }[];
}

const ViewPostEmployers: React.FC = () => {
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
  const [skills, setSkills] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<any[]>([]);

  useEffect(() => {
    refetchjobseeker();
    refetchCompany();
    refetchemployer();
    setIsHaveUser(!!user);
    console.log(job);
  }, [user, isLoading, isStale]);

  useEffect(() => {
    const fetchSkillsAndCategories = async () => {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }
      try {
        const categoriesData = await getAllCategories();
        const skillsData = await getAllSkills();

        setSkills(skillsData.data);
        setJobCategories(categoriesData.data);
      } catch (error) {
        console.error("Failed to fetch skills or categories:", error);
      }
    };

    fetchSkillsAndCategories();
  }, []);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const job: Job | undefined = location.state?.job;

  console.log(location.state?.job);

  // The data in localStorage.getItem("jobs_emp") is likely set elsewhere in the application
  // using localStorage.setItem("jobs_emp", JSON.stringify(jobsData)).

  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<Job | undefined>(job);

  const [startTime, setStartTime] = useState(
    editedJob?.workHoursRange.split("-")[0].trim().padStart(5, "0")
  );
  const [endTime, setEndTime] = useState(
    editedJob?.workHoursRange.split("-")[1].trim().padStart(5, "0")
  );

  const workDayOptions = [
    "จันทร์ - ศุกร์",
    "จันทร์ - เสาร์",
    "จันทร์ - อาทิตย์",
    "เสาร์ - อาทิตย์",
    "อื่นๆ",
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedJob((prevJob) => {
      if (!prevJob) return undefined;
      return {
        ...prevJob,
        [name]: name === "salary" && value === "" ? "" : value,
      };
    });
  };

  const handleLocationChange = (value: string[]) => {
    setEditedJob((prevJob) => {
      if (!prevJob) return undefined;
      return {
        ...prevJob,
        jobLocation: value.join(", "),
      };
    });
  };

  const handleSkillsChange = (value: string[]) => {
    const selectedSkills = skills.filter((skill) => value.includes(skill.id));
    setEditedJob((prevJob) => {
      if (!prevJob) return undefined;
      return {
        ...prevJob,
        skills: selectedSkills,
      };
    });
  };

  const handleCategoriesChange = (value: string[]) => {
    const selectedCategories = jobCategories.filter((cat) =>
      value.includes(cat.id)
    );
    setEditedJob((prevJob) => {
      if (!prevJob) return undefined;
      return {
        ...prevJob,
        jobCategories: selectedCategories,
      };
    });
  };

  const handleConfirmClick = async () => {
    if (editedJob) {
      try {
        await updateJobPostById(id as any, {
          title: editedJob.title,
          description: editedJob.description,
          jobLocation: editedJob.jobLocation,
          salary: Number(editedJob.salary),
          workDates: editedJob.workDates,
          workHoursRange: `${startTime} - ${endTime}`,
          hiredAmount: 1, // Assuming a default value
          jobPostType: "FULLTIME", // Assuming a default value
          skills: editedJob.skills.map((skill) => skill.id),
          jobCategories: editedJob.jobCategories.map((cat) => cat.id),
        });
        setIsEditing(false);
        navigate("/homeemp");
      } catch (error) {
        console.error("Failed to update job post:", error);
      }
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        times.push(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      }
    }
    return times;
  };

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-kanit">
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
        <h1 className="text-2xl font-bold text-red-500">❌ ไม่พบข้อมูลงาน</h1>
        <button
          className="mt-6 px-6 py-2 bg-seagreen text-white rounded-md shadow-sm hover:bg-[#246e4a] transition text-base"
          onClick={() => navigate("/homeemp")}
        >
          กลับไปหน้าหลัก
        </button>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-kanit">
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

      <div className="max-w-1/2 mx-auto p-4 px-8 bg-white shadow-sm rounded-lg mt-6">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
          📌 รายละเอียดงาน
        </h1>

        <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-3">
          <>
            <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-700 text-base">
              <strong>📍 สถานที่:</strong>{" "}
              {isEditing ? (
                <MultiSelect
                  placeholder="เลือกจังหวัด"
                  data={provinces}
                  value={editedJob?.jobLocation.split(", ") || []}
                  onChange={handleLocationChange}
                  clearable
                  searchable
                  className="font-kanit"
                />
              ) : (
                job.jobLocation
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>💰 เงินเดือน:</strong>{" "}
              {isEditing ? (
                <input
                  step={1000}
                  type="number"
                  name="salary"
                  value={editedJob?.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                `฿${job.salary.toLocaleString()} บาท`
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>📅 วันทำงาน:</strong>{" "}
              {isEditing ? (
                <select
                  name="workDates"
                  value={editedJob?.workDates}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  {workDayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                job.workDates
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>⏰ ช่วงเวลาทำงาน:</strong>{" "}
              {isEditing ? (
                <>
                  <label className="font-kanit text-gray-700">
                    เวลาเริ่มงาน
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md text-sm w-20"
                  >
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>

                  <label className="font-kanit text-gray-700">
                    เวลาเลิกงาน
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md text-sm w-20"
                  >
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                job.workHoursRange
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>📝 รายละเอียด:</strong>{" "}
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedJob?.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                job.description
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>✅ คุณสมบัติที่ต้องการ:</strong>{" "}
              {isEditing ? (
                <textarea
                  name="requirements"
                  value={editedJob?.requirements}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                job.requirements
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>✅ ทักษะที่ต้องการ:</strong>{" "}
              {isEditing ? (
                <MultiSelect
                  placeholder="เลือกทักษะ"
                  data={skills.map((skill) => ({
                    value: skill.id,
                    label: skill.name,
                  }))}
                  value={editedJob?.skills.map((skill) => skill.id) || []}
                  onChange={handleSkillsChange}
                />
              ) : (
                job.skills.map((skill) => skill.name).join(", ")
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>📂 หมวดหมู่งาน:</strong>{" "}
              {isEditing ? (
                <MultiSelect
                  placeholder="เลือกหมวดหมู่งาน"
                  data={jobCategories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  value={editedJob?.jobCategories.map((cat) => cat.id) || []}
                  onChange={handleCategoriesChange}
                />
              ) : (
                job.jobCategories.map((cat) => cat.name).join(", ")
              )}
            </p>
            <p className="text-gray-700 text-base">
              <strong>📆 โพสต์เมื่อ:</strong> {job.postedAt || "ไม่ระบุวันที่"}
            </p>
          </>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          {isEditing ? (
            <button
              className="px-5 py-2 bg-seagreen/80 text-white rounded-md shadow-sm hover:bg-seagreen transition text-base"
              onClick={handleConfirmClick}
            >
              ยืนยัน
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-seagreen/80 text-white rounded-md shadow-sm hover:bg-seagreen transition text-base"
              onClick={handleEditClick}
            >
              แก้ไข
            </button>
          )}
          <button
            className="px-5 py-2 bg-seagreen/80 text-white rounded-md shadow-sm hover:bg-seagreen transition text-base"
            onClick={() => navigate("/homeemp")}
          >
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewPostEmployers;
