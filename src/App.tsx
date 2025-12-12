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
import { getGameOver } from './utils/utils'

const answers = _answers as string[]

function App() {
  const [answer, setAnswer] = useState<string>(
    answers[~~(Math.random() * answers.length)]
  )
  const [wordScores, setWordScores] = useState<WordScore[]>([])
  const [guesses, setGuesses] = useState<GuessType[]>([])
  const [text, setText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const gameOver = getGameOver(guesses)

  useEffect(() => {
    const loadEmbeddings = async () => {
      const DIM = 384

      const [index, buf] = await Promise.all([
        fetch('/embeddings.json').then((r) => r.json()),
        fetch('/embeddings.bin').then((r) => r.arrayBuffer()),
      ])

      const result = rankSimilarWords(answer, index, new Float32Array(buf), DIM)
      setWordScores(result)
      // setGuesses(generateFakeGuesses(result, 100))
    }

    loadEmbeddings()
  }, [answer])

  const getTitle = (guesses: GuessType[]): ReactNode => {
    if (!guesses.length) {
      return 'Can you guess the secret word?'
    }

    if (getGameOver(guesses)) {
      const finalGuess = guesses.at(-1) as GuessType
      const wordEl = (
        <b
          style={{
            color: 'var(--purple)',
          }}
        >
          {finalGuess.word}
        </b>
      )

      if (finalGuess.giveUp) {
        return <>You gave up! The word was {wordEl}</>
      }

      return <>You won! The word was {wordEl}</>
    }

    return `Guesses: ${guesses.length}`
  }

  return (
    <>
      <Navbar
        guesses={guesses}
        setGuesses={setGuesses}
        wordScores={wordScores}
        setText={setText}
        answers={answers}
        setAnswer={setAnswer}
      ></Navbar>
      <h1 className={styles.title}>{getTitle(guesses)}</h1>
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
