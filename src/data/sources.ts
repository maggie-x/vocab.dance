interface SourceInfo {
  title: string;
  channel: string;
  caution?: string;
}

const SOURCES: Record<string, SourceInfo> = {
  '-IdY7BQTCWs': {
    title: '50 CLASSIC LITE FEET MOVES w/ E SOLO',
    channel: 'Artefakt TV',
  },
  '-gtSTaHhaxA': {
    title: 'House Dance Tutorial - Pivoting Skate',
    channel: 'Jardy Santiago',
  },
  '1jb2LaUirog': {
    title: 'Next School Dictionary: House (Part 1)',
    channel: 'THEMOPTOPCHANNEL',
  },
  '3auLqkKdc18': {
    title:
      'How to do the Chase (House Dance Tutorials) Harry Fullout Weston | MihranTV (@MIHRANKSTUDIOS)',
    channel: 'MihranTV',
  },
  '49didNXeUGY': {
    title: 'House Dance Tutorial - Cross Step Drag',
    channel: 'Jardy Santiago',
  },
  '7NTnGuxuToU': {
    title: 'Next School Dictionary: House (Part 2)',
    channel: 'THEMOPTOPCHANNEL',
  },
  Ckh17PQ8iZ0: {
    title: 'House Dance Tutorial - Skate',
    channel: 'Jardy Santiago',
  },
  Gw_3dGCARGY: {
    title: 'How to Dougie in 2021 | Dance Tutorial',
    channel: 'Lord Hec',
  },
  I9Kgy4BHFGQ: { title: 'House Old School Dictionary', channel: 'Mopa' },
  QyRxfz9Lesc: {
    title: 'RHHYME Koko',
    channel: 'RHHYME',
    caution:
      'This source has not been checked against a recognised pioneer, and the video is no longer available on YouTube.',
  },
  Rb99CKKr4Z0: {
    title: 'House Dance Tutorial - Around The World',
    channel: 'Jardy Santiago',
  },
  RxHj0QMXYL4: { title: 'Hip Hop Old School Dictionary', channel: 'Mopa' },
  YKZaTupQC0w: { title: 'Hip Hop Middle School Dictionary', channel: 'Mopa' },
  Z7zcCSak16o: {
    title: 'House Dance Tutorial - Crosswalk',
    channel: 'Jardy Santiago',
  },
  _bnLvdPOZpU: { title: 'Hip Hop New School Dictionary', channel: 'Mopa' },
  axC04HmcUuI: {
    title:
      '40 HIPHOP STEPS - HENRY LINK - ELITE FORCE - O2 DANCE STUDIOS MELBOURNE AUSTRALIA',
    channel: 'O2 Dance Studios',
  },
  cxWEbJFM5YI: {
    title: 'House Dance Tutorial - Salsa Step',
    channel: 'Jardy Santiago',
  },
  dRzdtpT6jQQ: {
    title: 'How To Network (Dance Tutorial) | Chop Daily',
    channel: 'Chop Daily',
  },
  fKaJBjIppXE: {
    title:
      'How to do the Side Walk (House Dance Tutorials) Fullout | MihranTV (@MIHRANKSTUDIOS)',
    channel: 'MihranTV',
  },
  fShR0IMBagU: {
    title:
      'How To Dance Popular Afro Moves of 2018 (Shaku, Zanku, Kupe Tutorial) | Chop Daily',
    channel: 'Chop Daily',
  },
  gyDxyZpG0iI: {
    title: 'What Is The Kangsta Wok? | Viral Dance Move Explained | STEEZY.CO',
    channel: 'STEEZY',
  },
  mmX7KT7D9Nw: {
    title: 'Next School Dictionary (Lite Feet Edition Lesson)',
    channel: 'THEMOPTOPCHANNEL',
  },
  s_TXekHFkWc: {
    title: 'House Dance Tutorial - Criss Cross',
    channel: 'Jardy Santiago',
  },
  u9zIOc9mwJE: {
    title: 'House Dance Tutorial - Spongebob',
    channel: 'Jardy Santiago',
  },
};

const youtubeId = (url: string): string | undefined => {
  const match = url.match(/[?&]v=([\w-]+)/);
  return match?.[1];
};

const sourceInfo = (infoSrc: string): SourceInfo | undefined => {
  const id = youtubeId(infoSrc);
  return id ? SOURCES[id] : undefined;
};

export const sourceTitle = (infoSrc: string): string =>
  sourceInfo(infoSrc)?.title ?? infoSrc;

export const sourceCaution = (infoSrc: string): string | undefined =>
  sourceInfo(infoSrc)?.caution;
