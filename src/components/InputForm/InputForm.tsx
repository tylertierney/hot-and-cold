import type { GuessType, WordScore } from '../../models/models'
import styles from './InputForm.module.scss'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const placeholders = [
  'apple',
  'banana',
  'pizza',
  'house',
  'computer',
  'truck',
  'playground',
  'pencil',
  'galaxy',
  'whale',
]

interface Props {
  guesses: GuessType[]
  wordScores: WordScore[]
  setGuesses: Dispatch<SetStateAction<GuessType[]>>
}

export default function InputForm({ guesses, wordScores, setGuesses }: Props) {
  const [text, setText] = useState('')
  const [placeholder, setPlaceholder] = useState(placeholders[0])

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setPlaceholder(placeholders[index++ % placeholders.length])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <form className={styles.inputForm} onSubmit={(e) => e.preventDefault()}>
      <input
        className={styles.input}
        type='text'
        onChange={(e) => {
          const word = e.target.value
            .toLowerCase()
            .trim()
            .split('')
            .filter((char) => alphabet.includes(char))
            .join('')

          setText(word)
        }}
        value={text}
        placeholder={`Try ${placeholder}`}
        enterKeyHint='go'
      />
      <button
        className={styles.submitBtn}
        onClick={() => {
          const userInput = text.toLowerCase().trim()
          if (!userInput) return

          const hasAlreadyHasGuessed = guesses.find(
            ({ word }) => word === userInput
          )
          if (hasAlreadyHasGuessed) {
            setText('')
            return
          }

          const foundWordScore = wordScores.find(
            ({ word }) => word === userInput
          )
          if (foundWordScore) {
            const guess: GuessType = {
              ...foundWordScore,
              timestamp: new Date().toISOString(),
              hint: false,
              giveUp: false,
            }
            setGuesses((prev) => [...prev, guess])
          }
          setText('')
        }}
      >
        Guess
      </button>
    </form>
  )
}
