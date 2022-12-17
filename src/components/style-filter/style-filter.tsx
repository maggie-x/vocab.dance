import StyleLabel, { Style } from '../style';
import clsx from 'clsx';
import React from 'react';

interface StyleFilterProps {
  handleStyleClick: (style: string) => void;
  activeStyle: Style;
}

const StyleFilter = ({ handleStyleClick, activeStyle }: StyleFilterProps) => {
  return (
    <div className="flex justify-center space-x-3">
      <StyleMode
        handleStyleClick={handleStyleClick}
        activeStyle={activeStyle}
        styleURI="hiphop"
        style={Style.HIP_HOP}
      />
      <StyleMode
        handleStyleClick={handleStyleClick}
        activeStyle={activeStyle}
        styleURI="house"
        style={Style.HOUSE}
      />
      <StyleMode
        handleStyleClick={handleStyleClick}
        activeStyle={activeStyle}
        styleURI="afro"
        style={Style.AFRO}
      />
      <StyleMode
        handleStyleClick={handleStyleClick}
        activeStyle={activeStyle}
        styleURI="litefeet"
        style={Style.LITEFEET}
      />
    </div>
  );
};

interface StyleModeProps {
  handleStyleClick: (style: string) => void;
  activeStyle: Style;
  styleURI: string;
  style: Style;
}

const StyleMode = ({
  styleURI,
  style,
  handleStyleClick,
  activeStyle,
}: StyleModeProps): React.ReactElement => {
  return (
    <button
      className="hover:cursor-pointer"
      onClick={() => handleStyleClick(styleURI)}
    >
      <StyleLabel
        className={clsx('text-sm md:text-md whitespace-nowrap', {
          'opacity-50': activeStyle !== style,
        })}
        style={style}
      />
    </button>
  );
};

export default StyleFilter;
