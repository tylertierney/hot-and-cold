import type { WordScore } from '../models/models'

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0
  let magA = 0
  let magB = 0

  for (let i = 0; i < a.length; i++) {
    const x = a[i]
    const y = b[i]
    dot += x * y
    magA += x * x
    magB += y * y
  }

  return dot / Math.sqrt(magA * magB)
}

function getEmbedding(idx: number, floats: Float32Array, DIM: number) {
  return floats.subarray(idx * DIM, (idx + 1) * DIM)
}

export const rankSimilarWords = (
  targetWord: string,
  index: Record<string, number>,
  floats: Float32Array,
  DIM: number
): WordScore[] => {
  const targetIndex = index[targetWord]
  if (targetIndex === undefined) return []

  const targetVec = getEmbedding(targetIndex, floats, DIM)

  // compute similarity for each word
  const results = []

  for (const [word, idx] of Object.entries(index)) {
    const vec = getEmbedding(idx, floats, DIM)
    const sim = cosineSimilarity(targetVec, vec)

    results.push({ word, score: sim })
  }

  // sort descending
  results.sort((a, b) => b.score - a.score)

  return results.map((wordAndScore, index) => ({ ...wordAndScore, index }))
}
