import { useParams } from 'react-router-dom';
import { useTitle } from 'react-use';
import './App.css';
import Feedback from './components/feedback';
import { Title } from './components/gradient-text';
import { Layout } from './components/layout';
import { Style } from './components/style';
import { AFRO_MOVES, HIP_HOP_MOVES, HOUSE_MOVES, Move } from './data';
import Main from './pages/main';

function App() {
  const { style } = useParams();

  const moves = getMovesFromStyle(style);
  const styleEnum = getStyleFromURI(style);

  useTitle(
    styleEnum ? `${styleEnum} | Dance Vocab Index` : 'Dance Vocab Index'
  );

  return (
    <div className="flex flex-col items-center font-mono bg-zinc-900 text-white">
      <Layout>
        <Title />
        <Main moves={moves} style={styleEnum} />
        <Feedback />
      </Layout>
    </div>
  );
}

export default App;

const getMovesFromStyle = (style: string | undefined): Array<Move> => {
  switch (style) {
    case 'hiphop':
      return HIP_HOP_MOVES.slice().reverse();
    case 'house':
      return HOUSE_MOVES;
    case 'afro':
      return AFRO_MOVES;
    default:
      return HIP_HOP_MOVES.slice().reverse();
  }
};

const getStyleFromURI = (style: string | undefined): Style | undefined => {
  switch (style) {
    case 'hiphop':
      return Style.HIP_HOP;
    case 'house':
      return Style.HOUSE;
    case 'afro':
      return Style.AFRO;
    default:
      return undefined;
  }
};
