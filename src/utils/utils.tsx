import _nouns from '../update/nouns.json'
const nouns = _nouns as string[]

import type { GuessType, WordScore } from '../models/models'

export const generateFakeGuesses = (
  length = 25,
  wordScores: WordScore[]
): GuessType[] => {
  return Array(length)
    .fill(null)
    .map(() => nouns[~~(Math.random() * nouns.length)])
    .map((noun) => wordScores.find(({ word }) => word === noun) as WordScore)
    .filter(Boolean)
    .map((wordScore) => ({
      ...wordScore,
      timestamp: '',
      hint: false,
      giveUp: false,
    }))
}
