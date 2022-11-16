import { useState } from 'react';
import LoadingSpinner from '../loading';

const GIF = ({ gifLink }: { gifLink: string }): React.ReactElement => {
  return (
    <>
      <img className="w-full" src={gifLink} alt="Unable to load GIF"></img>
    </>
  );
};

export default GIF;
