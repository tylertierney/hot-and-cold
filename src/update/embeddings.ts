import {
  pipeline,
  Tensor
} from '@xenova/transformers'
import fs from 'fs'
import path from 'path'
import words from './words.json' with { type: 'json' }
const __dirname = import.meta.dirname

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

export function meanPool(tensor: Tensor) {
  const data = tensor.data; // Float32Array
  const [, tokens, dim] = tensor.dims;

  const pooled = new Float32Array(dim); // keep as Float32!

  // Sum token vectors into pooled[]
  for (let t = 0; t < tokens; t++) {
    const offset = t * dim;
    for (let i = 0; i < dim; i++) {
      pooled[i] += data[offset + i];
    }
  }

  // divide by number of tokens
  for (let i = 0; i < dim; i++) {
    pooled[i] /= tokens;
  }

  return pooled;
}

const DIM = 384;

const _words = words as string[]

async function generateEmbeddings() {
  const vectors: Float32Array[] = []; // we will flatten later
  const index: Record<string, number> = {};   // word → vector index

  for (let i = 0; i < _words.length; i++) {
    const word = _words[i];

    try {
      const tensor = await embedder(word);
      const pooled = meanPool(tensor); // Float32Array length DIM

      index[word] = vectors.length; // store this vector's index
      vectors.push(pooled);
    } catch (err) {
      console.warn("Failed to embed word:", word, err);
    }

    if (i % 1000 === 0) {
      console.log(`Embedded ${i} words`);
    }
  }

  // Flatten into one big Float32Array
  const output = new Float32Array(vectors.length * DIM);

  for (let i = 0; i < vectors.length; i++) {
    output.set(vectors[i], i * DIM);
  }

  // Write binary file
  fs.writeFileSync(
    path.join(__dirname, "../../public/embeddings.bin"),
    Buffer.from(output.buffer)
  );

  // Write index file
  fs.writeFileSync(
    path.join(__dirname, "../../public/index.json"),
    JSON.stringify(index)
  );

  console.log("Done! Created embeddings.bin and index.json");
}

generateEmbeddings().catch(console.error);
