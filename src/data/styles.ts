import { AFRO_MOVES } from './afro';
import { Move, StyleSlug } from './config';
import { HIP_HOP_MOVES } from './hiphop';
import { HOUSE_MOVES } from './house';
import { LITEFEET_MOVES } from './litefeet';

const byName = (moves: Array<Move>): Array<Move> =>
  [...moves].sort((a, b) => a.name.localeCompare(b.name));

export interface StyleConfig {
  label: string;
  gradient: string;
  moves: Array<Move>;
}

export const STYLES: Record<StyleSlug, StyleConfig> = {
  hiphop: {
    label: 'Hip Hop',
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    moves: byName(HIP_HOP_MOVES),
  },
  house: {
    label: 'House',
    gradient: 'from-green-400 to-blue-300',
    moves: byName(HOUSE_MOVES),
  },
  afro: {
    label: 'Afro',
    gradient: 'from-amber-900 via-red-500 to-yellow-400',
    moves: byName(AFRO_MOVES),
  },
  litefeet: {
    label: 'LiteFeet',
    gradient: 'to-yellow-400 via-green-400 from-green-500',
    moves: byName(LITEFEET_MOVES),
  },
};

export const DEFAULT_STYLE_SLUG: StyleSlug = 'hiphop';
