import { useMemo } from 'react';
import { getSystemLanguage } from '@utils/i18next';

const useWebViewUrl = (path: string) => {
  const lng = getSystemLanguage();
  return useMemo(() => {
    return __DEV__
      ? `http://192.168.199.106:5173/${path}?lng=${lng}`
      : `https://ski-web.gawtec.com/${path}?lng=${lng}`;
  }, [path, lng]);
};
export { useWebViewUrl };
