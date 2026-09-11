import clsx from 'clsx';
import { StyleSlug } from '../../data/config';
import { STYLES } from '../../data/styles';

const StyleLabel = ({
  slug,
  className = 'text-xs',
}: {
  slug: StyleSlug;
  className?: string;
}): React.ReactElement => {
  const { label, gradient } = STYLES[slug];
  return (
    <div className="flex">
      <span
        className={clsx(
          className,
          'font-semibold tracking-wider inline-block py-1 px-2 rounded-md text-white uppercase bg-gradient-to-r',
          gradient
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default StyleLabel;
