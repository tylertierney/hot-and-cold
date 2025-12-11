import embeddingsObject from './embeddings.json' with {type: 'json'}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 1), 0)
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0))
  return dot / (magA * magB)
}

export type WordScore = {
  index: number
  word: string
  score: number
}

export const getWordScores = (inputWord: string): WordScore[] => {
  const embeddings = embeddingsObject as Record<string, number[]>
  if (!embeddings[inputWord]) return []

  const inputVector = embeddings[inputWord]

  const results = Object.entries(embeddings)
    .map(([word, vec]) => ({ word, score: cosineSimilarity(inputVector, vec) }))
    .sort((a, b) => b.score - a.score)
    .map((wordAndScore, index) => ({ ...wordAndScore, index }))

  return results
}
