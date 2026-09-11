import { useEffect, useRef } from 'react';

export const posterFor = (gifLink: string): string => {
  const fileName = gifLink.substring(gifLink.lastIndexOf('/') + 1);
  return `/posters/${fileName.replace(/\.mp4$/, '.jpg')}`;
};

const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className="w-full aspect-square object-cover rounded-t-md bg-zinc-900"
      src={gifLink}
      poster={posterFor(gifLink)}
      preload="none"
      loop
      muted
      playsInline
    />
  );
};

export default GIF;
