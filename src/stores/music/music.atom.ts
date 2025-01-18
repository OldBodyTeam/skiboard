import { atom } from 'recoil';

const musicState = atom<string>({
  key: 'musicState',
  default: 'Ocean of Thought',
});
export { musicState };
