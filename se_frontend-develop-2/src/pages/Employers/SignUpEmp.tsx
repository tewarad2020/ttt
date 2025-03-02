import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Import Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";

function SignUpEmp() {
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
  const navigate = useNavigate();
  const [userType, setUserType] = useState("employer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Replace 'isChecked' with your actual checkbox/terms logic
  const [isChecked, setIsChecked] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function for toast messages
  const notifyError = (message: string) =>
    toast.error(message, { position: "top-center" });
  const notifySuccess = (message: string) =>
    toast.success(message, { position: "top-center" });

  async function RegisterEmployer(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifyError("กรุณากรอกอีเมลให้ถูกต้อง!");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      notifyError("รหัสผ่านไม่ตรงกัน!");
      setIsSubmitting(false);
      return;
    }

    try {
      const body = {
        name: name,
        email: email,
        password: password,
        confirmPassword: password,
      };

      const response = await fetch("http://localhost:6977/api/user/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const { msg, data } = await response.json();

      // If the server returns an error status (example)
      if (!response.ok) {
        notifyError(msg || "มีข้อผิดพลาด กรุณาลองอีกครั้ง");
      } else {
        notifySuccess(msg || "สมัครสมาชิกสำเร็จ!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      console.log(data);
    } catch (error) {
      notifyError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function RegisterCompany(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifyError("กรุณากรอกอีเมลให้ถูกต้อง!");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      notifyError("รหัสผ่านไม่ตรงกัน!");
      setIsSubmitting(false);
      return;
    }

    try {
      const body = {
        officialName: name,
        email: email,
        password: password,
        confirmPassword: password,
      };

      const response = await fetch("http://localhost:6977/api/user/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const { msg, data } = await response.json();

      // If the server returns an error status (example)
      if (!response.ok) {
        notifyError(msg || "มีข้อผิดพลาด กรุณาลองอีกครั้ง");
      } else {
        notifySuccess(msg || "สมัครสมาชิกสำเร็จ!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      console.log(data);
    } catch (error) {
      notifyError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ตรวจสอบ userType แล้วเรียกฟังก์ชัน
    if (userType === "employer") {
      RegisterEmployer(e);
    } else {
      RegisterCompany(e);
    }
  }

  return (
    <div className="h-screen flex flex-col relative">
      {/* Toast Container for notifications */}
      <ToastContainer />

      {/* Navbar */}
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
      <div
        className={`flex flex-col items-center justify-center flex-grow px-5 transition duration-300 ${
          isSubmitting ? "pointer-events-none blur-sm" : ""
        }`}
      >
        {/* Title */}
        <h1 className="kanit-bold text-xl text-center mb-6 mt-6">
          {userType === "employer"
            ? "สมัครสมาชิก (นายจ้าง)"
            : "สมัครสมาชิก (บริษัท)"}
        </h1>

        {/* Toggle Buttons */}
        <div className="flex space-x-4 mb-8">
            <motion.button
            onClick={() => setUserType("employer")}
            className={`w-32 px-4 py-2 rounded-lg transition-colors duration-300 kanit-semibold ${
              userType === "employer"
              ? "bg-seagreen text-white"
              : "bg-gray-200 text-black"
            }`}

            whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            นายจ้าง
            </motion.button>
            <motion.button
            onClick={() => setUserType("company")}
            className={`w-32 px-4 py-2 rounded-lg transition-colors duration-300 kanit-semibold ${
              userType === "company"
              ? "bg-seagreen text-white"
              : "bg-gray-200 text-black"
            }`}

            whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            บริษัท
            </motion.button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
          {/* Name Input */}
          <div className="flex flex-col">
            <label className="text-black text-sm mb-2 kanit-light">
              {userType === "employer" ? "ชื่อ-นามสกุล" : "ชื่อบริษัท"}
            </label>
            <input
              type="text"
              value={name}
              placeholder={
                userType === "employer" ? "กรอกชื่อ-นามสกุล" : "กรอกชื่อบริษัท"
              }
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-black text-sm mb-2 kanit-light">อีเมล</label>
            <input
              type="email"
              value={email}
              placeholder="กรอกอีเมล"
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="text-black text-sm mb-2 kanit-light">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              placeholder="รหัสผ่าน"
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-black text-sm mb-2 kanit-light">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="ยืนยันรหัสผ่าน"
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Example Checkbox */}
         <div className="flex flex-row items-center gap-2 text-left">
                     <input
                       type="checkbox"
                       id="agree"
                       checked={isChecked}
                       onChange={(e) => setIsChecked(e.target.checked)}
                     />
                     <label htmlFor="agree" className="text-black kanit-light text-sm">
                       ฉันยอมรับ
                       <Link
                         to="/terms"
                         className="text-blue-500 hover:text-blue-400 text-bold"
                       >
                         {" "}
                         เงื่อนไขในการใช้บริการ
                       </Link>
                     </label>
                   </div>

          {/* Sign Up Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isChecked || isSubmitting}
              className={`
    w-full py-3 rounded-lg kanit-semibold text-white
    ${
      !isChecked || isSubmitting
        ? "bg-gray-300 cursor-not-allowed" // disabled style
        : "bg-seagreen cursor-pointer" // enabled style
    }
  `}
            >
              {isSubmitting
                ? "กำลังดำเนินการ..."
                : userType === "employer"
                ? "สมัครสมาชิก (นายจ้าง)"
                : "สมัครสมาชิก (บริษัท)"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <Link to="/SignIn" className="text-seagreen kanit-semibold underline">
            มีบัญชีแล้ว? เข้าสู่ระบบที่นี่
          </Link>
        </div>
      </div>

      {/* Spinner Overlay */}
      {isSubmitting && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          {/* Simple spinner */}
          <label className="text-white  kanit-semibold">กำลังสมัครสมาชิก</label>
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default SignUpEmp;
