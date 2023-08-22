import { useRecoilValue } from 'recoil'
import playersAtom from '../recoil/atoms/playersAtom'
import { FaCheckCircle, FaLock } from 'react-icons/fa'
import { Player } from '../types'
import playerCardAtom from '../recoil/selectors/playerCardAtom'
import getPointRange from '../helpers/getPointRange'
import colorsAtom from '../recoil/selectors/colorsAtom'

const PlayerCard = ({ player, index }: { player: Player, index: number}) => {
  const { baseColors } = useRecoilValue(colorsAtom)
  const { color } = baseColors[(index + 2) % 4]
  const {
    score,
    penalties,
    isActivePlayer,
    isCurrentPlayer,
    isPlayerReady,
  } = useRecoilValue(playerCardAtom(player.userId))

  return (
    <div
      key={player.userId}
      className="Player"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="player-inner" style={{ color, ...isActivePlayer && { borderColor: color } }}>
        <div style={{ margin: 8, display: 'flex' }}>
          <FaCheckCircle color={isPlayerReady ? color : 'lightgray'} />
        </div>
        <div style={{ flexGrow: 1 }}>
          {player.userName}{isCurrentPlayer ? ' (you)' : ''}
        </div>
        <div style={{ margin: 8, textAlign: 'right' }}>
          {score > 0 ? `+${score}` : score}
        </div>
        <div style={{ margin: 8, textAlign: 'right', color: 'lightgray' }}>
          <div style={{ display: 'flex', textAlign: 'center' }}>
            {getPointRange(1, 4, true).map(value => (
              <span key={value} style={{ ...penalties?.includes(value) && { color }, minWidth: 14 }}>X</span>
            ))}
          </div>
          <div style={{ marginLeft: 16 }} />
          {baseColors.map(color => (
            <FaLock key={color.key} color={color.color} />
          ))}
        </div>
      </div>
    </div>
  )
}

const Players = () => {
  const players = useRecoilValue(playersAtom)
  
  return (
    <div className="Players">
      {players.map((player, index) => <PlayerCard key={player.userId} player={player} index={index} />)}
    </div>
  )
}

export default Players
