/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  FeatureExtractionPipeline,
  pipeline,
  Tensor,
} from '@xenova/transformers'
import fs from 'fs'
import path from 'path'
import words from './words.json' with { type: 'json' }
const __dirname = import.meta.dirname

// Lazy-load the model
let embedder: FeatureExtractionPipeline | null = null

export async function loadModel() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
}

await loadModel()

export function meanPool(tensor: Tensor): number[] {
  const data = tensor.data as Float32Array
  const [, tokens, dim] = tensor.dims as [number, number, number]

  // we assume batch = 1 -> slice data into token vectors:
  const vectors: number[][] = []
  for (let i = 0; i < tokens; i++) {
    vectors.push(Array.from(data.slice(i * dim, (i + 1) * dim)))
  }

  // compute average vector
  const pooled = new Array(dim).fill(0)
  for (const vec of vectors) {
    for (let j = 0; j < dim; j++) pooled[j] += vec[j]
  }
  return pooled.map((x) => x / tokens)
}

// export function cosineSimilarity(a: number[], b: number[]): number {
//   const dot = a.reduce((sum, v, i) => sum + v * (b[i] ?? 1), 0)
//   const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
//   const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0))
//   return dot / (magA * magB)
// }

// export async function getSimilarWords(
//   word: string,
//   vocabulary: string[],
//   topK: number = 10
// ): Promise<{ word: string; score: number }[]> {
//   if (!embedder) throw new Error('Model not loaded. Call loadModel() first.')

//   const wordVec = meanPool((await embedder(word)) as Tensor)

//   const results = []
//   for (const v of vocabulary) {
//     const vec = meanPool((await embedder(v)) as Tensor)
//     results.push({ word: v, score: cosineSimilarity(wordVec, vec) })
//   }

//   return results.sort((a, b) => b.score - a.score).slice(0, topK)
//   // .filter((item) => item.word !== word)
// }

const _words = words as string[]

const generateEmbeddings = async () => {
  if(!embedder) return

  const embeddings: Record<string, number[]> = {};

  for(let i = 0; i < _words.length; i++) {
    const word = _words[i] as string
    try {
      const tensor = (await embedder(word)) as Tensor
      embeddings[word] = meanPool(tensor)
    } catch (err) {
      console.warn(`Failed to embed word: ${word}`, err);
    }

    if(i % 1000 === 0) {
      console.log(`Embedded ${i} words`)
    }
    
  }

  fs.writeFileSync(
    path.join(__dirname, 'embeddings.json'),
    JSON.stringify(embeddings)
  )
}

generateEmbeddings().catch(console.error)
