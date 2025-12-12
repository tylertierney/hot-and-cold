import { Outlet } from 'react-router-dom'
import { rankSimilarWords } from './update/getWordScores'
import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import _answers from './update/answers.json'
import Navbar from './components/Navbar/Navbar'
import type { GuessType, WordScore } from './models/models'
import GuessList from './components/GuessList/GuessList'
import InputForm from './components/InputForm/InputForm'
import Modal from './components/Modal/Modal'
import Instructions from './components/Instructions/Instructions'

const answers = _answers as string[]

function App() {
  const [answer, setAnswer] = useState<string>(
    answers[~~(Math.random() * answers.length)]
  )
  const [wordScores, setWordScores] = useState<WordScore[]>([])
  const [guesses, setGuesses] = useState<GuessType[]>([])

  useEffect(() => {
    const loadEmbeddings = async () => {
      const DIM = 384

      const [index, buf] = await Promise.all([
        fetch('/index.json').then((r) => r.json()),
        fetch('/embeddings.bin').then((r) => r.arrayBuffer()),
      ])

      const result = rankSimilarWords(answer, index, new Float32Array(buf), DIM)
      setWordScores(result)
    }

    loadEmbeddings()
  }, [])

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
    setAnswer(answers[~~(Math.random() * answers.length)])
  }

  const giveUp = () => {
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

  const title = guesses.length
    ? `Guesses: ${guesses.length}`
    : 'Can you guess the secret word?'

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Navbar reset={reset} triggerHint={triggerHint} giveUp={giveUp}></Navbar>
      <h1 className={styles.title}>{title}</h1>
      <InputForm
        guesses={guesses}
        setGuesses={setGuesses}
        wordScores={wordScores}
      />
      {guesses.length ? (
        <GuessList guesses={guesses} />
      ) : (
        <>
          <button
            className={styles.howToPlayBtn}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            How to Play
          </button>
          <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
            <Instructions />
          </Modal>
        </>
      )}
      <Outlet></Outlet>
    </>
  )
}

export default App
