import { selector } from 'recoil';
import { Color } from '../../types';
import lockedColorsAtom from './lockedColorsAtom';

const isColorLockedAtom = selector({
  key: 'isColorLockedAtom',
  get: ({ get }) => (key: Color['key']) => get(lockedColorsAtom).some(c => c.key === key),
})

export default isColorLockedAtom
