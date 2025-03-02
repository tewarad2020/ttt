import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarEmp } from "../../components/NavbarEmp";
import Footer from "../../components/Footer";
import {
  FaMapMarkerAlt,
  FaClock,
  FaTrash,
  FaUserPlus,
  FaClipboardList,
  FaPlus,
  FaSearch,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { CiMoneyBill } from "react-icons/ci";
import { useUser } from "../../context/UserContext";
import { deleteJobPost } from "../../api/EmployerAndCompany";
import { getEmployerJobPosts } from "../../api/Employer";
import { getCompanyJobPosts } from "../../api/Company";
import { MultiSelect } from "@mantine/core";

interface Job {
  id: string;
  title: string;
  jobLocation: string;
  description: string;
  salary: number;
  workDates: string;
  workHoursRange: string;
  hiredAmount: number;
  createdAt: string;
  userId: string; // Add userId to Job interface
  skills: {
    id: string;
    name: string;
    description: string;
  }[];
  jobCategories: {
    id: string;
    name: string;
    description: string;
  }[];
}

const HomepageEmployers: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  // ข้อมูล categories ตัวอย่าง
  const jobCategories = [
    { value: "restaurant", label: "ร้านอาหาร" },
    { value: "retail", label: "ค้าปลีก" },
    { value: "event", label: "อีเวนต์" },
    { value: "hotel", label: "โรงแรม" },
    { value: "office", label: "ออฟฟิศ" },
    { value: "delivery", label: "ส่งของ" },
    { value: "warehouse", label: "คลังสินค้า" },
    { value: "cleaning", label: "ทำความสะอาด" },
    { value: "marketing", label: "การตลาด" },
    { value: "customer-service", label: "บริการลูกค้า" },
  ];

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
    const fetchJobs = async () => {
      try {
        let response;
        if (user.type === "EMPLOYER") {
          response = await getEmployerJobPosts();
          console.log("Employer job posts:", response);
        } else if (user.type === "COMPANY") {
          response = await getCompanyJobPosts();
          console.log("Company job posts:", response);
        } else {
          throw new Error("Invalid user role");
        }

        const jobsData = response.data.jobPosts.map((jobPost: any) => ({
          id: jobPost.id,
          title: jobPost.title,
          jobLocation: jobPost.jobLocation,
          description: jobPost.description,
          salary: jobPost.salary,
          workDates: jobPost.workDates,
          workHoursRange: jobPost.workHoursRange,
          hiredAmount: jobPost.hiredAmount,
          createdAt: jobPost.createdAt,
          userId:
            jobPost.companyId || jobPost.employerId || jobPost.oauthEmployerId, // Add userId to Job data
          skills: jobPost.skills || [],
          jobCategories: jobPost.jobCategories || [],
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to fetch job posts:", error);
      }
    };

    fetchJobs();
  }, [user]);

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJobPost(id);
      const updatedJobs = jobs.filter((job) => job.id !== id);
      setJobs(updatedJobs);
    } catch (error) {
      console.error("Failed to delete job post:", error);
      alert("⚠️ การลบงานล้มเหลว กรุณาลองใหม่อีกครั้ง!");
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === jobs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? jobs.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-white">
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

      <div className="kanit-regular max-w-5xl xl:max-w-6xl mx-auto px-12 sm:px-16 lg:px-24 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Sidebar (Quick Actions) */}

        <div className="bg-[#f9f9f9]/80 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-300 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-5 text-center">
            ตัวเลือกด่วน
          </h2>
          <div className="space-y-4 mb-6 font-kanit">
            <button
              className={`flex items-center justify-center w-full px-6 py-3 text-base rounded-lg shadow-md transition font-kanit ${
                user && (user.type === "EMPLOYER" || user.type === "COMPANY")
                  ? "bg-seagreen/80 hover:bg-seagreen text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() =>
                user &&
                (user.type === "EMPLOYER" || user.type === "COMPANY") &&
                navigate("/postjobemp")
              }
              disabled={
                !user || (user.type !== "EMPLOYER" && user.type !== "COMPANY")
              }
            >
              <FaPlus className="mr-2" size={16} /> โพสต์งานใหม่
            </button>
            <button
              className="flex items-center justify-center w-full px-6 py-3 text-base rounded-lg shadow-md transition font-kanit bg-seagreen/80 hover:bg-seagreen text-white"
              onClick={() => navigate("/findemp")}
            >
              <FaSearch className="mr-2" size={16} /> ค้นหาผู้สมัคร
            </button>
            <button
              className={`flex items-center justify-center w-full px-6 py-3 text-base rounded-lg shadow-md transition font-kanit ${
                user && (user.type === "EMPLOYER" || user.type === "COMPANY")
                  ? "bg-seagreen/80 hover:bg-seagreen text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() =>
                user &&
                (user.type === "EMPLOYER" || user.type === "COMPANY") &&
                navigate("/trackemp")
              }
              disabled={
                !user || (user.type !== "EMPLOYER" && user.type !== "COMPANY")
              }
            >
              <FaEye className="mr-2" size={16} /> ติดตามการรับสมัคร
            </button>
          </div>
        </div>

        {/* Right Content (Job Stats and Recent Jobs) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              {
                label: "งานที่โพสต์",
                value: jobs.length,
                icon: <FaClipboardList size={28} className="text-[#2e8b57]" />,
              },
              {
                label: "ผู้สมัคร",
                value: "1,209,321",
                icon: <FaUserPlus size={28} className="text-[#2e8b57]" />,
              },
              {
                label: "การแจ้งเตือนใหม่",
                value: "99+",
                icon: <FaClock size={28} className="text-[#2e8b57]" />,
              },
            ].map(({ label, value, icon }, index) => (
              <div
                key={index}
                className="bg-[#f9f9f9] p-5 rounded-xl shadow-md border border-gray-300 flex flex-col items-center transition hover:shadow-lg"
              >
                {icon}
                <h3 className="text-base font-semibold text-gray-700 mt-2">
                  {label}
                </h3>
                <p className="text-xl font-bold text-[#2e8b57]">{value}</p>
              </div>
            ))}
          </div>

          {/* Recent Jobs */}
          <div>
            <h1 className="text-lg font-semibold text-gray-700 mb-5 text-center">
              งานที่คุณโพสต์ล่าสุด
            </h1>

            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-[#f9f9f9] p-8 rounded-xl shadow-md border border-gray-300 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  ยังไม่มีงานที่โพสต์
                </h3>
                <p className="text-gray-500 mt-3 text-center">
                  เริ่มต้นโดยการโพสต์งานเพื่อดึงดูดผู้สมัคร!
                </p>
                <button
                  className={`mt-5 px-6 py-3 text-base rounded-lg shadow-md transition ${
                    user &&
                    (user.type === "EMPLOYER" || user.type === "COMPANY")
                      ? "bg-seagreen/80 hover:bg-seagreen text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    user &&
                    (user.type === "EMPLOYER" || user.type === "COMPANY") &&
                    navigate("/postjobemp")
                  }
                  disabled={
                    !user ||
                    (user.type !== "EMPLOYER" && user.type !== "COMPANY")
                  }
                >
                  + โพสต์งานใหม่
                </button>
              </div>
            ) : (
              <div className="relative">
                {/* Job Counter - แยกออกมาอยู่นอก carousel */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white border border-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    {`${currentIndex + 1}/${jobs.length}`}
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-10">
                  <button
                    onClick={prevSlide}
                    className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </div>

                {/* Job Cards */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {jobs.map((job, index) => (
                      <div
                        key={job.id}
                        className="w-full flex-shrink-0 bg-white p-5 rounded-xl shadow-md border border-gray-300 transition hover:shadow-lg"
                      >
                        {/* Job Title */}
                        <h3 className="text-lg font-bold text-gray-800 px-4">
                          {job.title}
                        </h3>

                        {/* Job Info */}
                        <div className="mt-2 space-y-2.5 text-gray-700 text-sm px-12">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.jobCategories.map((category) => (
                              <span
                                key={category.id}
                                className="bg-seagreen/10 text-seagreen px-3 py-1.5 rounded-full text-sm font-medium"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                          <p className="flex items-center font-medium">
                            <FaMapMarkerAlt
                              className="mr-2.5 text-[#2e8b57]"
                              size={16}
                            />
                            สถานที่ตั้ง: {job.jobLocation}
                          </p>
                          <p className="flex items-center font-medium">
                            <CiMoneyBill
                              className="mr-2.5 text-[#2e8b57]"
                              size={18}
                            />
                            เงินเดือน: {job.salary.toLocaleString()} บาท
                          </p>
                          <p className="flex items-center font-medium">
                            <FaClock
                              className="mr-2.5 text-[#2e8b57]"
                              size={16}
                            />
                            เวลาทำงาน: {job.workDates} | {job.workHoursRange}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                          <button
                            className="flex-1 bg-seagreen/80 hover:bg-seagreen text-white px-4 py-2 text-sm rounded-lg shadow-md transition"
                            onClick={() =>
                              navigate(`/employer/viewpost/${String(job.id)}`, {
                                state: { job },
                              })
                            }
                          >
                            ดูรายละเอียด
                          </button>
                          {user && job.userId === user.id && (
                            <button
                              className="bg-red-500 hover:bg-red-500/90 text-white px-4 py-2 text-sm rounded-lg shadow-md transition"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomepageEmployers;
