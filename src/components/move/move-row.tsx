import { Link } from 'react-router-dom';
import { Move as MoveType, movePath } from '../../data/config';
import StyleLabel from '../style';
import { posterFor } from './gif';

const MoveRow = ({ name, gifLink, infoSrc, style }: MoveType): React.ReactElement => {
  return (
    <li className="flex items-center gap-4 py-3 border-b border-zinc-800 last:border-b-0">
      <Link to={movePath(style, name)} className="flex items-center gap-4 min-w-0 group">
        <img
          src={posterFor(gifLink)}
          alt=""
          loading="lazy"
          className="w-24 aspect-video shrink-0 rounded-md object-cover bg-zinc-900"
        />
        <span className="font-semibold text-zinc-100 group-hover:text-pink-400">
          {name}
        </span>
      </Link>
      <div className="flex items-center gap-3 text-xs text-zinc-400 ml-auto shrink-0">
        <StyleLabel slug={style} className="text-[10px]" />
        <a
          className="text-yellow-200 opacity-70"
          href={infoSrc}
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </div>
    </li>
  );
};

export default MoveRow;
