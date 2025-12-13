import {
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react'
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
import Keybinding from '../Keybinding/Keybinding'

interface Props {
  guesses: GuessType[]
  setGuesses: Dispatch<SetStateAction<GuessType[]>>
  wordScores: WordScore[]
  setText: Dispatch<SetStateAction<string>>
  answers: string[]
  setAnswer: Dispatch<SetStateAction<string>>
  setModalOpen: Dispatch<SetStateAction<boolean>>
  isDesktop: boolean
}

export default function Navbar({
  guesses = [],
  setGuesses,
  wordScores = [],
  setText,
  answers = [],
  setAnswer,
  setModalOpen,
  isDesktop = true,
}: Props) {
  const [lightTheme, setLightTheme] = useTheme()

  const triggerHint = useCallback(() => {
    const bestGuessScoreSoFar = guesses.length
      ? Math.min(...guesses.map(({ index }) => index))
      : 4096

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
  }, [guesses, setGuesses, wordScores])

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
    {
      label: (
        <span style={{ flexGrow: 1, position: 'relative' }}>
          Hint 💡{' '}
          {isDesktop && (
            <Keybinding style={{ right: '-6px' }}>Ctrl + H</Keybinding>
          )}
        </span>
      ),
      onClick: triggerHint,
    },
    {
      label: (
        <span style={{ flexGrow: 1, position: 'relative' }}>
          Give up 😭{' '}
          {isDesktop && (
            <Keybinding style={{ right: '-6px' }}>Ctrl + X</Keybinding>
          )}
        </span>
      ),
      onClick: () => giveUp(guesses),
    },
    { label: 'Reset 🔄', onClick: reset },
    {
      label: (
        <span style={{ flexGrow: 1, position: 'relative' }}>
          New Game ⏭️{' '}
          {isDesktop && (
            <Keybinding style={{ right: '-6px' }}>Ctrl + G</Keybinding>
          )}
        </span>
      ),
      onClick: newGame,
    },
  ]

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'h') {
          e.preventDefault()
          triggerHint()
        }
        if (e.key === 'g') {
          e.preventDefault()
          newGame()
        }
        if (e.key === 'x') {
          e.preventDefault()
          giveUp(guesses)
        }
      }

      if (getGameOver(guesses) && e.key === ' ') {
        e.preventDefault()
        newGame()
      }
    }

    window.addEventListener('keydown', listener)

    return () => window.removeEventListener('keydown', listener)
  }, [triggerHint, newGame, giveUp, guesses])

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
