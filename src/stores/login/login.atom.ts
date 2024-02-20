import { CreateUserDto } from '@services/data-contracts';
import { atom } from 'recoil';

const userInfoState = atom<CreateUserDto | undefined>({
  key: 'loginState',
  default: undefined,
});
export { userInfoState };
