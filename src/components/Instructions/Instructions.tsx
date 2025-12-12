import { getScoreColor } from '../../utils/utils'
import styles from './Instructions.module.scss'

export default function Instructions() {
  return (
    <div className={styles.instructions}>
      <h1 className={styles.h1}>How to Play</h1>
      <p className={styles.p}>
        Guess the secret word by typing any word you think is related. Rank (#)
        shows how close your guess is compared to all other words. Lower is
        better.
      </p>
      <p className={styles.p}>Examples:</p>
      <ul className={styles.ul}>
        <li className={styles.li}>
          Secret word: <b>car</b>
        </li>
        <li className={styles.li}>
          truck → <b style={{ color: getScoreColor(12) }}>#12</b> &#40;very
          close&#41;
        </li>
        <li className={styles.li}>
          tire → <b style={{ color: getScoreColor(344) }}>#344</b>{' '}
          &#40;close-ish&#41;
        </li>
        <li className={styles.li}>
          banana → <b style={{ color: getScoreColor(17_946) }}>#17,946</b>{' '}
          &#40;far&#41;
        </li>
      </ul>
    </div>
  )
}
