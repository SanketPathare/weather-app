import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" max-w-md mx-auto flex   gap-2 sm:gap-0"
    >
      <input
        type="text"
        placeholder="Search for a city"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
