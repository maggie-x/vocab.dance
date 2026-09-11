import clsx from 'clsx';
import React from 'react';
import { STYLE_SLUGS, StyleSlug } from '../../data/config';
import StyleLabel from '../style';

interface StyleFilterProps {
  handleStyleClick: (slug: StyleSlug) => void;
  activeStyle: StyleSlug;
}

const StyleFilter = ({ handleStyleClick, activeStyle }: StyleFilterProps) => {
  return (
    <div className="flex justify-center space-x-3">
      {STYLE_SLUGS.map((slug) => (
        <button
          key={slug}
          className="hover:cursor-pointer"
          onClick={() => handleStyleClick(slug)}
        >
          <StyleLabel
            className={clsx('text-sm md:text-md whitespace-nowrap', {
              'opacity-50': activeStyle !== slug,
            })}
            slug={slug}
          />
        </button>
      ))}
    </div>
  );
};

export default StyleFilter;
