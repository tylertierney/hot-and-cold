import type { CSSProperties } from 'react'
import styles from './Guess.module.scss'

const getScoreColor = (index: number): CSSProperties['color'] => {
  if (index <= 50) {
    return 'var(--red)'
  }
  if (index <= 100) {
    return 'var(--orange)'
  }
  if (index <= 800) {
    return 'var(--yellow)'
  }
  if (index <= 1500) {
    return 'var(--faded-yellow)'
  }
  return 'var(--blue)'
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
        #{index.toLocaleString('en-us')}
      </span>
    </div>
  )
}
