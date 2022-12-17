import { Style } from '../components/style';

export interface Move {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
  style: Style;
}

export const S3_BUCKET_URI = 'https://s3.ap-southeast-2.amazonaws.com/vocab.dance';


