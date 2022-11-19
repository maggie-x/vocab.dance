const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  return (
    <>
      {/* MP4 video on loop (kB) is a much smaller file size than .gif files (MB). */}
      <video
        className="w-full rounded-t-md"
        width="400"
        height="auto"
        autoPlay
        loop
        muted
      >
        <source src={gifLink} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default GIF;
