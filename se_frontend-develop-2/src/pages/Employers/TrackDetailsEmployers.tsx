import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavbarEmp } from "../../components/NavbarEmp";
import Footer from "../../components/Footer";
import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaStickyNote,
  FaFileAlt,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";

interface ApplicantDetails {
  id: number;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  resumeLink: string;
  status: string;
  notes: string;
}

const applicantData: ApplicantDetails[] = [
  {
    id: 1,
    name: "John Doe",
    jobTitle: "Frontend Developer",
    email: "johndoe@example.com",
    phone: "+1 234-567-890",
    resumeLink: "#",
    status: "Under Review",
    notes: "Looking good, consider for next round.",
  },
  {
    id: 2,
    name: "Jane Smith",
    jobTitle: "Backend Developer",
    email: "janesmith@example.com",
    phone: "+1 234-567-891",
    resumeLink: "#",
    status: "Shortlisted",
    notes: "Highly skilled in Node.js and Express.",
  },
];

const TrackEmployersDetails: React.FC = () => {
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const applicant = applicantData.find((app) => app.id === Number(id));

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

      <div className="kanit-regular max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
        {/* ✅ ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-700 hover:text-gray-500 transition flex items-center gap-2"
        >
          <FaArrowLeft size={20} /> <span className="text-lg">กลับ</span>
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          📌 รายละเอียดผู้สมัคร
        </h1>

        {/* ✅ ไม่พบผู้สมัคร */}
        {!applicant ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6 space-y-4 flex flex-col items-center">
            <FaExclamationTriangle className="text-red-500 text-6xl" />
            <p className="text-2xl font-semibold text-gray-800">
              ไม่พบข้อมูลผู้สมัคร
            </p>
            <p className="text-gray-600 text-lg">กรุณาตรวจสอบข้อมูลอีกครั้ง</p>
          </div>
        ) : (
          // ✅ พบข้อมูลผู้สมัคร
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6 space-y-4">
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <FaUser className="text-gray-600" /> <strong>ชื่อ:</strong>{" "}
              {applicant.name}
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <FaBriefcase className="text-red-500" />{" "}
              <strong>ตำแหน่งที่สมัคร:</strong> {applicant.jobTitle}
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> <strong>อีเมล:</strong>{" "}
              {applicant.email}
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <FaPhone className="text-green-500" /> <strong>เบอร์โทร:</strong>{" "}
              {applicant.phone}
            </p>
            <p
              className={`text-lg font-semibold flex items-center gap-2 ${
                applicant.status === "Under Review"
                  ? "text-yellow-500"
                  : applicant.status === "Shortlisted"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              <FaStickyNote className="text-gray-500" /> <strong>สถานะ:</strong>{" "}
              {applicant.status}
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <FaFileAlt className="text-gray-500" /> <strong>หมายเหตุ:</strong>{" "}
              {applicant.notes}
            </p>
            <a
              href={applicant.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:underline font-kanit flex items-center gap-2"
            >
              📄 ดูใบสมัคร
            </a>
          </div>
        )}

        {/* ✅ ปุ่มกลับ */}
        <div className="flex justify-center mt-8">
          <button 
            className="px-8 py-3 bg-seagreen hover:bg-seagreen/90 text-white rounded-lg shadow-md hover:bg-seagreen transition text-lg flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> กลับไปหน้าหลัก
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackEmployersDetails;
