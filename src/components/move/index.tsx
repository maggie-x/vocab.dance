import { Move as MoveType } from '../../data/config';
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
      <GIF gifLink={gifLink} />
      <div className="flex flex-col space-y-2 p-6 mt-2">
        <h1 className="text-2xl font-semibold text-zinc-100">{name}</h1>
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
