import { useEffect } from 'react';
import Feedback from '../feedback';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const AboutDialog = ({ open, onClose }: AboutDialogProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="relative w-full max-w-xl max-h-full overflow-y-auto rounded-md border border-zinc-700 bg-zinc-900 px-6 py-4 font-mono text-white"
      >
        <div className="flex items-center justify-between">
          <h2 id="about-title" className="text-lg font-semibold text-zinc-100">
            About
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-zinc-400 hover:text-pink-400 focus:outline-none focus:text-pink-400"
          >
            ✕
          </button>
        </div>
        <Feedback />
      </div>
    </div>
  );
};

export default AboutDialog;
