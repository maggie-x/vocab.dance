import React, { useState } from 'react';

interface SearchBarProps {
  searchString: string;
  onChange: (queryText: string) => void;
}

export const SearchBar = ({
  searchString,
  onChange,
}: SearchBarProps): React.ReactElement => {
  const [queryText, setQueryText] = useState<string>(searchString);

  return (
    <form>
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
        Search
      </label>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block px-4 py-3 pl-10 w-full text-sm text-gray-300 bg-gray-900 rounded-xl border border-gray-600 focus:border-pink-500 focus:outline-none"
          placeholder="Search moves..."
          required
          value={queryText}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.value);
            setQueryText(e.target.value);
            onChange(e.target.value);
          }}
        />
      </div>
    </form>
  );
};
