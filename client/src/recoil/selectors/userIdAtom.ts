import { nanoid } from 'nanoid';
import { constSelector } from 'recoil';
import localStorageUtil from '../../utils/localStorageUtil';

const userIdAtom = constSelector(localStorageUtil.get('userId', nanoid()))

export default userIdAtom
