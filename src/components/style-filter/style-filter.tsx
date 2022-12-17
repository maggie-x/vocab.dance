import StyleLabel, { Style } from '../style';
import clsx from 'clsx';

interface StyleFilterProps {
  handleStyleClick: (style: string) => void;
  activeStyle: Style;
}

const StyleFilter = ({ handleStyleClick, activeStyle }: StyleFilterProps) => {
  return (
    <div className="flex justify-center space-x-3">
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('hiphop')}
      >
        <StyleLabel
          className={clsx('text-md', {
            'opacity-50': activeStyle !== Style.HIP_HOP,
          })}
          style={Style.HIP_HOP}
        />
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('house')}
      >
        <StyleLabel
          className={clsx('text-md', {
            'opacity-50': activeStyle !== Style.HOUSE,
          })}
          style={Style.HOUSE}
        />
      </button>
      <button
        className="hover:cursor-pointer"
        onClick={() => handleStyleClick('afro')}
      >
        <StyleLabel
          className={clsx('text-md', {
            'opacity-50': activeStyle !== Style.AFRO,
          })}
          style={Style.AFRO}
        />
      </button>
    </div>
  );
};

export default StyleFilter;
