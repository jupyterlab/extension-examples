import { useEffect } from "react";

const useExternalScript = (url: string) => {
  useEffect(() => {
    const head = document.querySelector("head") as HTMLElement;
    const script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);

    return () => {
      head.removeChild(script);
    };
  }, [url]);
};

export default useExternalScript;
