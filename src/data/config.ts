export const STYLE_SLUGS = ['hiphop', 'house', 'afro', 'litefeet'] as const;

export type StyleSlug = typeof STYLE_SLUGS[number];

export const isStyleSlug = (value: string | undefined): value is StyleSlug =>
  STYLE_SLUGS.includes(value as StyleSlug);

export interface Move {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
  style: StyleSlug;
}

export const S3_BUCKET_URI = 'https://s3.ap-southeast-2.amazonaws.com/vocab.dance';

export const moveSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const movePath = (style: StyleSlug, name: string): string =>
  `/${style}/${moveSlug(name)}`;
