const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  return (
    <img
      className="w-full"
      src={gifLink}
      alt="Unable to load GIF"
      loading="lazy"
    ></img>
  );
};

export default GIF;
