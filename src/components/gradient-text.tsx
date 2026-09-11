import { Link } from 'react-router-dom';

export const Title = (): React.ReactElement => {
  return (
    <Link
      to="/"
      aria-label="Dance Vocab Index home"
      className="py-12 flex flex-col items-center gap-8 justify-center hover:opacity-80 focus:outline-none focus-visible:opacity-80"
    >
      <span className="text-7xl">💃🕺</span>
      <h1 className="px-6 md:px-12 text-4xl font-black text-white text-center">
        <span className="tracking-wide bg-gradient-to-r text-transparent bg-clip-text from-pink-500 via-red-500 to-yellow-500">
          Dance Vocab Index
        </span>
      </h1>
    </Link>
  );
};
