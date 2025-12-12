import type { GuessType, WordScore } from '../../models/models'
import { getNumberSuffix, getScoreColor } from '../../utils/utils'
import styles from './InputForm.module.scss'
import {
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from 'react'

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

const helperTexts = [
  `Keep it rolling!`,
  `Keep guessing! Try as many as you want.`,
  `Try to get under 1000. That's when it gets interesting!`,
  `You can do it!`,
  `Stuck? Grab a hint from the menu.`,
  `No one would blame you for giving up...`,
  `You can change the theme with the sun/moon icon in the navbar`,
]

const getHelperText = (guesses: GuessType[], gameOver: boolean): string => {
  if (!guesses.length) return ''
  if (gameOver) return ''

  const latestGuess = guesses.at(-1) as GuessType
  const { word, index } = latestGuess
  if (guesses.length === 1) {
    return `"${word}" is the ${index.toLocaleString('en-us')}${getNumberSuffix(
      index
    )} closest. Smaller number = closer.`
  }

  return helperTexts[~~(Math.random() * helperTexts.length)]
}

interface Props {
  guesses: GuessType[]
  wordScores: WordScore[]
  setGuesses: Dispatch<SetStateAction<GuessType[]>>
  disabled: boolean
  gameOver: boolean
  text: string
  setText: Dispatch<SetStateAction<string>>
}

export default function InputForm({
  guesses = [],
  wordScores = [],
  setGuesses,
  disabled = false,
  gameOver = false,
  text = '',
  setText,
}: PropsWithChildren<Props>) {
  const [placeholder, setPlaceholder] = useState(placeholders[0])
  const [helperText, setHelperText] = useState<ReactNode>('')

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setPlaceholder(placeholders[index++ % placeholders.length])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setHelperText(getHelperText(guesses, gameOver))
  }, [guesses, gameOver])

  return (
    <form className={styles.inputForm} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.inputAndBtn}>
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
          disabled={disabled}
        />
        <button
          className={styles.submitBtn}
          onClick={() => {
            const userInput = text.toLowerCase().trim()
            if (!userInput) return

            const hasAlreadyGuessed = guesses.find(
              ({ word }) => word === userInput
            )
            if (hasAlreadyGuessed) {
              const { word, index } = hasAlreadyGuessed
              setHelperText(
                <>
                  You already guessed "{word}" &#40;
                  <span style={{ color: getScoreColor(index) }}>#{index}</span>
                  &#41;
                </>
              )
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
            } else {
              setHelperText(`I don't recognize "${text}". Try another word.`)
            }
            setText('')
          }}
          disabled={disabled}
        >
          <div
            className={styles.gradient}
            style={{
              backgroundImage: text
                ? `conic-gradient(from 135deg, #4ce1f2, #ffbf0b, #de3232 66%, #4ce1f2)`
                : '',
            }}
          ></div>
          <div className={styles.label}>Guess</div>
        </button>
      </div>
      <small className={styles.helperText}>{helperText}</small>
    </form>
  )
}
