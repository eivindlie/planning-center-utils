import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const mediaQueryList = matchMedia(query);
  const [matches, setMatches] = useState(mediaQueryList.matches);

  useEffect(() => {
    const handler = () => setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handler);
    return () => mediaQueryList.removeEventListener("change", handler);
  }, []);

  return matches;
};
