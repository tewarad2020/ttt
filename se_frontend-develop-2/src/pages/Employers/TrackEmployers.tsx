import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarEmp } from "../../components/NavbarEmp";
import Footer from "../../components/Footer";
import { FaArrowLeft } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

interface Application {
  id: number;
  applicantName: string;
  jobTitle: string;
  status: string;
}

// ✅ ฟังก์ชันแปลงสถานะเป็นภาษาไทย + จัดสี
const translateStatus = (status: string) => {
  const statusMap: Record<string, { text: string; color: string }> = {
    "Under Review": { text: "กำลังตรวจสอบ", color: "text-yellow-500" },
    Shortlisted: { text: "ผ่านการคัดเลือก", color: "text-green-500" },
    Rejected: { text: "ไม่ผ่านการคัดเลือก", color: "text-red-500" },
    Hired: { text: "ได้รับการจ้างงาน", color: "text-blue-500" },
  };
  return statusMap[status] || { text: status, color: "text-gray-700" };
};

const TrackEmployers: React.FC = () => {
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
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      applicantName: "John Doe",
      jobTitle: "นักพัฒนา Frontend",
      status: "Under Review",
    },
    {
      id: 2,
      applicantName: "Jane Smith",
      jobTitle: "นักพัฒนา Backend",
      status: "Shortlisted",
    },
    {
      id: 3,
      applicantName: "Alice Johnson",
      jobTitle: "นักออกแบบ UI/UX",
      status: "Rejected",
    },
    {
      id: 4,
      applicantName: "Bob Brown",
      jobTitle: "นักวิทยาศาสตร์ข้อมูล",
      status: "Hired",
    },
    {
      id: 5,
      applicantName: "Charlie Green",
      jobTitle: "นักพัฒนา Mobile",
      status: "Under Review",
    },
    {
      id: 6,
      applicantName: "Diana White",
      jobTitle: "วิศวกร DevOps",
      status: "Shortlisted",
    },
  ]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-kanit">
      {/* Navbar */}
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

      <div className="kanit-regular max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg relative">
        {/* 🔙 ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-800 hover:text-gray-600 transition"
        >
          <FaArrowLeft size={24} />
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          ติดตามใบสมัคร
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow-md bg-gray-50">
            <thead>
              <tr className="bg-seagreen/80 text-white text-lg">
                <th className="p-4">#</th>
                <th className="p-4 text-left">ชื่อผู้สมัคร</th>
                <th className="p-4 text-left">ตำแหน่งงาน</th>
                <th className="p-4 text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => {
                const { text, color } = translateStatus(application.status);
                return (
                  <tr
                    key={application.id}
                    className="border-b border-gray-300 hover:bg-gray-200 cursor-pointer transition"
                    onClick={() => navigate(`/track/${application.id}`)}
                  >
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4 text-left">
                      {application.applicantName}
                    </td>
                    <td className="p-4 text-left">{application.jobTitle}</td>
                    <td className={`p-4 text-left font-semibold ${color}`}>
                      {text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TrackEmployers;
