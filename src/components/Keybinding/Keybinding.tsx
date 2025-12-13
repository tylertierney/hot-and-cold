import styles from './Keybinding.module.scss'
import type { CSSProperties, PropsWithChildren } from 'react'

interface Props {
  style?: CSSProperties
}

export default function Keybinding({
  children,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <span className={styles.keybinding} {...rest}>
      {children}
    </span>
  )
}
