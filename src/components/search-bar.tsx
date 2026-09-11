import React from 'react';

interface SearchBarProps {
  searchString: string;
  onChange: (queryText: string) => void;
  placeholderText: string;
}

export const SearchBar = ({
  searchString,
  onChange,
  placeholderText,
}: SearchBarProps): React.ReactElement => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="move-search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="move-search"
          className="block px-4 py-3 pl-10 w-full text-sm text-zinc-300 bg-zinc-900 rounded-md border border-zinc-700 focus:border-pink-500 focus:outline-none"
          placeholder={placeholderText}
          value={searchString}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
};
