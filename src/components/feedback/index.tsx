const Feedback = () => {
  return (
    <div className="flex flex-col space-y-2 my-12">
      <div className="text-sm  text-center text-pink-300">
        Made with 💗 by Maggie (
        <a
          className="text-orange-400"
          href="https://www.instagram.com/mmaggiex_/"
          target="_blank"
          rel="noreferrer"
        >
          @mmaggiex_
        </a>
        )
      </div>
      <div className="text-xs text-zinc-400 text-center">
        This passion project was created with the intention to have an easily
        accessible and searchable dictionary of well-known dance moves and
        foundations in hopes of aiding dancers with their training (and my own
        training 🙈). This is very much still a WIP. If you would like to
        suggest a move, suggest a feature, or leave constructive feedback,
        please fill out the form below.
      </div>
      <div className="flex justify-center space-x-2">
        <span>👉</span>
        <a
          className="text-sm underline text-orange-400"
          href="https://rehjbjil7to.typeform.com/to/nJYZSoLN"
          target="_blank"
          rel="noreferrer"
        >
          Leave feedback
        </a>
      </div>
    </div>
  );
};

export default Feedback;
