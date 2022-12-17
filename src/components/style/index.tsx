export enum Style {
  HIP_HOP = 'Hip Hop',
  HOUSE = 'House',
  AFRO = 'Afro',
  LITEFEET = 'LiteFeet',
}

const STYLE_COLOUR: Record<Style, string> = {
  [Style.HIP_HOP]: 'from-pink-500 via-red-500 to-yellow-500',
  [Style.HOUSE]: 'from-green-400 to-blue-300',
  [Style.AFRO]: 'from-amber-900 via-red-500 to-yellow-400',
  [Style.LITEFEET]: 'to-yellow-400 via-green-400 from-green-500',
};

const StyleLabel = ({
  style,
  className = 'text-xs',
}: {
  style: Style;
  className?: string;
}): React.ReactElement => {
  return (
    <div className="flex">
      <span
        className={`${className} font-semibold tracking-wider inline-block py-1 px-2 rounded-md text-white uppercase bg-gradient-to-r ${STYLE_COLOUR[style]}`}
      >
        {style}
      </span>
    </div>
  );
};

export default StyleLabel;
