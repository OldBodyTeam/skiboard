import { useMemoizedFn } from 'ahooks';
import { isAxiosError } from 'axios';
import { get } from 'lodash';
import Toast from 'react-native-root-toast';

const useToastMessage = () => {
  const handleAxiosError = useMemoizedFn((error: unknown) => {
    let message = '未知错误';
    if (isAxiosError(error)) {
      if (error.response) {
        message = get(error, 'response.data.message', '未知错误');
      } else if (error.request) {
        message = get(error, 'request.responseText', '未知错误');
      } else {
        message = get(error, 'message', '未知错误');
      }
    }
    Toast.show(message, {
      position: Toast.positions.CENTER,
      delay: 0,
      animation: true,
      duration: Toast.durations.SHORT,
    });
  });
  const toast = useMemoizedFn((message: string) => {
    Toast.show(message, {
      position: Toast.positions.CENTER,
      delay: 0,
      animation: true,
      duration: Toast.durations.SHORT,
    });
  });
  return { handleAxiosError, toast };
};
export { useToastMessage };
