
export interface Move {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
}

const HIPHOP_OLD_SCHOOL_DICTIONARY = "https://www.youtube.com/watch?v=RxHj0QMXYL4";

const HIPHOP_MIDDLE_SCHOOL_DICTIONARY = "https://www.youtube.com/watch?v=YKZaTupQC0w";

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
  {
    name: 'The Wop',
    gifLink: 'https://media.giphy.com/media/yuDh1GTjmyInc97DpW/giphy.gif',
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
  },
  {
    name: 'Happy Feet',
    gifLink: 'https://media.giphy.com/media/2t4PxAPqhLpbFhr6ju/giphy-downsized-large.gif',
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
  },
  {
    name: 'The Fila',
    gifLink: 'https://media.giphy.com/media/3HkutZ1oSBwfiKvdOe/giphy.gif',
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
  },
  {
    name: 'Party Machine',
    gifLink: 'https://media.giphy.com/media/mwNmUDu9qeXFVsYrRj/giphy-downsized-large.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
  {
    name: 'Running Man',
    gifLink: 'https://media.giphy.com/media/iG6YElP3GbdIs41NVo/giphy-downsized-large.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
  {
    name: 'Roger Rabbit',
    gifLink: 'https://media.giphy.com/media/eEesC9ktvlz9f9RKO4/giphy.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
  {
    name: 'Steve Martin',
    gifLink: 'https://media.giphy.com/media/BGy7hw9b18eX1yT8Ks/giphy-downsized-large.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
  {
    name: 'Bart Simpson',
    gifLink: 'https://media.giphy.com/media/8ysnAFkhXP5te3IeZH/giphy-downsized-large.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
  {
    name: 'Brooklyn',
    gifLink: 'https://media.giphy.com/media/wH57hBvtCyiZ6qfARW/giphy.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
  {
    name: 'Butterfly',
    gifLink: 'https://media.giphy.com/media/FXMX5OfO3FezhukhgU/giphy-downsized-large.gif',
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
  },
];

export const MOVES: Array<Move> = [
    ...HIP_HOP_MOVES
]
