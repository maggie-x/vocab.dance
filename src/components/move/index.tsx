import GIF from './gif';

const Move = ({
  name,
  gifLink,
  infoSrc,
  createdBy,
}: {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
}): React.ReactElement => {
  return (
    <div className="flex flex-col space-y-6">
      <GIF gifLink={gifLink}></GIF>
      <div className="flex flex-col space-y-3">
        <h1 className="text-4xl">{name}</h1>
        <div className="flex flex-col space-y-2">
          <p>
            Created by:{' '}
            {createdBy ?? <span className="text-slate-400">unknown</span>}
          </p>
          <p>
            Source:{' '}
            <a className="text-cyan-600" href={infoSrc}>
              {infoSrc}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Move;
