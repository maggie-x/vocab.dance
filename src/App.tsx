import { useState } from 'react';
import './App.css';
import { GradientText } from './components/gradient-text';
import { Layout } from './components/layout';
import Move from './components/move';
import { SearchBar } from './components/search-bar';
import { MOVES, Move as MoveType } from './data/moves';

function App() {
  const [queryText, setQueryText] = useState<string>('');
  console.log(queryText);

  const moves = filterByString(queryText, MOVES);
  return (
    <div className="flex flex-col items-center">
      <Layout>
        <GradientText text={'💃 Dance Vocab Index'} />
        <SearchBar
          searchString={queryText}
          onChange={(queryText: string) => setQueryText(queryText)}
        />
        <div className="mt-8 flex flex-col space-y-12">
          {moves.map((move) => (
            <Move
              name={move.name}
              gifLink={move.gifLink}
              infoSrc={move.infoSrc}
            />
          ))}
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
  return dataToFilter.filter((move: MoveType) => {
    return move.name.toLowerCase().includes(queryText.toLowerCase());
  });
};
