import { Move, S3_BUCKET_URI } from './config';

const HIPHOP_OLD_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=RxHj0QMXYL4';
const HIPHOP_MIDDLE_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=YKZaTupQC0w';
const HIPHOP_NEW_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=_bnLvdPOZpU';
const HENRY_LINK_40_STEPS = 'https://www.youtube.com/watch?v=axC04HmcUuI';
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
    infoSrc: `${HENRY_LINK_40_STEPS}&t=63s`,
    style: 'hiphop',
  },
  {
    name: 'Cat Daddy',
    gifLink: `${S3_BUCKET_URI}/cat_daddy.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=166s`,
    style: 'hiphop',
  },
  {
    name: 'Charleston',
    gifLink: `${S3_BUCKET_URI}/charleston.mp4`,
    infoSrc: RHHYME_KOKO,
    style: 'hiphop',
  },
  {
    name: 'Robocop',
    gifLink: `${S3_BUCKET_URI}/robocop.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=180s`,
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
  {
    name: 'Kid and Play',
    gifLink: `${S3_BUCKET_URI}/kid_and_play.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=8s`,
    style: 'hiphop',
  },
  {
    name: 'Rooftop',
    gifLink: `${S3_BUCKET_URI}/rooftop.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=12s`,
    style: 'hiphop',
  },
  {
    name: 'Snake',
    gifLink: `${S3_BUCKET_URI}/snake.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=18s`,
    style: 'hiphop',
  },
  {
    name: 'Skate',
    gifLink: `${S3_BUCKET_URI}/skate_hiphop.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=23s`,
    style: 'hiphop',
  },
  {
    name: 'Bernie',
    gifLink: `${S3_BUCKET_URI}/bernie.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=29s`,
    style: 'hiphop',
  },
  {
    name: 'Camel Walk',
    gifLink: `${S3_BUCKET_URI}/camel_walk.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=35s`,
    style: 'hiphop',
  },
  {
    name: 'TLC',
    gifLink: `${S3_BUCKET_URI}/tlc.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=40s`,
    style: 'hiphop',
  },
  {
    name: 'Outlaw',
    gifLink: `${S3_BUCKET_URI}/outlaw.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=45s`,
    style: 'hiphop',
  },
  {
    name: 'Cameo',
    gifLink: `${S3_BUCKET_URI}/cameo.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=51s`,
    style: 'hiphop',
  },
  {
    name: 'Bobby Brown',
    gifLink: `${S3_BUCKET_URI}/bobby_brown.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=57s`,
    style: 'hiphop',
  },
  {
    name: 'Guess',
    gifLink: `${S3_BUCKET_URI}/guess.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=69s`,
    style: 'hiphop',
  },
  {
    name: 'Janet Jackson',
    gifLink: `${S3_BUCKET_URI}/janet_jackson.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=79s`,
    style: 'hiphop',
  },
  {
    name: 'Shamrock',
    gifLink: `${S3_BUCKET_URI}/shamrock.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=90s`,
    style: 'hiphop',
  },
  {
    name: 'Popcorn',
    gifLink: `${S3_BUCKET_URI}/popcorn.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=95s`,
    style: 'hiphop',
  },
  {
    name: 'Funky Watergate',
    gifLink: `${S3_BUCKET_URI}/funky_watergate.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=106s`,
    style: 'hiphop',
  },
  {
    name: 'James Brown',
    gifLink: `${S3_BUCKET_URI}/james_brown.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=118s`,
    style: 'hiphop',
  },
  {
    name: 'Di Da',
    gifLink: `${S3_BUCKET_URI}/di_da.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=124s`,
    style: 'hiphop',
  },
  {
    name: 'Stomp',
    gifLink: `${S3_BUCKET_URI}/stomp.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=130s`,
    style: 'hiphop',
  },
  {
    name: 'Kriss Kross',
    gifLink: `${S3_BUCKET_URI}/kriss_kross.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=134s`,
    style: 'hiphop',
  },
  {
    name: 'Diddy Dance',
    gifLink: `${S3_BUCKET_URI}/diddy_dance.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=139s`,
    style: 'hiphop',
  },
  {
    name: 'Da Butt',
    gifLink: `${S3_BUCKET_URI}/da_butt.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=144s`,
    style: 'hiphop',
  },
  {
    name: 'World of Dance',
    gifLink: `${S3_BUCKET_URI}/world_of_dance.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=149s`,
    style: 'hiphop',
  },
  {
    name: 'Gucci',
    gifLink: `${S3_BUCKET_URI}/gucci.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=161s`,
    style: 'hiphop',
  },
  {
    name: 'Wu-Tang',
    gifLink: `${S3_BUCKET_URI}/wu_tang.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=173s`,
    style: 'hiphop',
  },
  {
    name: 'Windows',
    gifLink: `${S3_BUCKET_URI}/windows.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=186s`,
    style: 'hiphop',
  },
  {
    name: 'Upstairs Downstairs',
    gifLink: `${S3_BUCKET_URI}/upstairs_downstairs.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=191s`,
    style: 'hiphop',
  },
  {
    name: 'Aunt Jackie',
    gifLink: `${S3_BUCKET_URI}/aunt_jackie.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=196s`,
    style: 'hiphop',
  },
  {
    name: 'Let It Rain Clear It Out',
    gifLink: `${S3_BUCKET_URI}/let_it_rain_clear_it_out.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=201s`,
    style: 'hiphop',
  },
  {
    name: 'Wipe Me Down',
    gifLink: `${S3_BUCKET_URI}/wipe_me_down.mp4`,
    infoSrc: `${HENRY_LINK_40_STEPS}&t=211s`,
    style: 'hiphop',
  },
];
