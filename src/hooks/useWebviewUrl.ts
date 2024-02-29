import { useMemo } from 'react';

const useWebViewUrl = (path: string) => {
  return useMemo(() => {
    return __DEV__
      ? `http://192.168.199.106:5173/${path}`
      : `https://ski-web.gawtec.com/${path}`;
  }, [path]);
};
export { useWebViewUrl };
