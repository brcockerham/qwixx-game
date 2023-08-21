import { useRecoilValue } from 'recoil'
import useReactWebSocket, { Options } from 'react-use-websocket'
import userIdAtom from '../recoil/selectors/userIdAtom'
import getGameId from '../utils/getGameId'

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const WS_URL = `${protocol}://${window.location.host}`.replace('3000', '9000')

const useWebSocket = (options?: Options) => {
  const userId = useRecoilValue(userIdAtom)

  return useReactWebSocket(WS_URL, {
    queryParams: { userId, gameId: getGameId() },
    share: true,
    shouldReconnect: () => true,
    ...options,
  })
}

export default useWebSocket
