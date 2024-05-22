import { atom } from 'recoil';

const bleState = atom<{ title: string; key: string }>({
  key: 'bleState',
  default: undefined,
});
export { bleState };
