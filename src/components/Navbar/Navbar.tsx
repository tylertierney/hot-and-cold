import { hamburgerIcon } from '../../svg/hamburger'
import Dropdown, { type Option } from '../Dropdown/Dropdown'
import styles from './Navbar.module.scss'

interface Props {
  triggerHint: () => void
  reset: () => void
}

export default function Navbar({ triggerHint, reset }: Props) {
  const options: Option[] = [
    { label: 'Hint', onClick: triggerHint },
    { label: 'Give up', onClick: () => console.log('nooo') },
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
