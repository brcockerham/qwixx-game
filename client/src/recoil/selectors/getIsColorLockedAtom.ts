import { selector } from 'recoil';
import { Color } from '../../types';
import lockedColorsAtom from './lockedColorsAtom';

const getIsColorLockedAtom = selector({
  key: 'getIsColorLockedAtom',
  get: ({ get }) => {
    const lockedColors = get(lockedColorsAtom)

    return (color: Color) => lockedColors.some(lockedColor => color.key === lockedColor.key)
  },
})

export default getIsColorLockedAtom
