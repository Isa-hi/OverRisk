import React from 'react';

interface HandleComponentProps {
  className?: string;
}

const HandleComponent: React.FC<HandleComponentProps> = ({ className }) => {
  return (
    <div className={`handle ${className} size-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary `}/>
  );
};

export default HandleComponent;
