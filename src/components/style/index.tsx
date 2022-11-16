export enum Style {
  HIP_HOP = 'Hip Hop',
}

const StyleLabel = ({ style }: { style: Style }): React.ReactElement => {
  return (
    <div className="flex">
      <span className="text-xs font-semibold inline-block py-1 px-2 rounded-md text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 uppercase">
        {style}
      </span>
    </div>
  );
};

export default StyleLabel;
