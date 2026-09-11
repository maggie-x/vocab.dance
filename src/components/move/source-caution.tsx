import clsx from 'clsx';
import { sourceCaution } from '../../data/sources';

type CautionLabel = 'none' | 'short' | 'full';

interface SourceCautionProps {
  infoSrc: string;
  label?: CautionLabel;
  className?: string;
}

const SourceCaution = ({
  infoSrc,
  label = 'none',
  className,
}: SourceCautionProps) => {
  const caution = sourceCaution(infoSrc);
  if (!caution) {
    return null;
  }
  return (
    <span
      className={clsx(
        'inline-flex items-start gap-1 text-amber-400',
        className
      )}
      title={caution}
      aria-label={label === 'full' ? undefined : caution}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5 shrink-0 mt-px"
      >
        <path
          fillRule="evenodd"
          d="M8.5 2.9a1.7 1.7 0 013 0l6.3 11.4A1.7 1.7 0 0116.3 17H3.7a1.7 1.7 0 01-1.5-2.7L8.5 2.9zM10 7a.8.8 0 00-.8.8v3.4a.8.8 0 001.6 0V7.8A.8.8 0 0010 7zm0 7.2a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {label === 'short' && <span>unverified source</span>}
      {label === 'full' && <span>{caution}</span>}
    </span>
  );
};

export default SourceCaution;
