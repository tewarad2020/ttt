"use client"

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"

export default function UserTypeWizard() {
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false)

  const handleNavigation = (path: string) => {
    setIsExiting(true)
    setTimeout(() => {
      navigate(path)
    }, 500) // Adjust this delay to match your animation duration
  }

  // เมื่อผู้ใช้เลือกหางาน
  const handleSeek = () => {
    handleNavigation("/signUp/job-seeker")
  }

  // เมื่อผู้ใช้เลือกหาคนทำงาน
  const handleEmploy = () => {
    handleNavigation("/signUp/employer")
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 kanit-regular"
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md relative overflow-hidden">
        {/* Title */}
        <h1 className="text-xl font-bold text-center mb-6">เลือกประเภทผู้ใช้งาน</h1>

        {/* SINGLE STEP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="transition-all duration-700 opacity-100 translate-x-0"
        >
          <p className="mb-4 text-center">คุณต้องการทำอะไร?</p>
          <div className="flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSeek}
              className="bg-seagreen text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              ฉันต้องการหางาน
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEmploy}
              className="bg-seagreen text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              ฉันต้องการหาคนทำงาน
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

