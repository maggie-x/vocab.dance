import { Link, Navigate } from 'react-router-dom';
import { useTitle } from 'react-use';
import GIF from '../components/move/gif';
import StyleLabel from '../components/style';
import { moveSlug, StyleSlug } from '../data/config';
import { STYLES } from '../data/styles';

interface MovePageProps {
  slug: StyleSlug;
  moveSlugParam: string;
}

const MovePage = ({ slug, moveSlugParam }: MovePageProps) => {
  const { label, moves } = STYLES[slug];
  const move = moves.find((m) => moveSlug(m.name) === moveSlugParam);

  useTitle(
    move ? `${move.name} | ${label} | Dance Vocab Index` : 'Dance Vocab Index'
  );

  if (!move) {
    return <Navigate to={`/${slug}`} replace />;
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <Link
        to={`/${slug}`}
        className="text-sm text-zinc-400 hover:text-pink-400 self-start"
      >
        ← All {label.toLowerCase()} moves
      </Link>
      <div className="rounded-md border border-zinc-900 drop-shadow-md bg-zinc-800">
        <GIF gifLink={move.gifLink} />
        <div className="flex flex-col space-y-3 p-6">
          <h1 className="text-3xl font-semibold text-zinc-100">{move.name}</h1>
          <StyleLabel slug={move.style} />
          <div className="flex flex-col space-y-2 opacity-70 text-sm">
            {move.createdBy && <p>Created by: {move.createdBy}</p>}
            <p>
              Source:{' '}
              <a
                className="text-yellow-200 break-all"
                href={move.infoSrc}
                target="_blank"
                rel="noreferrer"
              >
                {move.infoSrc}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovePage;
