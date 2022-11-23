import { Style } from '../components/style';

export interface Move {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
  style: Style;
}

const HIPHOP_OLD_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=RxHj0QMXYL4';
const HIPHOP_MIDDLE_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=YKZaTupQC0w';
const HIPHOP_NEW_SCHOOL_DICTIONARY = 'https://www.youtube.com/watch?v=_bnLvdPOZpU';
const RHHYME_KOKO = 'https://www.youtube.com/watch?v=QyRxfz9Lesc';

const HOUSE_OLD_SCHOOL_DICTIONARY = 'https://www.youtube.com/watch?v=I9Kgy4BHFGQ';

const CHOP_DAILY_TOP_8 = 'https://www.youtube.com/watch?v=fShR0IMBagU';
const CHOP_DAILY_NETWORK = 'https://www.youtube.com/watch?v=dRzdtpT6jQQ';

const S3_BUCKET_URI = 'https://s3.ap-southeast-2.amazonaws.com/vocab.dance';

export const HIP_HOP_MOVES: Array<Move> = [
  // Milli Rock
  // Harlem Shake
  // Dougie
  // Kangsta Wok
  {
    name: 'Cabbage Patch',
    gifLink: `${S3_BUCKET_URI}/cabbage_patch.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Smurf',
    gifLink: `${S3_BUCKET_URI}/smurf.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Prep',
    gifLink: `${S3_BUCKET_URI}/prep.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Reebok',
    gifLink: `${S3_BUCKET_URI}/reebok.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'The Wop',
    gifLink: `${S3_BUCKET_URI}/the_wop.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Happy Feet',
    gifLink: `${S3_BUCKET_URI}/happy_feet.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'The Fila',
    gifLink: `${S3_BUCKET_URI}/the_fila.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Party Machine',
    gifLink: `${S3_BUCKET_URI}/party_machine.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Running Man',
    gifLink: `${S3_BUCKET_URI}/running_man.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Roger Rabbit',
    gifLink: `${S3_BUCKET_URI}/roger_rabbit.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Steve Martin',
    gifLink: `${S3_BUCKET_URI}/steve_martin.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Bart Simpson',
    gifLink: `${S3_BUCKET_URI}/bart_simpson.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Brooklyn',
    gifLink: `${S3_BUCKET_URI}/brooklyn.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Butterfly',
    gifLink: `${S3_BUCKET_URI}/butterfly.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'ATL Stomp',
    gifLink: `${S3_BUCKET_URI}/atl_stomp.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Bankhead Bounce',
    gifLink: `${S3_BUCKET_URI}/bankhead_bounce.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Harlem Shake',
    gifLink: `${S3_BUCKET_URI}/harlem_shake.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Monestary',
    gifLink: `${S3_BUCKET_URI}/monestary.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Run It',
    gifLink: `${S3_BUCKET_URI}/run_it.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Skeeter Rabbit',
    gifLink: `${S3_BUCKET_URI}/skeeter_rabbit.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'Walk It Out',
    gifLink: `${S3_BUCKET_URI}/walk_it_out.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: Style.HIP_HOP,
  },
  {
    name: 'ALF',
    gifLink: `${S3_BUCKET_URI}/alf.mp4`,
    infoSrc: RHHYME_KOKO,
    style: Style.HIP_HOP,
  },
  {
    name: 'Biz Markie',
    gifLink: `${S3_BUCKET_URI}/biz_markie.mp4`,
    infoSrc: RHHYME_KOKO,
    style: Style.HIP_HOP,
  },
  {
    name: 'Cat Daddy',
    gifLink: `${S3_BUCKET_URI}/cat_daddy.mp4`,
    infoSrc: RHHYME_KOKO,
    style: Style.HIP_HOP,
  },
  {
    name: 'Charleston',
    gifLink: `${S3_BUCKET_URI}/charleston.mp4`,
    infoSrc: RHHYME_KOKO,
    style: Style.HIP_HOP,
  },
  {
    name: 'Robocup',
    gifLink: `${S3_BUCKET_URI}/robocup.mp4`,
    infoSrc: RHHYME_KOKO,
    style: Style.HIP_HOP,
  },
  {
    name: 'V Step',
    gifLink: `${S3_BUCKET_URI}/v_step.mp4`,
    infoSrc: RHHYME_KOKO,
    style: Style.HIP_HOP,
  },
  {
    name: 'Dougie',
    gifLink: `${S3_BUCKET_URI}/dougie.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=Gw_3dGCARGY',
    style: Style.HIP_HOP,
  },
];

export const HOUSE_MOVES: Array<Move> = [
  {
    name: 'Loose Legs',
    gifLink: `${S3_BUCKET_URI}/loose_legs.mp4`,
      infoSrc: HOUSE_OLD_SCHOOL_DICTIONARY,
      style: Style.HOUSE,
  },
  {
    name: 'Swirl',
    gifLink: `${S3_BUCKET_URI}/swirl.mp4`,
      infoSrc: HOUSE_OLD_SCHOOL_DICTIONARY,
      style: Style.HOUSE,
  },
  {
    name: 'Train',
    gifLink: `${S3_BUCKET_URI}/train.mp4`,
      infoSrc: HOUSE_OLD_SCHOOL_DICTIONARY,
      style: Style.HOUSE,
  },
  {
    name: 'Farmer',
    gifLink: `${S3_BUCKET_URI}/farmer.mp4`,
      infoSrc: HOUSE_OLD_SCHOOL_DICTIONARY,
      style: Style.HOUSE,
  },
  {
    name: 'Jack in the Box',
    gifLink: `${S3_BUCKET_URI}/jack_in_the_box.mp4`,
      infoSrc: HOUSE_OLD_SCHOOL_DICTIONARY,
      style: Style.HOUSE,
  },
];

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