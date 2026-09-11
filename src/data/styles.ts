import { AFRO_MOVES } from './afro';
import { Move, StyleSlug } from './config';
import { HIP_HOP_MOVES } from './hiphop';
import { HOUSE_MOVES } from './house';
import { LITEFEET_MOVES } from './litefeet';

export interface StyleConfig {
  label: string;
  gradient: string;
  moves: Array<Move>;
}

export const STYLES: Record<StyleSlug, StyleConfig> = {
  hiphop: {
    label: 'Hip Hop',
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    moves: [...HIP_HOP_MOVES].reverse(),
  },
  house: {
    label: 'House',
    gradient: 'from-green-400 to-blue-300',
    moves: HOUSE_MOVES,
  },
  afro: {
    label: 'Afro',
    gradient: 'from-amber-900 via-red-500 to-yellow-400',
    moves: AFRO_MOVES,
  },
  litefeet: {
    label: 'LiteFeet',
    gradient: 'to-yellow-400 via-green-400 from-green-500',
    moves: LITEFEET_MOVES,
  },
};

export const DEFAULT_STYLE_SLUG: StyleSlug = 'hiphop';
