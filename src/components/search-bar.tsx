import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Move, movePath } from '../data/config';
import { STYLES } from '../data/styles';
import { posterFor } from './move/gif';
import StyleLabel from './style';

interface SearchBarProps {
  searchString: string;
  onChange: (queryText: string) => void;
  onSelect: (move: Move) => void;
  results: Array<Move>;
  placeholderText: string;
}

export const SearchBar = ({
  searchString,
  onChange,
  onSelect,
  results,
  placeholderText,
}: SearchBarProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const showResults = open && searchString.trim() !== '';

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchString]);

  useEffect(() => {
    if (!showResults) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showResults]);

  const select = (move: Move) => {
    setOpen(false);
    onSelect(move);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || results.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(results[activeIndex === -1 ? 0 : activeIndex]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={(e) => e.preventDefault()} role="search">
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
            autoComplete="off"
            role="combobox"
            aria-expanded={showResults}
            aria-controls="move-search-results"
            aria-autocomplete="list"
            className="block px-4 py-3 pl-10 w-full text-sm text-zinc-300 bg-zinc-900 rounded-md border border-zinc-700 focus:border-pink-500 focus:outline-none"
            placeholder={placeholderText}
            value={searchString}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </form>
      {showResults && (
        <ul
          id="move-search-results"
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-96 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-800 py-1 shadow-lg"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-zinc-400">
              No moves match '{searchString}'
            </li>
          )}
          {results.map((move, index) => (
            <li
              key={movePath(move.style, move.name)}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(move)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 cursor-pointer',
                index === activeIndex ? 'bg-zinc-700' : 'hover:bg-zinc-700'
              )}
            >
              <img
                src={posterFor(move.gifLink)}
                alt=""
                loading="lazy"
                className="w-16 aspect-video shrink-0 rounded object-cover bg-zinc-900"
              />
              <span className="flex-1 min-w-0 truncate text-sm text-zinc-100">
                <Highlight text={move.name} query={searchString} />
              </span>
              <StyleLabel slug={move.style} className="text-[10px]" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Highlight = ({ text, query }: { text: string; query: string }) => {
  const trimmed = query.trim();
  const start = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (trimmed === '' || start === -1) {
    return <>{text}</>;
  }
  const end = start + trimmed.length;
  return (
    <>
      {text.slice(0, start)}
      <span className="font-bold text-pink-400">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  );
};

export const searchAllMoves = (
  query: string,
  preferredStyle: keyof typeof STYLES,
  limit = 8
): Array<Move> => {
  const needle = query.trim().toLowerCase();
  if (needle === '') {
    return [];
  }
  const matches = (moves: Array<Move>) =>
    moves.filter((move) => move.name.toLowerCase().includes(needle));
  const preferred = matches(STYLES[preferredStyle].moves);
  const others = Object.entries(STYLES)
    .filter(([slug]) => slug !== preferredStyle)
    .flatMap(([, config]) => matches(config.moves));
  return [...preferred, ...others].slice(0, limit);
};
