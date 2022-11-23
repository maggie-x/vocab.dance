import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from 'react-use-pagination';
import Button from '../components/button';
import Move from '../components/move';
import { SearchBar } from '../components/search-bar';
import StyleFilter from '../components/style-filter/style-filter';
import { Move as MoveType } from '../data/moves';

interface MainProps {
  moves: Array<MoveType>;
}

const Main = ({ moves }: MainProps) => {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState<string>('');

  const filteredMoves = filterByString(queryText, moves);

  const {
    startIndex,
    endIndex,
    setPreviousPage,
    setNextPage,
    currentPage,
    previousEnabled,
    nextEnabled,
  } = usePagination({
    totalItems: filteredMoves.length,
    initialPageSize: 10,
  });

  const paginatedMoves =
    filteredMoves.length > 10
      ? filteredMoves.slice(startIndex, endIndex + 1)
      : filteredMoves;
  return (
    <>
      <div className="flex flex-col space-y-3">
        <SearchBar
          searchString={queryText}
          onChange={(queryText: string) => setQueryText(queryText)}
        />
        <StyleFilter handleStyleClick={(style) => navigate(`/${style}`)} />
      </div>
      <div className="mt-8 flex flex-col space-y-12">
        {paginatedMoves.map((move) => (
          <Move
            key={move.name}
            name={move.name}
            gifLink={move.gifLink}
            infoSrc={move.infoSrc}
            style={move.style}
          />
        ))}
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex mt-6 justify-center">
          <Button
            onClick={() => {
              setPreviousPage();
              window.scrollTo(0, 0);
            }}
            ctaText="Previous"
            disabled={!previousEnabled}
          />
          <Button
            onClick={() => {
              setNextPage();
              window.scrollTo(0, 0);
            }}
            ctaText="Next"
            disabled={!nextEnabled}
          />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {startIndex + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {endIndex + 1}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {moves.length}
          </span>{' '}
          Entries
        </span>
      </div>{' '}
    </>
  );
};

export default Main;

const filterByString = (
  queryText: string,
  dataToFilter: Array<MoveType>
): Array<MoveType> => {
  if (queryText === '') {
    return dataToFilter;
  }
  return dataToFilter.filter((move: MoveType) => {
    return move.name.toLowerCase().includes(queryText.toLowerCase());
  });
};
