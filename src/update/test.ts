import fs from 'fs'
import path from 'path'
const __dirname = import.meta.dirname
import nouns from './nouns.json' with {type: 'json'}

// import vocab from './nouns.json' with {type: 'json'}

// const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const filePath = path.join(__dirname, 'words.txt')

const words = fs.readFileSync(filePath, { encoding: 'utf8' })
const wordsAsArray = words.split('\n')
const wordsAsJson = [...wordsAsArray, ...(nouns as string[])].map((str) =>
  str
    .toLowerCase()
    // .split('')
    // .filter((char) => alphabet.includes(char))
    // .join('')
).filter(word => word.length >= 3)
const set = new Set(wordsAsJson)
const result = [...set]

fs.writeFileSync(
  path.join(__dirname, 'words.json'),
  JSON.stringify(result)
)
