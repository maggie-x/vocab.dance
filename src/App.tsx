import { useParams } from 'react-router-dom';
import './App.css';
import { Title } from './components/gradient-text';
import { Layout } from './components/layout';
import { AFRO_MOVES, HIP_HOP_MOVES, HOUSE_MOVES, Move } from './data/moves';
import Main from './pages/main';

function App() {
  const { style } = useParams();

  const moves = getMovesFromStyle(style);
  return (
    <div className="flex flex-col items-center font-mono bg-zinc-900 text-white">
      <Layout>
        <Title />
        <Main moves={moves} />
      </Layout>
    </div>
  );
}

export default App;

const getMovesFromStyle = (style: string | undefined): Array<Move> => {
  switch (style) {
    case 'hip-hop':
      return HIP_HOP_MOVES;
    case 'house':
      return HOUSE_MOVES;
    case 'afro':
      return AFRO_MOVES;
    default:
      return HIP_HOP_MOVES;
  }
};
