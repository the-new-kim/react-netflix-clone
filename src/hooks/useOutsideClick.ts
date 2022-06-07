import React, { useEffect, useState } from "react";

function useOutsideClick(ref: React.MutableRefObject<HTMLElement | null>) {
  const [outsideClicked, setOutsideClicked] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      setOutsideClicked(!ref.current?.contains(event.target as Node));
    };
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [ref]);

  return outsideClicked;
}

export default useOutsideClick;
