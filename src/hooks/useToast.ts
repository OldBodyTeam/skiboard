import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
const useToast = () => {
  const { t } = useTranslation();
  const run = useCallback((title: string) => {
    Toast.show(t(title), {
      position: Toast.positions.CENTER,
      delay: 0,
      animation: true,
      duration: Toast.durations.SHORT,
    });
  }, []);
  return run;
};
export default useToast;
