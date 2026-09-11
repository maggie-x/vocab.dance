import { Link } from 'react-router-dom';
import { Move as MoveType, movePath } from '../../data/config';
import StyleLabel from '../style';
import GIF from './gif';

const Move = ({
  name,
  gifLink,
  infoSrc,
  createdBy,
  style,
}: MoveType): React.ReactElement => {
  return (
    <div className="flex flex-col border rounded-md border-zinc-900 drop-shadow-md bg-zinc-800">
      <Link to={movePath(style, name)} className="group">
        <GIF gifLink={gifLink} />
        <h1 className="px-6 pt-6 text-2xl font-semibold text-zinc-100 group-hover:text-pink-400">
          {name}
        </h1>
      </Link>
      <div className="flex flex-col space-y-2 px-6 pb-6 pt-2">
        <StyleLabel slug={style} />
        <div className="flex flex-col space-y-2 opacity-70 text-sm">
          {createdBy && <p>Created by: {createdBy}</p>}
          <p>
            Source:{' '}
            <a
              className="text-yellow-200 break-all"
              href={infoSrc}
              target="_blank"
              rel="noreferrer"
            >
              {infoSrc}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Move;
