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
    <div className="border rounded-md border-gray-700 drop-shadow-md bg-gray-700">
      {/* <div className="flex flex-col space-y-6"> */}
      <GIF gifLink={gifLink}></GIF>
      <div className="flex flex-col space-y-2 p-6 mt-2">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div className="flex flex-col space-y-2 opacity-70">
          {createdBy && <p>Created by: {createdBy}</p>}
          <p>
            Source:{' '}
            <a className="text-cyan-200" href={infoSrc}>
              {infoSrc}
            </a>
          </p>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Move;
