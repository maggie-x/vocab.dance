import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Move as MoveType, movePath } from '../../data/config';
import StyleLabel from '../style';
import GIF from './gif';

type MoveVariant = 'compact' | 'detail';

interface MoveProps extends MoveType {
  variant?: MoveVariant;
}

const Move = ({
  name,
  gifLink,
  infoSrc,
  createdBy,
  style,
  variant = 'compact',
}: MoveProps): React.ReactElement => {
  const isDetail = variant === 'detail';
  const path = movePath(style, name);

  return (
    <div className="relative flex flex-col rounded-md border border-zinc-900 drop-shadow-md bg-zinc-800">
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <StyleLabel slug={style} className={isDetail ? 'text-xs' : 'text-[10px]'} />
      </div>
      {isDetail ? (
        <GIF gifLink={gifLink} />
      ) : (
        <Link to={path}>
          <GIF gifLink={gifLink} />
        </Link>
      )}
      <div
        className={clsx(
          'flex px-5 py-4',
          isDetail ? 'flex-col gap-3 p-6' : 'items-baseline gap-2'
        )}
      >
        {isDetail ? (
          <h1 className="text-3xl font-semibold text-zinc-100">{name}</h1>
        ) : (
          <Link to={path} className="text-xl font-semibold text-zinc-100 hover:text-pink-400">
            {name}
          </Link>
        )}
        {isDetail ? (
          <div className="flex flex-col space-y-2 opacity-70 text-sm">
            {createdBy && <p>Created by: {createdBy}</p>}
            <p>
              Source: <SourceLink href={infoSrc}>{infoSrc}</SourceLink>
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs text-zinc-500">
              (<SourceLink href={infoSrc}>src</SourceLink>)
            </span>
            {createdBy && (
              <span className="ml-auto text-xs text-zinc-500">by {createdBy}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SourceLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    className="text-yellow-200/80 hover:text-yellow-200 break-all underline-offset-2 hover:underline"
    href={href}
    target="_blank"
    rel="noreferrer"
    title={href}
  >
    {children}
  </a>
);

export default Move;
