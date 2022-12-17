import { Style } from '../components/style';
import { Move, S3_BUCKET_URI } from './config';

const CHOP_DAILY_TOP_8 = 'https://www.youtube.com/watch?v=fShR0IMBagU';
const CHOP_DAILY_NETWORK = 'https://www.youtube.com/watch?v=dRzdtpT6jQQ';

export const AFRO_MOVES: Array<Move> = [
  {
    name: 'Gwara Gwara',
    gifLink: `${S3_BUCKET_URI}/gwara_gwara.mp4`,
    infoSrc: CHOP_DAILY_TOP_8,
    style: Style.AFRO,
  },
  {
    name: 'Pilolo',
    gifLink: `${S3_BUCKET_URI}/pilolo.mp4`,
    infoSrc: CHOP_DAILY_TOP_8,
    style: Style.AFRO,
  },
  {
    name: 'Shaku Shaku',
    gifLink: `${S3_BUCKET_URI}/shaku_shaku.mp4`,
    infoSrc: CHOP_DAILY_TOP_8,
    style: Style.AFRO,
  },
  {
    name: 'Network',
    gifLink: `${S3_BUCKET_URI}/network.mp4`,
    infoSrc: CHOP_DAILY_NETWORK,
    style: Style.AFRO,
  },
  // Azonto
  // Shoki
];
