import { Link, Navigate } from 'react-router-dom';
import { useTitle } from 'react-use';
import Move from '../components/move';
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
      <Move variant="detail" {...move} />
    </div>
  );
};

export default MovePage;
