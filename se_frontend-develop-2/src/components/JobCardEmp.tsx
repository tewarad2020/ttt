import React, { useState } from "react";
import { FaStar, FaArrowRight, FaMapPin, FaClock } from "react-icons/fa";
import { TbCurrencyBaht } from "react-icons/tb";
import { Link } from "react-router-dom";

type JobCardEmpProps = {
  id: string | number;
  title: string;
  workDays?: string;
  workHours?: string;
  location: string;
  salary: number;
  jobCategories?: {
    id: string;
    name: string;
    description: string;
  }[];
};

function JobCardEmp({
  id,
  title,
  workDays,
  workHours,
  location,
  salary,
  // jobCategories,
}: JobCardEmpProps) {
  const [isFav, setIsFav] = useState(false);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <div className="kanit-relative bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 w-full">
      <button
        onClick={handleFav}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-50"
      >
        <FaStar className={isFav ? "text-yellow-400" : "text-gray-300"} />
      </button>

      <Link to={`/employer/details/${id}`} className="block space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{title}</h2>

        <div className="flex flex-col space-y-1 text-gray-600">
          <div className="flex items-center">
            <TbCurrencyBaht className="text-seagreen mr-1.5" />
            <span>฿{salary.toLocaleString()}</span>
          </div>

          <div className="flex items-center">
            <FaMapPin className="text-seagreen mr-1.5" />
            <span>{location}</span>
          </div>

          {/* {jobCategories && (
            <div className="flex items-center">
              <FaTags className="text-seagreen mr-1.5" />
              <span className="line-clamp-1">
                {jobCategories.map(cat => cat.name).join(', ')}
              </span>
            </div>
          )} */}

          <div className="flex items-center">
            <FaClock className="text-seagreen mr-1.5" />
            <span className="line-clamp-1">
              {workDays} | {workHours}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center text-emerald-600 group-hover:text-emerald-700">
          <span>รายละเอียด</span>
          <FaArrowRight className="ml-1.5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
}

export default JobCardEmp;