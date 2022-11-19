import { useState } from 'react';
import { usePagination } from 'react-use-pagination';
import './App.css';
import Button from './components/button';
import { Title } from './components/gradient-text';
import { Layout } from './components/layout';
import Move from './components/move';
import { SearchBar } from './components/search-bar';
import { MOVES, Move as MoveType } from './data/moves';

function App() {
  const [queryText, setQueryText] = useState<string>('');
  console.log(queryText);

  const filteredMoves = filterByString(queryText, MOVES);

  console.log(filteredMoves.length);

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
      ? filteredMoves.slice(startIndex, endIndex)
      : filteredMoves;

  return (
    <div className="flex flex-col items-center font-mono bg-zinc-900 text-white">
      <Layout>
        <Title />
        <SearchBar
          searchString={queryText}
          onChange={(queryText: string) => setQueryText(queryText)}
        />
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
          <span className="text-zinc-400">Page {currentPage + 1}</span>
        </div>
      </Layout>
    </div>
  );
}

export default App;

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
