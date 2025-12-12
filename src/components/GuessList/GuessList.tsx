import styles from './GuessList.module.scss'
import type { GuessType } from '../../models/models'
import Guess from '../Guess/Guess'
import { useState } from 'react'
import arrowLeftIcon from '../../svg/arrowLeft'
import arrowRightIcon from '../../svg/arrowRight'

interface Props {
  guesses: GuessType[]
}

export default function GuessList({ guesses }: Props) {
  const [guessPageIndex, setGuessPageIndex] = useState(1)

  const mostRecentGuess = guesses.at(-1)

  return (
    <div className={styles.guesses}>
      {mostRecentGuess && (
        <Guess
          index={mostRecentGuess.index}
          word={mostRecentGuess.word}
          mostRecent={true}
        ></Guess>
      )}
      {guesses
        .toSorted((a, b) => a.index - b.index)
        .slice((guessPageIndex - 1) * 10, (guessPageIndex - 1) * 10 + 10)
        .map(({ index, word, hint, giveUp }, key) => (
          <Guess
            key={key}
            word={word}
            index={index}
            hint={hint}
            giveUp={giveUp}
          />
        ))}
      <div className={styles.pageControls}>
        <div className={styles.pageCounter}>
          <button
            className={styles.pageIndexBtn}
            disabled={guessPageIndex <= 1}
            onClick={() => setGuessPageIndex((prev) => prev - 1)}
          >
            {arrowLeftIcon}
          </button>
          <span style={{ marginLeft: '0.75rem' }}>{guessPageIndex}</span>
          <span>/</span>
          <span style={{ marginRight: '0.75rem' }}>
            {Math.ceil(guesses.length / 10)}
          </span>
          <button
            className={styles.pageIndexBtn}
            disabled={guessPageIndex >= Math.ceil(guesses.length / 10)}
            onClick={() => setGuessPageIndex((prev) => prev + 1)}
          >
            {arrowRightIcon}
          </button>
        </div>
      </div>
    </div>
  )
}
