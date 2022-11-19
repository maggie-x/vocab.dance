interface ButtonProps {
  onClick: () => void;
  ctaText: string;
}

const Button = ({ onClick, ctaText }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md border border-zinc-700 text-zinc-400 "
    >
      {ctaText}
    </button>
  );
};

export default Button;
