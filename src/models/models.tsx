export type WordScore = {
  index: number
  word: string
  score: number
}

export type GuessType = WordScore & {
  timestamp: string
  hint: boolean
  giveUp: boolean
}
