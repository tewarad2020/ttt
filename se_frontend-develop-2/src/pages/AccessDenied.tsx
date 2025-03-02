import React from "react";
import { Link } from "react-router-dom";

function AccessDenied() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="mt-2 mb-4">
        <img src="/logo.png" className="h-auto w-20" />
      </div>

      <h1 className="text-6xl font-bold text-seagreen mb-4">Access Denied</h1>
      <p className="text-xl text-gray-600 mb-8 kanit-medium">
        คุณไม่มีสิทธิ์เข้าถึงหน้านี้
      </p>
      <div className="space-y-4">
        <Link
          to="/"
          className="block w-full text-center px-6 py-2 bg-seagreen  text-white rounded-md hover:bg-seagreen-dark transition duration-300 kanit-medium"
        >
          กลับไปยังหน้าหลัก
        </Link>
        <button
          onClick={() => window.history.back()}
          className="kanit-medium block w-full px-6 py-2 border border-seagreen text-seagreen rounded-md hover:bg-seagreen hover:text-white transition duration-300"
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}

export default AccessDenied;
