import { Style } from '../components/style';
import { Move, S3_BUCKET_URI } from './config';

const LITEFEET_DICTIONARY = 'https://www.youtube.com/watch?v=mmX7KT7D9Nw';
const FIFTY_CLASSIC_LITEFEET_MOVES_ESOLO =
  'https://www.youtube.com/watch?v=-IdY7BQTCWs';

export const LITEFEET_MOVES: Array<Move> = [
  {
    name: 'Tone Wop',
    gifLink: `${S3_BUCKET_URI}/litefeet/tone_wop.mp4`,
    infoSrc: LITEFEET_DICTIONARY,
    style: Style.LITEFEET,
  },
  {
    name: 'Tone Wop (Side-to-side)',
    gifLink: `${S3_BUCKET_URI}/litefeet/tone_wop_side_to_side.mp4`,
    infoSrc: LITEFEET_DICTIONARY,
    style: Style.LITEFEET,
  },
  {
    name: 'Tone Wop (Criss Cross)',
    gifLink: `${S3_BUCKET_URI}/litefeet/tone_wop_criss_cross.mp4`,
    infoSrc: LITEFEET_DICTIONARY,
    style: Style.LITEFEET,
  },
  {
    name: 'Rev Up',
    gifLink: `${S3_BUCKET_URI}/litefeet/rev_up.mp4`,
    infoSrc: LITEFEET_DICTIONARY,
    style: Style.LITEFEET,
  },
  {
    name: 'Bad One',
    gifLink: `${S3_BUCKET_URI}/litefeet/bad_one.mp4`,
    infoSrc: LITEFEET_DICTIONARY,
    style: Style.LITEFEET,
  },
  {
    name: 'Lock In',
    gifLink: `${S3_BUCKET_URI}/litefeet/lock_in.mp4`,
    infoSrc: FIFTY_CLASSIC_LITEFEET_MOVES_ESOLO,
    style: Style.LITEFEET,
  },
  {
    name: 'All In',
    gifLink: `${S3_BUCKET_URI}/litefeet/all_in.mp4`,
    infoSrc: FIFTY_CLASSIC_LITEFEET_MOVES_ESOLO,
    style: Style.LITEFEET,
  },
  {
    name: 'Tic Tac Toe',
    gifLink: `${S3_BUCKET_URI}/litefeet/tic_tac_toe.mp4`,
    infoSrc: FIFTY_CLASSIC_LITEFEET_MOVES_ESOLO,
    style: Style.LITEFEET,
  },
  {
    name: 'Buck One',
    gifLink: `${S3_BUCKET_URI}/litefeet/buck_one.mp4`,
    infoSrc: FIFTY_CLASSIC_LITEFEET_MOVES_ESOLO,
    style: Style.LITEFEET,
  },
];
