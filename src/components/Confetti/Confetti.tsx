import JSConfetti from 'js-confetti'
import { useEffect } from 'react'
const jsConfetti = new JSConfetti()

interface Props {
  gameOver: boolean
}

export default function Confetti({ gameOver = false }: Props) {
  useEffect(() => {
    if (!gameOver) return
    jsConfetti.addConfetti()
  }, [gameOver])

  return null
}
