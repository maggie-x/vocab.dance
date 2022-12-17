import { Style } from '../components/style';
import { Move, S3_BUCKET_URI } from './config';

const HOUSE_OLD_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=I9Kgy4BHFGQ';
const HOUSE_NEXT_SCHOOL_DICTIONARY =
  'https://www.youtube.com/watch?v=1jb2LaUirog';
const HOUSE_NEXT_SCHOOL_DICTIONARY_PART_2 =
  'https://www.youtube.com/watch?v=7NTnGuxuToU';

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
  {
    name: 'Shuffle & Dodge',
    gifLink: `${S3_BUCKET_URI}/shuffle_and_dodge.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY,
    style: Style.HOUSE,
  },
  {
    name: 'Gallop',
    gifLink: `${S3_BUCKET_URI}/gallop.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY,
    style: Style.HOUSE,
  },
  {
    name: 'Gallop Shuffle',
    gifLink: `${S3_BUCKET_URI}/gallop_shuffle.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY,
    style: Style.HOUSE,
  },
  {
    name: 'Gallop Shuffle Cross',
    gifLink: `${S3_BUCKET_URI}/gallop_shuffle_cross.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY,
    style: Style.HOUSE,
  },
  {
    name: 'Can Opener',
    gifLink: `${S3_BUCKET_URI}/can_opener.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY,
    style: Style.HOUSE,
  },
  {
    name: 'Triangle',
    gifLink: `${S3_BUCKET_URI}/triangle.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY_PART_2,
    style: Style.HOUSE,
  },
  {
    name: 'Roger Rabbit',
    gifLink: `${S3_BUCKET_URI}/roger_rabbit_house.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY_PART_2,
    style: Style.HOUSE,
  },
  {
    name: 'Diamond',
    gifLink: `${S3_BUCKET_URI}/diamond.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY_PART_2,
    style: Style.HOUSE,
  },
  {
    name: 'Lotus',
    gifLink: `${S3_BUCKET_URI}/lotus.mp4`,
    infoSrc: HOUSE_NEXT_SCHOOL_DICTIONARY_PART_2,
    style: Style.HOUSE,
  },
  {
    name: 'Side Walk',
    gifLink: `${S3_BUCKET_URI}/side_walk.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=fKaJBjIppXE',
    style: Style.HOUSE,
  },
  {
    name: 'Chase',
    gifLink: `${S3_BUCKET_URI}/chase.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=3auLqkKdc18',
    style: Style.HOUSE,
  },
  {
    name: 'Crosswalk',
    gifLink: `${S3_BUCKET_URI}/crosswalk.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=Z7zcCSak16o',
    style: Style.HOUSE,
  },
  {
    name: 'Skate',
    gifLink: `${S3_BUCKET_URI}/skate.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=Ckh17PQ8iZ0',
    style: Style.HOUSE,
  },
  {
    name: 'Spongebob',
    gifLink: `${S3_BUCKET_URI}/spongebob.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=u9zIOc9mwJE',
    style: Style.HOUSE,
  },
  {
    name: 'Cross Step Drag',
    gifLink: `${S3_BUCKET_URI}/cross_step_drag.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=49didNXeUGY',
    style: Style.HOUSE,
  },
  {
    name: 'Around The World',
    gifLink: `${S3_BUCKET_URI}/around_the_world.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=Rb99CKKr4Z0',
    style: Style.HOUSE,
  },
  {
    name: 'Pivoting Skate',
    gifLink: `${S3_BUCKET_URI}/pivoting_skate.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=-gtSTaHhaxA',
    style: Style.HOUSE,
  },
  {
    name: 'Salsa Step',
    gifLink: `${S3_BUCKET_URI}/salsa_step.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=cxWEbJFM5YI',
    style: Style.HOUSE,
  },
  {
    name: 'Criss Cross',
    gifLink: `${S3_BUCKET_URI}/criss_cross.mp4`,
    infoSrc: 'https://www.youtube.com/watch?v=s_TXekHFkWc',
    style: Style.HOUSE,
  },
];
