import { Outlet } from 'react-router-dom'
import { rankSimilarWords } from './update/getWordScores'
import { useEffect, useState, type ReactNode } from 'react'
import styles from './App.module.scss'
import _answers from './update/answers.json'
import Navbar from './components/Navbar/Navbar'
import type { GuessType, WordScore } from './models/models'
import GuessList from './components/GuessList/GuessList'
import InputForm from './components/InputForm/InputForm'
import Modal from './components/Modal/Modal'
import Instructions from './components/Instructions/Instructions'
import Confetti from './components/Confetti/Confetti'
import { generateFakeGuesses } from './utils/utils'

const answers = _answers as string[]

function App() {
  const [answer, setAnswer] = useState<string>(
    answers[~~(Math.random() * answers.length)]
  )
  const [wordScores, setWordScores] = useState<WordScore[]>([])
  const [guesses, setGuesses] = useState<GuessType[]>([])
  const [text, setText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const loadEmbeddings = async () => {
      const DIM = 384

      const [index, buf] = await Promise.all([
        fetch('/index.json').then((r) => r.json()),
        fetch('/embeddings.bin').then((r) => r.arrayBuffer()),
      ])

      const result = rankSimilarWords(answer, index, new Float32Array(buf), DIM)
      setWordScores(result)
      setGuesses(generateFakeGuesses(result, 100))
    }

    loadEmbeddings()
  }, [answer])

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

  const newGame = () => {
    setGuesses([])
    setAnswer(answers[~~(Math.random() * answers.length)])
  }

  const giveUp = () => {
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

  const getTitle = (guesses: GuessType[], gameOver: boolean): ReactNode => {
    if (!guesses.length) {
      return 'Can you guess the secret word?'
    }

    if (gameOver) {
      const finalGuess = guesses.at(-1) as GuessType

      return (
        <>
          You won! The word was{' '}
          <b
            style={{
              color: 'rgb(155, 167, 255)',
            }}
          >
            {finalGuess.word}
          </b>
        </>
      )
    }

    return `Guesses: ${guesses.length}`
  }

  const gameOver = Boolean(guesses.at(-1)?.index === 0)

  return (
    <>
      <Navbar
        reset={reset}
        triggerHint={triggerHint}
        giveUp={giveUp}
        newGame={newGame}
      ></Navbar>
      <h1 className={styles.title}>{getTitle(guesses, gameOver)}</h1>
      <InputForm
        disabled={gameOver}
        guesses={guesses}
        setGuesses={setGuesses}
        wordScores={wordScores}
        gameOver={gameOver}
        text={text}
        setText={setText}
      ></InputForm>
      {guesses.length ? (
        <GuessList guesses={guesses} />
      ) : (
        <>
          <button
            className={styles.howToPlayBtn}
            onClick={() => setModalOpen((prev) => !prev)}
          >
            How to Play
          </button>
          <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
            <Instructions />
          </Modal>
        </>
      )}
      <Confetti gameOver={gameOver} />
      <Outlet></Outlet>
    </>
  )
}

export default App
