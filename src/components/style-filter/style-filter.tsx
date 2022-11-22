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
        <StyleLabel className="text-md" style={Style.HIP_HOP} />
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('house')}
      >
        <StyleLabel className="text-md" style={Style.HOUSE} />
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('afro')}
      >
        <StyleLabel className="text-md" style={Style.AFRO} />
      </button>
    </div>
  );
};

export default StyleFilter;
