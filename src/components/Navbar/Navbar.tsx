import type { Dispatch, SetStateAction } from 'react'
import useTheme from '../../hooks/useTheme'
import type { GuessType, WordScore } from '../../models/models'
import { hamburgerIcon } from '../../svg/hamburger'
import { moonIcon } from '../../svg/moon'
import { sunIcon } from '../../svg/sun'
import Button from '../Button/Button'
import Dropdown, { type Option } from '../Dropdown/Dropdown'
import styles from './Navbar.module.scss'
import { getGameOver } from '../../utils/utils'
import { questionMarkIcon } from '../../svg/questionMark'

interface Props {
  guesses: GuessType[]
  setGuesses: Dispatch<SetStateAction<GuessType[]>>
  wordScores: WordScore[]
  setText: Dispatch<SetStateAction<string>>
  answers: string[]
  setAnswer: Dispatch<SetStateAction<string>>
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

export default function Navbar({
  guesses = [],
  setGuesses,
  wordScores = [],
  setText,
  answers = [],
  setAnswer,
  setModalOpen,
}: Props) {
  const [lightTheme, setLightTheme] = useTheme()

  const triggerHint = () => {
    const bestGuessScoreSoFar = guesses.length
      ? Math.min(...guesses.map(({ index }) => index))
      : 2048

    const indexOfHint = ~~(bestGuessScoreSoFar / 2)
    if (indexOfHint <= 0) {
      return
    }
    const hint: GuessType = {
      ...wordScores[indexOfHint],
      timestamp: new Date().toISOString(),
      hint: true,
      giveUp: false,
    }
    setGuesses((prev) => [...prev, hint])
  }

  const reset = () => {
    setGuesses([])
  }

  const giveUp = (guesses: GuessType[]) => {
    if (getGameOver(guesses)) return
    setText('')
    setGuesses((prev) => [
      ...prev,
      {
        ...wordScores[0],
        timestamp: new Date().toISOString(),
        hint: false,
        giveUp: true,
      },
    ])
  }

  const newGame = () => {
    setGuesses([])
    setAnswer(answers[~~(Math.random() * answers.length)])
  }

  const options: Option[] = [
    { label: 'Hint 💡', onClick: triggerHint },
    { label: 'Give up 😭', onClick: () => giveUp(guesses) },
    { label: 'Reset 🔄', onClick: reset },
    { label: 'New Game ⏭️', onClick: newGame },
  ]

  return (
    <nav className={styles.nav}>
      <img
        className={styles.logo}
        src='/hot-and-cold.svg'
        width='42px'
        height='42px'
      />
      <Button
        style={{ fill: 'var(--text-color)' }}
        onClick={() => setModalOpen((prev) => !prev)}
      >
        {questionMarkIcon}
      </Button>
      <Button
        style={{ fill: 'var(--text-color)' }}
        onClick={() => setLightTheme((prev) => !prev)}
      >
        {lightTheme ? moonIcon : sunIcon}
      </Button>
      <Dropdown options={options}>{hamburgerIcon}</Dropdown>
    </nav>
  )
}
