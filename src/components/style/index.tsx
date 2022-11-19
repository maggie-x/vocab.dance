export enum Style {
  HIP_HOP = 'Hip Hop',
  HOUSE = 'House',
}

const STYLE_COLOUR: Record<Style, string> = {
  [Style.HIP_HOP]: 'from-pink-500 via-red-500 to-yellow-500',
  [Style.HOUSE]: 'from-green-400 to-blue-300',
};

const StyleLabel = ({ style }: { style: Style }): React.ReactElement => {
  return (
    <div className="flex">
      <span
        className={`text-xs font-semibold inline-block py-1 px-2 rounded-md text-white uppercase bg-gradient-to-r ${STYLE_COLOUR[style]}`}
      >
        {style}
      </span>
    </div>
  );
};

export default StyleLabel;
