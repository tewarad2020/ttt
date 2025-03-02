import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Link } from "react-router-dom";

// Import Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function SignUpJobSeek() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Replace 'isChecked' with your actual checkbox/terms logic
  const [isChecked, setIsChecked] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function for toast messages
  const notifyError = (message: string) =>
    toast.error(message, { position: "top-center" });
  const notifySuccess = (message: string) =>
    toast.success(message, { position: "top-center" });

  async function RegisterJobseek(e: React.FormEvent) {
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

      const response = await fetch(
        "http://localhost:6977/api/user/job-seeker",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const { msg, data } = await response.json();

      // If the server returns an error status (example)
      if (!response.ok) {
        notifyError(msg || "มีข้อผิดพลาด กรุณาลองอีกครั้ง");
      } else {
        notifySuccess(msg || "สมัครสมาชิกสำเร็จ!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        // TODO: e.g. Redirect the user or clear the form
      }
      console.log(data);
    } catch (error) {
      notifyError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`h-screen flex flex-col relative `}>
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
        <h1 className="kanit-bold text-xl text-center mb-6 mt-4">
          สมัครสมาชิก (สําหรับคนหางาน)
        </h1>

        {/* Form Section */}
        <form onSubmit={RegisterJobseek} className="w-full max-w-sm space-y-2">
          {/* Name Input */}
          <div className="flex flex-col">
            <label className="text-black text-sm mb-1 kanit-light">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              value={name}
              placeholder={"กรอกชื่อ-นามสกุล"}
              className="text-black placeholder-kanit rounded-lg border border-gray-300 p-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-black text-sm mb-1 kanit-light">อีเมล</label>
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
            <label className="text-black text-sm mb-1 kanit-light">
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
            <label className="text-black text-sm mb-1 kanit-light">
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
              onClick={RegisterJobseek}
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
              {isSubmitting ? "กำลังดำเนินการ..." : "สมัครสมาชิก (คนหางาน)"}
            </button>
          </div>
          <div>
            <div className="flex flex-col justify-center  gap-2 items-center ">
              <button className="w-64 flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
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
                <span className="kanit-regular">สมัครสมาชิกด้วย Google</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center mb-4">
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

export default SignUpJobSeek;
