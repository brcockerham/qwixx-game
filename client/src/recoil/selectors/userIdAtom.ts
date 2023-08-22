import { nanoid } from 'nanoid';
import { constSelector } from 'recoil';
import storageUtil from '../../utils/storageUtil';

const userIdAtom = constSelector(storageUtil.localStorage.get('userId', nanoid()))

export default userIdAtom
