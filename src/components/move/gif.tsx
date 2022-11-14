const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  return <img className="w-full" src={gifLink} alt="GIF of move"></img>;
};

export default GIF;
