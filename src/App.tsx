import { Outlet } from 'react-router-dom'
import { getWordScores, type WordScore } from './update/getWordScores'
import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import Guess from './components/Guess/Guess'
import _answers from './update/answers.json' with {type: 'json'}
import _nouns from './update/nouns.json' with {type: 'json'}
import Navbar from './components/Navbar/Navbar'
import arrowLeftIcon from './svg/arrowLeft'
import arrowRightIcon from './svg/arrowRight'

const nouns = _nouns as string[]
const answers = _answers as string[]

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

type Guess = WordScore & {
  timestamp: string
  hint: boolean
}

const answer = answers[~~(Math.random() * answers.length)]

const wordScores = getWordScores(answer)

const testGuesses: Guess[] = Array(0)
  .fill(null)
  .map(() => nouns[~~(Math.random() * nouns.length)])
  .map((noun) => wordScores.find(({word}) => word === noun))
  .filter(Boolean)
  .map((wordScore) => ({...wordScore, timestamp: '', hint: false})) as Guess[]

function App() {
  const [guesses, setGuesses] = useState<Guess[]>(testGuesses)
  const [text, setText] = useState('')
  const [guessPageIndex, setGuessPageIndex] = useState(1)
  const [placeholder, setPlaceholder] = useState('apple')

  const mostRecentGuess = guesses.at(-1)

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setPlaceholder(placeholders[index++ % placeholders.length])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const triggerHint = () => {
    if(!guesses.length) {
      const hint: Guess = {
        ...wordScores[512], 
        timestamp: new Date().toISOString(), 
        hint: true
      }
      setGuesses(prev => [...prev, hint])
      return
    }

    const bestGuessScoreSoFar = Math.min(...guesses.map(({index}) => index))
    const indexOfHint = ~~(bestGuessScoreSoFar/2) 
    if(indexOfHint <= 0) {
      return
    }
    const hint: Guess = {
      ...wordScores[indexOfHint], 
      timestamp: new Date().toISOString(), 
      hint: true
    }
    setGuesses(prev => [...prev, hint])
  }

  const reset = () => {
    setGuesses([])
  }

  const title = guesses.length ? `Guesses: ${guesses.length}` : 'Can you guess the secret word?'

  return (
    <>
      <Navbar reset={reset} triggerHint={triggerHint}></Navbar>
      <h1 className={styles.title}>{title}</h1>
      <form className={styles.inputForm} onSubmit={(e) => e.preventDefault()}>
        <input
          className={styles.input}
          type="text"
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
            if(!userInput) return

            const hasAlreadyHasGuessed = guesses.find(({word}) => word === userInput)
            if(hasAlreadyHasGuessed) {
              setText('')
              return
            }

            const foundWordScore = wordScores.find(
              ({ word }) => word === userInput
            )
            if (foundWordScore) {
              const guess: Guess = {...foundWordScore, timestamp: new Date().toISOString(), hint: false}
              setGuesses((prev) => [...prev, guess])
            }
            setText('')
          }}
        >
          Guess
        </button>
      </form>
      <br />
      <br />
      {!!guesses.length && (
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
            .map(({ index, word, hint }, key) => (
              <Guess key={key} word={word} index={index} hint={hint} />
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
      )}
      {/* <Navbar /> */}
      <Outlet></Outlet>
    </>
  )
}

export default App
