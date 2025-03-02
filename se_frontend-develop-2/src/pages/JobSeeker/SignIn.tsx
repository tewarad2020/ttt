import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginJobSeeker } from "../../api/JobSeeker";
import { loginCompany } from "../../api/Company";
import { loginEmployer } from "../../api/Employer"; // Assuming you have an Employer API
import { motion, AnimatePresence } from "framer-motion";

function SignIn() {
  const [nameEmail, setNameEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("jobseeker"); // Default to jobseeker
  const navigate = useNavigate();

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function for toast messages
  const notifyError = (message: string) =>
    toast.error(message, { position: "top-center" });
  const notifySuccess = (message: string) =>
    toast.success(message, { position: "top-center" });

  async function LoginUser(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let response;
      if (userType === "jobseeker") {
        response = await loginJobSeeker(nameEmail, password);
      } else if (userType === "company") {
        response = await loginCompany(nameEmail, password);
      } else if (userType === "employer") {
        response = await loginEmployer(nameEmail, password);
      }

      if (response) {
        notifySuccess("เข้าสู่ระบบสำเร็จ!"); // Show the notification after navigation
        if (userType === "jobseeker") {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/homeemp");
          }, 2000);
        }
      }
    } catch (error) {
      notifyError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleOauth() {
    window.open(
      "http://localhost:6977/api/user/job-seeker/oauth/google",
      "_self"
    );
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      LoginUser(event as unknown as React.FormEvent);
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />

      {/* Main Content */}
      <div
        className={`flex flex-col items-center justify-center flex-grow px-5 ${
          isSubmitting ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <div className="text-seagreen mb-9">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="logo" className="w-12 h-auto" />
            <span className="font-bold text-seagreen text-2xl leading-none">
              SkillBridge
            </span>
          </Link>
        </div>
        {/* Title */}
        <h1 className="kanit-bold text-xl text-center mb-2">เข้าสู่ระบบ</h1>

        {/* Form Section */}
        <div className="w-full max-w-sm space-y-3" onKeyDown={handleKeyDown}>
          {/* User Type Selection */}
          <div className="flex justify-center mb-4 space-x-2">
            <motion.button
              onClick={() => setUserType("jobseeker")}
              className={`${
                userType === "jobseeker"
                  ? "bg-seagreen text-white"
                  : "bg-white text-seagreen"
              } kanit-semibold py-2 px-4 rounded-lg border border-seagreen transition-colors duration-300 w-32`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ผู้หางาน
            </motion.button>
            <motion.button
              onClick={() => setUserType("employer")}
              className={`${
                userType === "employer"
                  ? "bg-seagreen text-white"
                  : "bg-white text-seagreen"
              } kanit-semibold py-2 px-4 rounded-lg border border-seagreen transition-colors duration-300 w-32`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ผู้จ้างงาน
            </motion.button>
            <motion.button
              onClick={() => setUserType("company")}
              className={`${
                userType === "company"
                  ? "bg-seagreen text-white"
                  : "bg-white text-seagreen"
              } kanit-semibold py-2 px-4 rounded-lg border border-seagreen transition-colors duration-300 w-32`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              บริษัท
            </motion.button>
          </div>

          {/* Username/Email Input */}
          <div className="flex flex-col">
            <label className="text-black text-sm mb-2 kanit-light">
              {userType === "company"
                ? "ชื่อบริษัทหรืออีเมล"
                : "ชื่อผู้ใช้งานหรืออีเมล"}
            </label>
            <input
              type="text"
              value={nameEmail}
              placeholder={
                userType === "company"
                  ? "ชื่อบริษัทหรืออีเมล"
                  : "ชื่อผู้ใช้งานหรืออีเมล"
              }
              onChange={(e) => setNameEmail(e.target.value)}
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <label className="text-black text-sm mb-2 kanit-light flex items-center">
                รหัสผ่าน
                <Link
                  to="/forgot-password"
                  className="text-seagreen kanit-semibold underline ml-2"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </label>
            </div>

            <input
              type="password"
              value={password}
              placeholder="รหัสผ่าน"
              onChange={(e) => setPassword(e.target.value)}
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              onClick={LoginUser}
              className="bg-seagreen text-white kanit-semibold w-full py-3 rounded-lg"
            >
              {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>
          <div className="flex flex-col justify-center  gap-2 items-center ">
            <button
              onClick={handleGoogleOauth}
              className="w-60 flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg
                className="h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="-0.5 0 48 48"
                version="1.1"
              >
                <g
                  id="Icons"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="Color-"
                    transform="translate(-401.000000, -860.000000)"
                  >
                    <g
                      id="Google"
                      transform="translate(401.000000, 860.000000)"
                    >
                      <path
                        d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                        id="Fill-1"
                        fill="#FBBC05"
                      >
                        {" "}
                      </path>
                      <path
                        d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                        id="Fill-2"
                        fill="#EB4335"
                      >
                        {" "}
                      </path>
                      <path
                        d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                        id="Fill-3"
                        fill="#34A853"
                      >
                        {" "}
                      </path>
                      <path
                        d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                        id="Fill-4"
                        fill="#4285F4"
                      >
                        {" "}
                      </path>
                    </g>
                  </g>
                </g>
              </svg>
              <span className="kanit-regular">เข้าสู่ระบบด้วย Google</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <Link
            to="/select-user-type"
            className="text-seagreen kanit-semibold underline"
          >
            ยังไม่ได้สมัครสมาชิก? สมัครที่นี่
          </Link>
        </div>
      </div>
      {/* Spinner Overlay */}
      {isSubmitting && (
        <div className="gap-2 absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          {/* Simple spinner */}
          <label className="text-white  kanit-semibold">กำลังเข้าสู่ระบบ</label>
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
