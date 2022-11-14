
export interface Move {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
}

export const HIP_HOP_MOVES: Array<Move> = [
  {
    name: 'Milly Rock',
    gifLink: 'https://media.giphy.com/media/26ufpo2M9CL8oB1AI/giphy.gif',
    infoSrc: 'https://www.google.com',
  },
  {
    name: 'Harlem Shake',
    gifLink: 'https://media.giphy.com/media/anRWvX6MDOq76/giphy.gif',
    infoSrc: 'https://www.google.com',
  },
];

export const MOVES: Array<Move> = [
    ...HIP_HOP_MOVES
]
