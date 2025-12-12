import JSConfetti from 'js-confetti'
const jsConfetti = new JSConfetti()
import { useEffect } from 'react'
import type { GuessType } from '../../models/models'
import { getGameOver } from '../../utils/utils'

interface Props {
  guesses: GuessType[]
}

export default function Confetti({ guesses = [] }: Props) {
  useEffect(() => {
    if (!getGameOver(guesses)) return

    const finalGuess = guesses.at(-1) as GuessType

    if (finalGuess.giveUp) {
      jsConfetti.addConfetti({
        confettiColors: ['red', 'orange', 'yellow'],
      })
      jsConfetti.addConfetti({
        emojis: [
          '😭',
          '😢',
          '🥲',
          '🤣',
          '💣',
          '🔥',
          '🤯',
          '😵',
          '🙃',
          '🤔',
          '👎🏻',
          '❌',
          '🗑️',
        ],
      })
      return
    }

    jsConfetti.addConfetti()
  }, [guesses])

  return null
}
