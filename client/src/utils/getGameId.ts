import { nanoid } from 'nanoid';

if (!window.location.hash) {
  window.location.hash = nanoid()
}

const getGameId = () => window.location.hash.split('#')[1]

export default getGameId
