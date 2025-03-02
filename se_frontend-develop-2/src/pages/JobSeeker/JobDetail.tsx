import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { FaBuilding, FaClock, FaStar, FaArrowLeft } from "react-icons/fa";
import { CiMoneyBill } from "react-icons/ci";
import Footer from "../../components/Footer";
import { Avatar } from "@mantine/core";
import { getJobPostById } from "../../api/EmployerAndCompany";
import { useUser } from "../../context/UserContext";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  workHours: string;
  salary: string;
  description: string;
  requirements: string;
  workDays: string;
  postedAt: string;
};

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
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
    console.log("🔎 กำลังโหลดข้อมูลงาน...");
    console.log("📌 Job ID จาก URL:", id);

    const fetchJobDetails = async () => {
      try {
        const response = await getJobPostById(id as string);
        console.log("✅ งานที่พบ:", response.data);
        const jobData = response.data;
        setJob({
          id: jobData.id,
          title: jobData.title,
          company: jobData.companyName || "ชื่อคนโพสต์",
          location: jobData.jobLocation,
          workHours: jobData.workHoursRange,
          salary: jobData.salary.toString(),
          description: jobData.description,
          requirements: jobData.skills.map((skill) => skill.name).join(", "),
          workDays: jobData.workDates,
          postedAt: jobData.createdAt,
        });
      } catch (error) {
        console.error("❌ ไม่พบงานนี้:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // ✅ ป้องกันหน้าค้างกรณี job โหลดไม่ทัน
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h2 className="text-gray-600 text-lg">⏳ กำลังโหลดข้อมูลงาน...</h2>
      </div>
    );
  }

  // ✅ แสดงข้อความหากไม่พบงาน
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 font-kanit">
        <h2 className="text-lg font-semibold text-red-500">❌ ไม่พบงานนี้</h2>
        <button
          className="mt-4 px-5 py-2 bg-seagreen text-white rounded-lg shadow-md hover:bg-[#246e4a] transition text-sm"
          onClick={() => navigate(-1)}
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-kanit">
      <Navbar
        user={user}
        isLoading={isLoading}
        isHaveUser={isHaveUser}
        refetchjobseeker={refetchjobseeker}
        refetchemployer={refetchemployer}
        refetchCompany={refetchCompany}
        isStale={isStale}
        setUser={setUser}
      />

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative">
          {/* 🔙 ปุ่มย้อนกลับ */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-3 transition"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>

          {/* Company Header */}
          <div className="p-6 border-b border-gray-200 text-center">
            <Avatar size="lg" radius="md" className="mx-auto mb-3" />
            <h1 className="text-xl font-semibold text-gray-800">
              {job.company || "ชื่อคนโพสต์"}
            </h1>
            <h3 className="text-lg font-medium text-gray-700">{job.title}</h3>
          </div>

          {/* Job Details */}
          <div className="p-5 space-y-4">
            {/* Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBuilding className="flex-shrink-0 text-seagreen h-5 w-5" />
                <span className="text-2xl kanit-regular">{job.location}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <FaClock className="flex-shrink-0 text-seagreen h-5 w-5" />
                <span className="text-2xl kanit-regular">
                  {job.workHours} ({job.workDays})
                </span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <CiMoneyBill className="flex-shrink-0 text-seagreen h-6 w-6" />
                <span className="text-2xl kanit-regular">
                  ฿{parseFloat(job.salary).toLocaleString()} บาท
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/reserved"
                className="bg-seagreen hover:bg-seagreen-dark text-white px-6 py-2 rounded-md text-sm text-center transition shadow-sm"
              >
                สมัครงานตอนนี้
              </Link>
              <button
                className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 
                         px-4 py-2 rounded-md border border-gray-200 transition-colors text-sm"
              >
                <FaStar
                  className={`h-5 w-5 ${
                    isStarred ? "text-yellow-400 fill-yellow-400" : ""
                  }`}
                />
                <span className="kanit-regular">บันทึกงาน</span>
              </button>
            </div>

            {/* Job Description */}
            <div className="space-y-3 pt-5">
              <section>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  รายละเอียดงาน
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  คุณสมบัติที่ต้องการ
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default JobDetail;
