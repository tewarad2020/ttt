import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { NavbarEmp } from "../../components/NavbarEmp";
import { FaBuilding, FaClock, FaStar, FaArrowLeft } from "react-icons/fa";
import { CiMoneyBill } from "react-icons/ci";
import Footer from "../../components/Footer";
import { Avatar } from "@mantine/core";
import { getJobFindingPostById } from "../../api/JobSeeker";
import { useUser } from "../../context/UserContext";

type Job = {
  id: string;
  title: string;
  username: string | null;
  location: string;
  workHours: string;
  salary: string;
  description: string;
  requirements: string;
  workDays: string;
  postedAt: string;
};

function JobDetailEmp() {
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

  const { id } = useParams();
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

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
        const response = await getJobFindingPostById(id as string);
        const jobData = response.data; // Correctly access the job data

        console.log("✅ งานที่พบ:", response);
        if (!jobData) {
          throw new Error("Job data is undefined");
        }

        const job: Job = {
          id: jobData.id,
          title: jobData.title,
          username: jobData.jobSeekerId || jobData.oauthJobSeekerId, // Assuming username is jobSeekerId
          location: jobData.jobLocation,
          workHours: jobData.workHoursRange,
          salary: jobData.expectedSalary.toString(),
          description: jobData.description,
          requirements: jobData.skills.map((skill) => skill.name).join(", "),
          workDays: jobData.workDates,
          postedAt: jobData.createdAt,
        };
        setJob(job);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
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

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden relative">
          {/* 🔙 ปุ่มย้อนกลับ */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>

          {/* username Header */}
          <div className="p-6 border-b border-gray-200 text-center">
            <Avatar size="lg" radius="md" className="mx-auto mb-3" />
            <h1 className="text-xl font-semibold text-gray-800">
              {job.username || "ไม่ระบุบริษัท"}
            </h1>
            <h3 className="text-lg font-medium text-gray-700">{job.title}</h3>
          </div>

          {/* Job Details */}
          <div className="p-5 space-y-4">
            {/* Info Grid */}
            <div className="grid gap-3 sm:grid-cols-2 text-gray-700 text-sm">
              <p className="flex items-center">
                <FaBuilding className="mr-2 text-seagreen h-4 w-4" />{" "}
                {job.location}
              </p>
              <p className="flex items-center">
                <FaClock className="mr-2 text-seagreen h-4 w-4" />{" "}
                {job.workHours} ({job.workDays})
              </p>
              <p className="flex items-center">
                <CiMoneyBill className="mr-2 text-seagreen h-5 w-5" /> ฿
                {parseFloat(job.salary).toLocaleString()} บาท
              </p>
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
                onClick={() => setIsStarred((prev) => !prev)}
                className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 
                         px-4 py-2 rounded-md border border-gray-200 transition-colors text-sm"
              >
                <FaStar
                  className={`h-4 w-4 ${
                    isStarred ? "text-yellow-400 fill-yellow-400" : ""
                  }`}
                />
                <span>บันทึกงาน</span>
              </button>
            </div>

            {/* Job Description */}
            <div className="space-y-3 pt-5">
              <section>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  ประสบการณ์
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  คุณสมบัติที่มี
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

export default JobDetailEmp;
