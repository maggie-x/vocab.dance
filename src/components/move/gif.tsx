import { useEffect, useRef, useState } from 'react';

export const posterFor = (gifLink: string): string => {
  const fileName = gifLink.substring(gifLink.lastIndexOf('/') + 1);
  return `/posters/${fileName.replace(/\.mp4$/, '.jpg')}`;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = gifLink;
            setLoadState('loading');
          }
          video.play().catch(() => undefined);
        } else {
          video.pause();
          video.removeAttribute('src');
          video.load();
          setLoadState('idle');
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [gifLink]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover rounded-t-md bg-zinc-900"
        poster={posterFor(gifLink)}
        preload="none"
        loop
        muted
        playsInline
        onCanPlay={() => setLoadState('ready')}
        onError={() => setLoadState('error')}
      />
      {loadState === 'loading' && (
        <div
          role="status"
          aria-label="Loading video"
          className="absolute inset-0 overflow-hidden rounded-t-md pointer-events-none"
        >
          <div className="shimmer absolute inset-y-0 -left-full w-full" />
        </div>
      )}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-t-md text-xs text-zinc-300">
          Video unavailable
        </div>
      )}
    </div>
  );
};

export default GIF;
