const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  return <img className="w-full" src={gifLink}></img>;
};

export default GIF;
