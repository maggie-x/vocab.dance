import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from 'react-use-pagination';
import Button from '../components/button';
import Move from '../components/move';
import { SearchBar } from '../components/search-bar';
import StyleFilter from '../components/style-filter/style-filter';
import { Move as MoveType, StyleSlug } from '../data/config';
import { STYLES } from '../data/styles';

const PAGE_SIZE = 12;

interface MainProps {
  slug: StyleSlug;
}

const Main = ({ slug }: MainProps) => {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState<string>('');
  const { label, moves } = STYLES[slug];

  const filteredMoves = filterByString(queryText, moves);

  const {
    startIndex,
    endIndex,
    setPage,
    setPreviousPage,
    setNextPage,
    previousEnabled,
    nextEnabled,
  } = usePagination({
    totalItems: filteredMoves.length,
    initialPageSize: PAGE_SIZE,
  });

  const paginatedMoves = filteredMoves.slice(startIndex, endIndex + 1);
  const noMovesFound = filteredMoves.length === 0;

  const handleSearchChange = (nextQueryText: string) => {
    setQueryText(nextQueryText);
    setPage(0);
  };

  const goToPage = (changePage: () => void) => {
    changePage();
    window.scrollTo(0, 0);
  };

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
          placeholderText={`Search ${label.toLowerCase()} moves...`}
        />
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginatedMoves.map((move) => (
          <Move key={move.name} {...move} />
        ))}
        {noMovesFound && (
          <div className="col-span-full flex flex-col gap-y-2 px-6 mb-4 max-w-sm mx-auto">
            <div className="text-center text-zinc-400">
              No moves found for <br /> '{queryText}'.
            </div>
            <div className="text-center text-zinc-400 text-xs">
              If you're looking for moves of a style other than {label}, please
              click on the desired style above the search bar to switch between
              style modes.
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex mt-6 justify-center">
          <Button
            onClick={() => goToPage(setPreviousPage)}
            ctaText="Previous"
            disabled={!previousEnabled}
          />
          <Button
            onClick={() => goToPage(setNextPage)}
            ctaText="Next"
            disabled={!nextEnabled}
          />
        </div>
        <span className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-gray-300">
            {noMovesFound ? 0 : startIndex + 1}
          </span>
          -<span className="font-semibold text-gray-300">{endIndex + 1}</span>{' '}
          of{' '}
          <span className="font-semibold text-gray-300">
            {filteredMoves.length}
          </span>{' '}
          moves
        </span>
      </div>
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
