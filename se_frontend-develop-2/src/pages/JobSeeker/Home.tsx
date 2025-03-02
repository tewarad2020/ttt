"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { NavbarEmp } from "../../components/NavbarEmp";
import Lottie from "lottie-react";
import Animation from "../../Animation/Job.json";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function Home() {
  const headingRef = useRef(null);
  const subTextRef = useRef(null);
  const link1Ref = useRef(null);
  const link2Ref = useRef(null);
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
    gsap.fromTo(
      subTextRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 2.5,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      [link1Ref.current, link2Ref.current],
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 3.5,
        ease: "power2.out",
        stagger: 0.5,
      }
    );

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      lottieRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 2.5,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white">
      {user?.type == "JOBSEEKER" || user?.type == null ? (
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
      ) : (
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
      )}
      <div className="kanit-regular flex-grow flex flex-col md:flex-row justify-center items-center p-6 md:p-16 gap-8 md:gap-16 ">
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl font-bold mb-6 text-green-700 leading-tight"
          >
            ยินดีต้อนรับสู่ <span className="text-seagreen">SkillBridge</span>
          </h1>
          <p
            ref={subTextRef}
            className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed kanit-regular"
          >
            แหล่งรวมงานสำหรับการหางานของบุคคลกลุ่มเฉพาะทาง
            ที่ช่วยเสริมสร้างความเท่าเทียมกันในสังคม
          </p>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Link
              to="/find"
              ref={link1Ref}
              className="group flex items-center justify-center md:justify-start text-xl md:text-2xl text-green-600 hover:text-green-700 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 mr-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="currentColor"
              >
                <path d="M8 4l8 8-8 8V4z" />
              </svg>
              <span className="border-b-2 border-green-500 pb-1 kanit-regular">
                เริ่มค้นหางานที่นี่
              </span>
            </Link>
            <Link
              to="/homeemp"
              ref={link2Ref}
              className="group flex items-center justify-center md:justify-start text-xl md:text-2xl text-green-600 hover:text-green-700 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 mr-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="currentColor"
              >
                <path d="M8 4l8 8-8 8V4z" />
              </svg>
              <span className="border-b-2 border-green-500 pb-1 kanit-regular">
                เริ่มค้นหาพนักงาน
              </span>
            </Link>
          </div>
        </div>
        <div ref={lottieRef} className="w-full max-w-md md:max-w-lg">
          <Lottie animationData={Animation} />
        </div>
      </div>
    </div>
  );
}

export default Home;
