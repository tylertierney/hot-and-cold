import styles from './Button.module.scss'
import type { DetailedHTMLProps, PropsWithChildren } from 'react'

type ButtonProps = DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export default function Button({
  children,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button className={styles.button} {...rest}>
      {children}
    </button>
  )
}
