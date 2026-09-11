import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Move from '../components/move';
import MoveRow from '../components/move/move-row';
import { SearchBar, searchAllMoves } from '../components/search-bar';
import StyleFilter from '../components/style-filter/style-filter';
import { ViewMode } from '../components/view-menu/view-menu';
import { Move as MoveType, movePath, StyleSlug } from '../data/config';
import { STYLES } from '../data/styles';

const PAGE_SIZE = 12;

interface MainProps {
  slug: StyleSlug;
  viewMode: ViewMode;
}

const Main = ({ slug, viewMode }: MainProps) => {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { label, moves } = STYLES[slug];

  const filteredMoves = filterByString(queryText, moves);
  const visibleMoves = filteredMoves.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMoves.length;
  const noMovesFound = filteredMoves.length === 0;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  const handleSearchChange = (nextQueryText: string) => {
    setQueryText(nextQueryText);
    setVisibleCount(PAGE_SIZE);
  };

  const noMovesMessage = (
    <div className="col-span-full flex flex-col gap-y-2 px-6 mb-4 max-w-sm mx-auto">
      <div className="text-center text-zinc-400">
        No moves found for <br /> '{queryText}'.
      </div>
      <div className="text-center text-zinc-400 text-xs">
        If you're looking for moves of a style other than {label}, please click
        on the desired style above the search bar to switch between style
        modes.
      </div>
    </div>
  );

  const counter = (shown: number) => (
    <p className="mt-6 text-center text-sm text-gray-500">
      <span className="font-semibold text-gray-300">{shown}</span> of{' '}
      <span className="font-semibold text-gray-300">{filteredMoves.length}</span>{' '}
      moves
    </p>
  );

  return (
    <>
      <div className="flex flex-col space-y-3 max-w-sm mx-auto">
        <StyleFilter
          activeStyle={slug}
          handleStyleClick={(nextSlug) => navigate(`/${nextSlug}`)}
        />
        <SearchBar
          searchString={queryText}
          onChange={handleSearchChange}
          onSelect={(move) => navigate(movePath(move.style, move.name))}
          results={searchAllMoves(queryText, slug)}
          placeholderText={`Search ${label.toLowerCase()} moves...`}
        />
      </div>

      {viewMode === 'list' ? (
        <div className="mt-12 max-w-xl mx-auto">
          <ul>
            {filteredMoves.map((move) => (
              <MoveRow key={move.name} {...move} />
            ))}
          </ul>
          {noMovesFound ? noMovesMessage : counter(filteredMoves.length)}
        </div>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {visibleMoves.map((move) => (
              <Move key={move.name} {...move} />
            ))}
            {noMovesFound && noMovesMessage}
          </div>
          {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
          {!noMovesFound && counter(visibleMoves.length)}
        </>
      )}
    </>
  );
};

export default Main;

const filterByString = (
  queryText: string,
  dataToFilter: Array<MoveType>
): Array<MoveType> => {
  const query = queryText.trim().toLowerCase();
  if (query === '') {
    return dataToFilter;
  }
  return dataToFilter.filter((move) => move.name.toLowerCase().includes(query));
};
