import StyleLabel, { Style } from '../style';

interface StyleFilterProps {
  handleStyleClick: (style: string) => void;
}

const StyleFilter = ({ handleStyleClick }: StyleFilterProps) => {
  return (
    <div className="flex justify-center space-x-3">
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('hip-hop')}
      >
        <StyleLabel style={Style.HIP_HOP} />
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('house')}
      >
        <StyleLabel style={Style.HOUSE} />
      </button>
    </div>
  );
};

export default StyleFilter;
