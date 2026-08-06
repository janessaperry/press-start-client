import { useEffect, useState } from "react";

const useIsMobile = () => {
  const mediaQuery = '(max-width: 1024px)';
  const [ isMobile, setIsMobile ] = useState<boolean>(window.matchMedia(mediaQuery).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(max-width: 1024px)');
    const handleScreenSizeChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    mediaQueryList.addEventListener('change', handleScreenSizeChange)
    return () => mediaQueryList.removeEventListener('change', handleScreenSizeChange);
  }, []);

  return isMobile;
}

export default useIsMobile;