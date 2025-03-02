"use client";
import React, { useCallback } from "react";
import {
  MultiSelect,
  TextInput,
  Select,
  Box,
  Stack,
  Text,
  Group,
  Divider,
  RangeSlider,
} from "@mantine/core";
import { provinces } from "../data/provinces";

const jobTypes = ["FULLTIME", "PARTTIME", "FREELANCE"];

// const workDays = [
//   "จันทร์-ศุกร์",
//   "จันทร์-เสาร์",
//   "จันทร์-อาทิตย์",
//   "เสาร์-อาทิตย์",
//   "อื่นๆ",
// ];

const workHours = Array.from({ length: 48 }, (_, i) => ({
  value: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
  label: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
}));

interface Filters {
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

interface SidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

// ฟังก์ชัน RangeSlider ที่มีสีเขียวแบบ Gradient
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
          fontSize:"m",
        },
      }}
    />
  );
};

function Sidebar({ filters, setFilters }: SidebarProps) {
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

  return (
    <Box className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm hidden md:block">
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
            onChange={(value) => setFilters((prev) => ({ ...prev, startTime: value }))}
            clearable
            className="kanit-regular"
          />
          <Select
            label="เวลาเลิกงาน"
            placeholder="เลือกเวลา"
            data={workHours}
            value={filters.endTime}
            onChange={(value) => setFilters((prev) => ({ ...prev, endTime: value }))}
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
                const [sortBy, sortOrder] = value.split("_") as [string, "asc" | "desc"];
                setFilters((prev) => ({
                  ...prev,
                  sortBy,
                  sortOrder,
                }));
              }
            }}
            data={sortOptions}
            rightSection={
              filters.sortBy && <span className="text-sm">{filters.sortOrder === "asc" ? "↑" : "↓"}</span>
            }
            className="kanit-regular"
          />
        </Group>
      </Stack>
    </Box>
  );
}

export default Sidebar;
