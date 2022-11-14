export const GradientText = (): React.ReactElement => {
  return (
    <div className="py-16 flex flex-col items-center gap-8 justify-center bg-cool-gray-700">
      <h1 className="text-7xl">💃</h1>
      <h1 className="px-12 text-4xl font-black text-white text-center">
        <span className="tracking-wide bg-gradient-to-r text-transparent bg-clip-text from-pink-500 via-red-500 to-yellow-500">
          Dance Vocab Index
        </span>
      </h1>
    </div>
  );
};
