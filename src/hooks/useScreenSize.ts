import { useMemo } from 'react';
import { Dimensions } from 'react-native';

const useScreenSize = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  return useMemo(() => {
    return { width: Math.floor(width), height: Math.floor(height) };
  }, [width, height]);
};
export { useScreenSize };
