import React, { useState } from "react";

const SearchForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (searchTerm === "") {
      setIsFocused(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search Term:", searchTerm);
    // Handle search submission logic here (e.g., API call)
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-black sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="block w-full p-4 ps-10 text-sm text-black border border-[#2e8b57] rounded-lg bg-white focus:ring-[#2e8b57] focus:border-[#2e8b57]"
          placeholder="Search for job or employee . . ."
          required
        />
        {/* The search button */}
        <button
          type="submit"
          className={` kanit-light text-white absolute right-1.5 bottom-1.5 bg-[#2e8b57] hover:bg-[#267c4e] focus:ring-4 focus:outline-none focus:ring-[#2e8b57] font-medium rounded-lg text-lg px-4 py-2 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
            isFocused || searchTerm
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
