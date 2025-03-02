//TrackDetailsJobSeeker.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
// Define the JobApplication interface
interface JobApplication {
  id: number;
  companyName: string;
  status: string;
  date: string;
}

// Mock data for demonstration
const mockApplications: JobApplication[] = [
  {
    id: 1,
    companyName: "บริษัท A",
    status: "กำลังยื่นคำขอ",
    date: "2025-01-14",
  },
  {
    id: 2,
    companyName: "บริษัท B",
    status: "รอสัมภาษณ์",
    date: "2025-02-01",
  },
  {
    id: 3,
    companyName: "บริษัท C",
    status: "ยืนยันการรับสมัคร",
    date: "2025-02-10",
  },
  {
    id: 4,
    companyName: "บริษัท D",
    status: "กำลังยื่นคำขอ",
    date: "2025-02-15",
  },
  {
    id: 5,
    companyName: "บริษัท E",
    status: "รอสัมภาษณ์",
    date: "2025-02-20",
  },
  {
    id: 6,
    companyName: "บริษัท F",
    status: "ยืนยันการรับสมัคร",
    date: "2025-02-25",
  },
  {
    id: 7,
    companyName: "บริษัท G",
    status: "กำลังยื่นคำขอ",
    date: "2025-03-01",
  },
  {
    id: 8,
    companyName: "บริษัท H",
    status: "รอสัมภาษณ์",
    date: "2025-03-05",
  },
  {
    id: 9,
    companyName: "บริษัท I",
    status: "ยืนยันการรับสมัคร",
    date: "2025-03-10",
  },
  {
    id: 10,
    companyName: "บริษัท J",
    status: "กำลังยื่นคำขอ",
    date: "2025-03-15",
  },
];

function TrackDetailsJobSeeker() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  // Find the application details by ID
  const application = mockApplications.find((app) => app.id === Number(id));

  if (!application) {
    return (
      <div>
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
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-600">ไม่พบข้อมูล</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
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
      <div className="min-h-screen flex flex-col items-center bg-white text-[#2e8b57] p-4">
        <h1 className="text-4xl font-bold mb-6">
          รายละเอียดการสมัครงาน #{application.id}
        </h1>
        <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg mb-4">
            <strong>ชื่อบริษัท:</strong> {application.companyName}
          </p>
          <p className="text-lg mb-4">
            <strong>สถานะการสมัคร:</strong> {application.status}
          </p>
          <p className="text-lg mb-4">
            <strong>วันเวลา:</strong> {application.date}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackDetailsJobSeeker;
