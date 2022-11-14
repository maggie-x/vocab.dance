
export interface Move {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
}

const HIPHOP_OLD_SCHOOL_DICTIONARY = "https://www.youtube.com/watch?v=RxHj0QMXYL4";

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
  {
    name: 'Smurf',
    gifLink: 'https://media.giphy.com/media/2K7oLHKvF16Cpbn9Rq/giphy.gif',
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
  },
  {
    name: 'Prep',
    gifLink: 'https://media.giphy.com/media/tyINkZbSxDfhaL2Jij/giphy.gif',
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
  },
  {
    name: 'Reebok',
    gifLink: 'https://media.giphy.com/media/t8aZGFum1zIe2Loywo/giphy.gif',
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
  },
];

export const MOVES: Array<Move> = [
    ...HIP_HOP_MOVES
]
