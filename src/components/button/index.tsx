interface ButtonProps {
  onClick: () => void;
  ctaText: string;
  disabled?: boolean;
}

const Button = ({ onClick, ctaText, disabled = false }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md border border-zinc-700 text-zinc-400 disabled:text-zinc-700"
    >
      {ctaText}
    </button>
  );
};

export default Button;
