import { useState, useEffect, useRef } from "react";
import { Navbar } from "../../components/Navbar";
import Lottie from "lottie-react"; // Lottie animation
import Animation from "../../Animation/Job2.json"; // Lottie animation
import { gsap } from "gsap"; // For animations
import { Link } from "react-router-dom"; // For navigation
import { useUser } from "../../context/UserContext";

interface JobApplication {
  id: number;
  companyName: string;
  status: string;
  date: string;
}

function TrackJobSeeker() {
  const [applications, setApplications] = useState<JobApplication[]>([
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
  ]);

  const headingRef = useRef(null);
  const tableRef = useRef(null);
  const lottieRef = useRef(null);

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the current applications to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination function
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  useEffect(() => {
    refetchjobseeker();
    refetchCompany();
    refetchemployer();
    setIsHaveUser(!!user);
  }, [user, isLoading, isStale]);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2.5, ease: "power2.out" }
    );
    gsap.fromTo(
      tableRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 2.5, ease: "power2.out" }
    );
    gsap.fromTo(
      lottieRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2.5, ease: "power2.out" }
    );
  }, []);

  function handleDelete(id: number): void {
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== id)
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
      <div className="min-h-screen flex flex-col md:flex-row bg-white text-[#2e8b57] justify-center items-center p-4 md:p-8">
        <div className="flex flex-col items-center md:items-start py-6 text-center md:text-left kanit-light">
          <div
            ref={headingRef}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6"
          >
            ข้อมูลการสมัครงานทั้งหมดของคุณ
          </div>

          <div ref={tableRef} className="w-full text-gray-600">
            <div className="overflow-x-auto max-h-[400px]">
              <table
                border={1}
                className="w-full text-left mt-6 border-collapse border border-gray-300"
              >
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border border-gray-300">ชื่อบริษัท</th>
                    <th className="p-2 border border-gray-300">
                      สถานะการสมัคร
                    </th>
                    <th className="p-2 border border-gray-300">วันเวลา</th>
                    <th className="p-2 border border-gray-300">
                      รายละเอียดข้อมูลการสมัครงาน
                    </th>
                    <th className="p-2 border border-gray-300">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="p-2 border border-gray-300">
                        {app.companyName}
                      </td>
                      <td className="p-2 border border-gray-300">
                        {app.status}
                      </td>
                      <td className="p-2 border border-gray-300">{app.date}</td>
                      <td className="p-2 border border-gray-300">
                        <Link
                          to={`/trackJobseeker/${app.id}`}
                          className="text-red-600"
                        >
                          รายละเอียด
                        </Link>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <button onClick={() => handleDelete(app.id)}>ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 mx-1 border border-gray-300 ${
                    currentPage === number ? "bg-seagreen text-white" : ""
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">ค้นหางานเพิ่มเติม</h2>
            <div className="flex justify-center mx-5">
              <Link
                to="/find"
                className="bg-gradient-to-r from-green-500 to-seagreen text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                🔍 ไปยังหน้าค้นหางาน
              </Link>
            </div>
          </div>
        </div>

        <div ref={lottieRef} className="w-full max-w-xs md:max-w-xl">
          <Lottie animationData={Animation} />
        </div>
      </div>
    </div>
  );
}

export default TrackJobSeeker;
