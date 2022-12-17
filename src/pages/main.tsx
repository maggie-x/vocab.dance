import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from 'react-use-pagination';
import Button from '../components/button';
import Move from '../components/move';
import { SearchBar } from '../components/search-bar';
import { Style } from '../components/style';
import StyleFilter from '../components/style-filter/style-filter';
import { Move as MoveType } from '../data/moves';

interface MainProps {
  moves: Array<MoveType>;
  style?: Style;
}

const Main = ({ moves, style = Style.HIP_HOP }: MainProps) => {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState<string>('');

  const filteredMoves = filterByString(queryText, moves);

  const {
    startIndex,
    endIndex,
    setPreviousPage,
    setNextPage,
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

  const noMovesFound = filteredMoves.length === 0;
  return (
    <>
      <div className="flex flex-col space-y-3">
        <StyleFilter
          activeStyle={style}
          handleStyleClick={(style) => navigate(`/${style}`)}
        />
        <SearchBar
          searchString={queryText}
          onChange={(queryText: string) => setQueryText(queryText)}
          placeholderText={`Search ${style.toString().toLowerCase()} moves...`}
        />
      </div>
      <div className="mt-12 flex flex-col space-y-12">
        {paginatedMoves.map((move) => (
          <Move
            key={move.name}
            name={move.name}
            gifLink={move.gifLink}
            infoSrc={move.infoSrc}
            style={move.style}
          />
        ))}
        {noMovesFound && (
          <div className="flex flex-col gap-y-2 px-6 mb-4">
            <div className="text-center text-zinc-400">
              No moves found for <br /> '{queryText}'.
            </div>
            <div className="text-center text-zinc-400 text-xs">
              If you're looking for moves of a style other than {style}, please
              click on the desired style above the search bar to switch between
              style modes.
            </div>
          </div>
        )}
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
        <span className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-gray-300">
            {startIndex < 0 ? 0 : startIndex + 1}
          </span>
          -<span className="font-semibold text-gray-300">{endIndex + 1}</span>{' '}
          of{' '}
          <span className="font-semibold text-gray-300">
            {filteredMoves.length}
          </span>{' '}
          moves
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
