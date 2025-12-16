import styles from './Keybinding.module.scss'
import type {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'

type Props = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export default function Keybinding({
  children,
  className = '',
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <span className={`${styles.keybinding} ${className}`} {...rest}>
      {children}
    </span>
  )
}
