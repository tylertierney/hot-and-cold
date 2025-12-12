import { hamburgerIcon } from '../../svg/hamburger'
import Dropdown, { type Option } from '../Dropdown/Dropdown'
import styles from './Navbar.module.scss'

interface Props {
  triggerHint: () => void
  reset: () => void
  giveUp: () => void
}

export default function Navbar({ triggerHint, reset, giveUp }: Props) {
  const options: Option[] = [
    { label: 'Hint', onClick: triggerHint },
    { label: 'Give up', onClick: giveUp },
    { label: 'Reset', onClick: reset },
  ]
  return (
    <nav
      className={styles.nav}
      style={{
        backdropFilter: 'blur(8px)',
        background: '#fff0',
      }}
    >
      <Dropdown style={{ alignSelf: 'flex-end' }} options={options}>
        {hamburgerIcon}
      </Dropdown>
    </nav>
  )
}
