import { userInfoState } from '@stores/login/login.atom';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue } from 'jotai';

const useDebug = () => {
  const userInfo = useAtomValue(userInfoState);
  const getDebugStatus = useMemoizedFn(() => {
    return userInfo?.id === '0f7f49e3-378d-4d41-8ab5-323531575f39';
  });
  return { getDebugStatus };
};
export { useDebug };
