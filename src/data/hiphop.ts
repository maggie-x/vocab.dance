import { Move, S3_BUCKET_URI } from './config';

const HIPHOP_OLD_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=RxHj0QMXYL4';
const HIPHOP_MIDDLE_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=YKZaTupQC0w';
const HIPHOP_NEW_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=_bnLvdPOZpU';
const RHHYME_KOKO = 'https://www.youtube.com/watch?v=QyRxfz9Lesc';

export const HIP_HOP_MOVES: Array<Move> = [
  {
    name: 'Cabbage Patch',
    gifLink: `${S3_BUCKET_URI}/cabbage_patch.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Smurf',
    gifLink: `${S3_BUCKET_URI}/smurf.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Prep',
    gifLink: `${S3_BUCKET_URI}/prep.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Reebok',
    gifLink: `${S3_BUCKET_URI}/reebok.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'The Wop',
    gifLink: `${S3_BUCKET_URI}/the_wop.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Happy Feet',
    gifLink: `${S3_BUCKET_URI}/happy_feet.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'The Fila',
    gifLink: `${S3_BUCKET_URI}/the_fila.mp4`,
    infoSrc: HIPHOP_OLD_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Party Machine',
    gifLink: `${S3_BUCKET_URI}/party_machine.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Running Man',
    gifLink: `${S3_BUCKET_URI}/running_man.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Roger Rabbit',
    gifLink: `${S3_BUCKET_URI}/roger_rabbit.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Steve Martin',
    gifLink: `${S3_BUCKET_URI}/steve_martin.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Bart Simpson',
    gifLink: `${S3_BUCKET_URI}/bart_simpson.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Brooklyn',
    gifLink: `${S3_BUCKET_URI}/brooklyn.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Butterfly',
    gifLink: `${S3_BUCKET_URI}/butterfly.mp4`,
    infoSrc: HIPHOP_MIDDLE_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'ATL Stomp',
    gifLink: `${S3_BUCKET_URI}/atl_stomp.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Bankhead Bounce',
    gifLink: `${S3_BUCKET_URI}/bankhead_bounce.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Harlem Shake',
    gifLink: `${S3_BUCKET_URI}/harlem_shake.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Monestary',
    gifLink: `${S3_BUCKET_URI}/monestary.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Run It',
    gifLink: `${S3_BUCKET_URI}/run_it.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Skeeter Rabbit',
    gifLink: `${S3_BUCKET_URI}/skeeter_rabbit.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'Walk It Out',
    gifLink: `${S3_BUCKET_URI}/walk_it_out.mp4`,
    infoSrc: HIPHOP_NEW_SCHOOL_DICTIONARY,
    style: 'hiphop',
  },
  {
    name: 'ALF',
    gifLink: `${S3_BUCKET_URI}/alf.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'Biz Markie',
    gifLink: `${S3_BUCKET_URI}/biz_markie.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'Cat Daddy',
    gifLink: `${S3_BUCKET_URI}/cat_daddy.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'Charleston',
    gifLink: `${S3_BUCKET_URI}/charleston.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'Robocup',
    gifLink: `${S3_BUCKET_URI}/robocup.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'V Step',
    gifLink: `${S3_BUCKET_URI}/v_step.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'Dougie',
    gifLink: `${S3_BUCKET_URI}/dougie.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=Gw_3dGCARGY',
    style: 'hiphop',
  },
  {
    name: 'Milly Rock',
    gifLink: `${S3_BUCKET_URI}/milly_rock.mp4`,
    infoSrc:
      'https://giphy.com/gifs/kcamp427-k-camp-lyric-ave-427-26ufpo2M9CL8oB1AI',
    style: 'hiphop',
  },
  {
    name: 'Kangsta Wok',
    gifLink: `${S3_BUCKET_URI}/kangsta_wok.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=gyDxyZpG0iI',
    style: 'hiphop',
  },
];
