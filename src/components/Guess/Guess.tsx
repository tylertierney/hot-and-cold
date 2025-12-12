import type { CSSProperties } from 'react'
import styles from './Guess.module.scss'

const getScoreColor = (index: number): CSSProperties['color'] => {
  if (index <= 50) {
    return 'red'
  }
  if (index <= 100) {
    return 'orangered'
  }
  if (index <= 800) {
    return 'yellow'
  }
  if (index <= 1500) {
    return 'color-mix(in hsl, yellow 50%, var(--text-color))'
  }
  return 'var(--text-color)'
}

const getScoreIcon = (index: number): '🔥' | '☀️' | '' => {
  if (index <= 100) {
    return '🔥'
  }

  if (index <= 800) {
    return '☀️'
  }

  return ''
}

type Props = {
  word: string
  index: number
  mostRecent?: boolean
  hint?: boolean
  giveUp?: boolean
}

export default function Guess({
  word,
  index,
  mostRecent = false,
  hint = false,
  giveUp = false,
}: Props) {
  return (
    <div
      className={`${styles.guess} 
      ${mostRecent ? styles.mostRecent : ''}
      ${hint ? styles.hint : ''}
      ${giveUp ? styles.giveUp : ''}`}
    >
      <span className={styles.word}>
        <span>{word}</span>
        <span style={{ fontSize: '0.75rem' }}>&nbsp;{getScoreIcon(index)}</span>
      </span>
      <span
        className={`${styles.score}`}
        style={{ color: getScoreColor(index) }}
      >
        #{index}
      </span>
    </div>
  )
}
