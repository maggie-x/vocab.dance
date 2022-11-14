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
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl">{name}</h1>
        <div className="flex flex-col space-y-2">
          {createdBy && <p>Created by: {createdBy}</p>}
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
