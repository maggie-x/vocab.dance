import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export type ViewMode = 'cards' | 'list';

const VIEW_OPTIONS: Array<{ mode: ViewMode; label: string }> = [
  { mode: 'list', label: 'List' },
  { mode: 'cards', label: 'Cards' },
];

interface ViewMenuProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  onAbout: () => void;
}

const ViewMenu = ({ viewMode, onChange, onAbout }: ViewMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const select = (mode: ViewMode) => {
    onChange(mode);
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="fixed top-4 left-4 z-10">
      <button
        type="button"
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="flex flex-col justify-center gap-1.5 w-10 h-10 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 hover:border-pink-500 focus:outline-none focus:border-pink-500"
      >
        <span className="block h-0.5 w-full bg-zinc-300" />
        <span className="block h-0.5 w-full bg-zinc-300" />
        <span className="block h-0.5 w-full bg-zinc-300" />
      </button>
      {open && (
        <ul
          role="menu"
          className="mt-2 w-36 rounded-md border border-zinc-700 bg-zinc-800 py-1 text-sm shadow-lg"
        >
          {VIEW_OPTIONS.map(({ mode, label }) => (
            <li key={mode} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={viewMode === mode}
                onClick={() => select(mode)}
                className={clsx(
                  'flex w-full items-center justify-between px-4 py-2 text-left hover:bg-zinc-700',
                  viewMode === mode ? 'text-pink-400' : 'text-zinc-300'
                )}
              >
                {label}
                {viewMode === mode && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
          <li role="separator" className="my-1 border-t border-zinc-700" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onAbout();
              }}
              className="flex w-full items-center px-4 py-2 text-left text-zinc-300 hover:bg-zinc-700"
            >
              About
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ViewMenu;
