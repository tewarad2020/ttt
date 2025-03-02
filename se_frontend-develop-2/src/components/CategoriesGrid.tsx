import { Link } from "react-router-dom";
import {
  FaRocket,
  FaPaintBrush,
  FaCode,
  FaKeyboard,
  FaCamera,
} from "react-icons/fa";

function CategoriesGrid() {
  const categories = [
    {
      name: "เทรนด์มาแรง",
      icon: <FaRocket />,
      path: "/categories/trending",
    },
    {
      name: "งานฝีมือ",
      icon: <FaPaintBrush />,
      path: "/categories/graphic-design",
    },
    {
      name: "เว็บไซต์และเทคโนโลยี",
      icon: <FaCode />,
      path: "/categories/web-tech",
    },
    {
      name: "งานเขียนและงานเอกสาร",
      icon: <FaKeyboard />,
      path: "/categories/translation",
    },
    {
      name: "ภาพและเสียง",
      icon: <FaCamera />,
      path: "/categories/media",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 ">
      <div className="text-3xl font-bold mb-10 text-seagreen text-center m-10 kanit-light">
        คุณกำลังหางาน หรือ หาคนช่วยทำงานอยู่ใช่ไหม ?
      </div>

      {/* Main Container - Flex for row layout */}
      <div className="text-black kanit-light text-xl px-10">
        หมวดหมู่งานยอดนิยม
      </div>
      <div className="flex flex-wrap justify-center gap-6 m-8 rounded-2xl bg-gray-200 p-8">
        {categories.map((category, index) => (
          <Link
            to={category.path}
            key={index}
            className="flex flex-col items-center p-3 bg-white rounded-lg shadow-md w-48 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out transform"
          >
            {/* Icon */}
            <div className="text-5xl text-seagreen mb-4">{category.icon}</div>
            {/* Category Name */}
            <div className=" text-md text-gray-600 kanit-light">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoriesGrid;
