import { useEffect, useMemo, useState } from "react";

export const useMediaQuery = (query: string) => {
  const mediaQueryList = useMemo(() => matchMedia(query), [query]);
  const [matches, setMatches] = useState(mediaQueryList.matches);

  useEffect(() => {
    const handler = () => setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handler);
    return () => mediaQueryList.removeEventListener("change", handler);
  }, [mediaQueryList]);

  return matches;
};
