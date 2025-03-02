// components/JobCard.tsx
import React, { useState } from "react";
import { FaStar, FaArrowRight, FaMapPin, FaClock } from "react-icons/fa";
import { TbCurrencyBaht } from "react-icons/tb";
import { Link } from "react-router-dom";

type JobCardProps = {
  id: string | number;
  title: string;
  workDays?: string;
  workHours?: string;
  location?: string;
  salary: number | string;
};

function JobCard({
  id,
  title,
  workDays,
  workHours,
  location,
  salary,
}: JobCardProps) {
  const [isFav, setIsFav] = useState(false);

  const formatSalary = () => {
    if (typeof salary === "number") {
      return salary.toLocaleString("th-TH");
    }
    if (!isNaN(Number(salary))) {
      return Number(salary).toLocaleString("th-TH");
    }
    return salary;
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <div className="kanit-regular group relative bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 w-full">
      <button
        onClick={handleFav}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-50 transition-colors"
      >
        <FaStar
          size={20}
          className={`transition-colors ${
            isFav
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 group-hover:text-gray-400"
          }`}
        />
      </button>

      <Link to={`/jobseeker/details/${String(id)}`} className="block space-y-4">
        <div className="pr-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
            {title || "ไม่ระบุชื่องาน"}
          </h2>
        </div>

        <div className="flex flex-col space-y-1 text-gray-600">
          <div className="flex items-center">
            <TbCurrencyBaht size={16} className="mr-1.5 text-seagreen" />
            <span>
              {typeof salary === "string" && salary.startsWith("฿") 
                ? salary
                : `฿${formatSalary()}`}
            </span>
          </div>

          <div className="flex items-center">
            <FaMapPin size={16} className="mr-1.5 text-seagreen" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center">
            <FaClock size={16} className="mr-1.5 text-seagreen" />
            <div className="flex flex-col sm:flex-row sm:gap-1 line-clamp-1">
              <span>{workDays}</span>
              {(workDays && workHours) && (
                <span className="hidden sm:inline">|</span>
              )}
              <span>{workHours}</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
            <span>รายละเอียด</span>
            <FaArrowRight
              size={16}
              className="ml-1.5 transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default JobCard;