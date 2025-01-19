import { atom } from 'jotai';
const defaultDataAtom = { speed: '57aa020061', reverse: '', title: '' };
const ledAtom = atom({ ...defaultDataAtom });
const glowAtom = atom({ ...defaultDataAtom });
export { ledAtom, glowAtom, defaultDataAtom };
