type Props = {
  text: string;
};

export const GradientText = ({ text }: Props) => {
  return (
    <div className="py-16 flex items-center justify-center bg-cool-gray-700">
      <h1 className="text-4xl font-black text-white text-center">
        <span className="bg-gradient-to-r text-transparent bg-clip-text from-indigo-500 via-purple-500 to-pink-500">
          {text}
        </span>
      </h1>
    </div>
  );
};
