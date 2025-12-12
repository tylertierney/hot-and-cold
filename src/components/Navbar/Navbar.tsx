import useTheme from '../../hooks/useTheme'
import { hamburgerIcon } from '../../svg/hamburger'
import { moonIcon } from '../../svg/moon'
import { sunIcon } from '../../svg/sun'
import Button from '../Button/Button'
import Dropdown, { type Option } from '../Dropdown/Dropdown'
import styles from './Navbar.module.scss'

interface Props {
  triggerHint: () => void
  reset: () => void
  giveUp: () => void
  newGame: () => void
}

export default function Navbar({ triggerHint, reset, giveUp, newGame }: Props) {
  const [lightTheme, setLightTheme] = useTheme()

  const options: Option[] = [
    { label: 'Hint 💡', onClick: triggerHint },
    { label: 'Give up 😭', onClick: giveUp },
    { label: 'Reset 🔄', onClick: reset },
    { label: 'New Game ⏭️', onClick: newGame },
  ]

  return (
    <nav
      className={styles.nav}
      style={{
        backdropFilter: 'blur(8px)',
        background: '#fff0',
      }}
    >
      <Button
        style={{ fill: 'var(--text-color)' }}
        onClick={() => setLightTheme((prev) => !prev)}
      >
        {lightTheme ? moonIcon : sunIcon}
      </Button>
      <Dropdown style={{ alignSelf: 'flex-end' }} options={options}>
        {hamburgerIcon}
      </Dropdown>
    </nav>
  )
}
