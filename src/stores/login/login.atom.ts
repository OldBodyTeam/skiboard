import { CreateUserDto } from '@services/data-contracts';
import { atom } from 'jotai';
// import { atom } from 'recoil';

// const userInfoState = atom<CreateUserDto | undefined>({
//   key: 'loginState',
//   default: undefined,
// });
const userInfoState = atom<CreateUserDto | undefined>(undefined);
export { userInfoState };
