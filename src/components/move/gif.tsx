const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  return (
    <>
      <img
        className="w-full rounded-t-md"
        src={gifLink}
        alt="Unable to load GIF"
      ></img>
    </>
  );
};

export default GIF;
