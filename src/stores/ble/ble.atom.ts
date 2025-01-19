// import { atom } from 'recoil';

import { atom } from 'jotai';

// const bleState = atom<{ title: string; key: string }>({
//   key: 'bleState',
//   default: undefined,
// });

const bleState = atom();
export { bleState };
