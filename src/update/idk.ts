import fs from 'fs'
import path from 'path'
import readlineSync from 'readline-sync'
import _nouns from './nouns.json' with { type: 'json' }
const __dirname = import.meta.dirname

// Run this script to be prompted - quickly - for random nouns. 
// When you see one that makes for a good puzzle solution, hit Y/y and
// it'll be added to answers.json and ensures that all values are unique.

const nouns = _nouns as string[]

while(true) {
  const answer = nouns[~~(Math.random() * nouns.length)]
  if(readlineSync.keyInYN(`How about ${answer}?`)) {
    const filePath = path.join(__dirname, 'answers.json')
    const currentAnswersJson = fs.readFileSync(filePath, { encoding: 'utf8' })
    const currentAnswersArr = JSON.parse(currentAnswersJson) as string[]
    const newAnswers = [...currentAnswersArr, answer]
    const set = new Set(newAnswers)
    const uniqueAnswers = [...set]

    fs.writeFileSync(path.join(__dirname, 'answers.json'), JSON.stringify(uniqueAnswers))
  }
}