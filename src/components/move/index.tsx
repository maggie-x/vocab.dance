import StyleLabel, { Style } from '../style';
import GIF from './gif';

const Move = ({
  name,
  gifLink,
  infoSrc,
  createdBy,
  style,
}: {
  name: string;
  gifLink: string;
  infoSrc: string;
  createdBy?: string;
  style?: Style;
}): React.ReactElement => {
  return (
    <div className="border rounded-md border-zinc-900 drop-shadow-md bg-zinc-800">
      {/* <div className="flex flex-col space-y-6"> */}
      <GIF gifLink={gifLink}></GIF>
      <div className="flex flex-col space-y-2 p-6 mt-2">
        <h1 className="text-2xl font-semibold text-zinc-100">{name}</h1>
        {style && <StyleLabel style={style} />}
        <div className="flex flex-col space-y-2 opacity-70 text-sm">
          {createdBy && <p>Created by: {createdBy}</p>}
          <p>
            Source:{' '}
            <a className="text-yellow-200" href={infoSrc}>
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
