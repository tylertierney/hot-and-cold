import _nouns from '../update/nouns.json'
const nouns = _nouns as string[]

import type { GuessType, WordScore } from '../models/models'
import type { CSSProperties } from 'react'

export const generateFakeGuesses = (
  wordScores: WordScore[],
  length = 25
): GuessType[] => {
  return Array(length)
    .fill(null)
    .map(() => nouns[~~(Math.random() * nouns.length)])
    .map((noun) => wordScores.find(({ word }) => word === noun) as WordScore)
    .filter(Boolean)
    .map((wordScore) => ({
      ...wordScore,
      timestamp: new Date().toISOString(),
      hint: false,
      giveUp: false,
    }))
}

export const getNumberSuffix = (n: number): string => {
  const onesDigit = n % 10
  if (onesDigit === 0) return 'th'
  if (onesDigit === 1) return 'st'
  if (onesDigit === 2) return 'nd'
  if (onesDigit === 3) return 'rd'
  if (onesDigit >= 4) return 'th'
  return ''
}

export const getGameOver = (guesses: GuessType[]): boolean => {
  const latestGuess = guesses.at(-1)
  if (!latestGuess) return false
  return latestGuess.index <= 0
}

export const getScoreColor = (index: number): CSSProperties['color'] => {
  if (index <= 50) {
    return 'var(--red)'
  }
  if (index <= 100) {
    return 'var(--orange)'
  }
  if (index <= 800) {
    return 'var(--yellow)'
  }
  if (index <= 1500) {
    return 'var(--faded-yellow)'
  }
  return 'var(--blue)'
}
