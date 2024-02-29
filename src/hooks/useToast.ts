import { useCallback } from 'react';
import Toast from 'react-native-root-toast';
const useToast = () => {
  const run = useCallback((title: string) => {
    Toast.show(title, {
      position: Toast.positions.CENTER,
      delay: 0,
      animation: true,
      duration: Toast.durations.SHORT,
    });
  }, []);
  return run;
};
export default useToast;
