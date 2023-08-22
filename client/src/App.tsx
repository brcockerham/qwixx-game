import Board from './components/Board'
import Dice from './components/Dice'
import { useRecoilValue } from 'recoil'
import LogIn from './components/LogIn'
import Players from './components/Players'
import { PropsWithChildren, useRef } from 'react'
import Actions from './components/Actions'
import isLoggedInAtom from './recoil/selectors/isLoggedInAtom'
import isGameOverAtom from './recoil/selectors/isGameOverAtom'
import { DieContainerRef } from 'react-dice-complete/dist/DiceContainer'
import MessageHandler from './components/MessageHandler'

const AppContainer = ({ children }:  PropsWithChildren) => (
  <div className="App">
    <MessageHandler />
    {children}
  </div>
)

const App = () => {

  const diceRef = useRef<DieContainerRef>(null)

  const isLoggedIn = useRecoilValue(isLoggedInAtom)
  const isGameOver = useRecoilValue(isGameOverAtom)

  if (!isLoggedIn) {
    return (
      <AppContainer>
        <LogIn />
        <Players />
      </AppContainer>
    )
  }

  return (
    <AppContainer>
      <Dice ref={diceRef} />
      <Board />
      <Actions diceRef={diceRef} />
      {isGameOver && <div style={{ textAlign: 'center', margin: 16, fontSize: 'x-large' }}>Game Over</div>}
      <Players />
    </AppContainer>
  )
}

export default App
