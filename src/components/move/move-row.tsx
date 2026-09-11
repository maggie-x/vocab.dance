import { Move as MoveType } from '../../data/config';
import StyleLabel from '../style';
import { posterFor } from './gif';

const MoveRow = ({ name, gifLink, infoSrc, style }: MoveType): React.ReactElement => {
  return (
    <li className="flex items-center gap-4 py-3 border-b border-zinc-800 last:border-b-0">
      <img
        src={posterFor(gifLink)}
        alt=""
        loading="lazy"
        className="w-14 h-14 shrink-0 rounded-md object-cover bg-zinc-900"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-semibold text-zinc-100">{name}</span>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <StyleLabel slug={style} className="text-[10px]" />
          <a
            className="truncate text-yellow-200 opacity-70"
            href={infoSrc}
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </div>
      </div>
    </li>
  );
};

export default MoveRow;
