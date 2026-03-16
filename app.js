/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  "apple",
  "banana",
  "orange",
  "grape",
  "melon",
  "cherry",
  "peach",
  "pear",
  "mango",
  "lemon"
]

const MAX_STRIKES = 3
const MAX_PASSES = 3

function App() {

  const savedGame = JSON.parse(localStorage.getItem("scrambleGame"))

  const [remainingWords, setRemainingWords] = React.useState(
    savedGame ? savedGame.remainingWords : shuffle(words)
  )

  const [currentWord, setCurrentWord] = React.useState(
    savedGame ? savedGame.currentWord : remainingWords[0]
  )

  const [scrambled, setScrambled] = React.useState(
    savedGame ? savedGame.scrambled : shuffle(remainingWords[0])
  )

  const [guess, setGuess] = React.useState("")

  const [points, setPoints] = React.useState(
    savedGame ? savedGame.points : 0
  )

  const [strikes, setStrikes] = React.useState(
    savedGame ? savedGame.strikes : 0
  )

  const [passes, setPasses] = React.useState(
    savedGame ? savedGame.passes : MAX_PASSES
  )

  const [message, setMessage] = React.useState("")

  const [gameOver, setGameOver] = React.useState(false)


  React.useEffect(() => {

    const gameState = {
      remainingWords,
      currentWord,
      scrambled,
      points,
      strikes,
      passes
    }

    localStorage.setItem("scrambleGame", JSON.stringify(gameState))

  }, [remainingWords, currentWord, scrambled, points, strikes, passes])


  function nextWord(list) {

    if (list.length === 0) {
      setGameOver(true)
      return
    }

    const word = list[0]

    setCurrentWord(word)
    setScrambled(shuffle(word))

  }


  function handleGuess(e) {

    e.preventDefault()

    const userGuess = guess.toLowerCase()

    if (userGuess === currentWord) {

      setPoints(points + 1)

      const newList = remainingWords.slice(1)
      setRemainingWords(newList)

      nextWord(newList)

      setMessage("Correct!")

    } else {

      const newStrikes = strikes + 1
      setStrikes(newStrikes)

      setMessage("Incorrect!")

      if (newStrikes >= MAX_STRIKES) {
        setGameOver(true)
      }

    }

    setGuess("")
  }


  function passWord() {

    if (passes <= 0) return

    const newPasses = passes - 1
    setPasses(newPasses)

    const newList = remainingWords.slice(1)
    setRemainingWords(newList)

    nextWord(newList)

  }


  function restartGame() {

    const shuffled = shuffle(words)

    setRemainingWords(shuffled)
    setCurrentWord(shuffled[0])
    setScrambled(shuffle(shuffled[0]))

    setPoints(0)
    setStrikes(0)
    setPasses(MAX_PASSES)
    setGuess("")
    setMessage("")
    setGameOver(false)

    localStorage.removeItem("scrambleGame")

  }


  if (gameOver) {
    return (
      <div>
        <h1>Game Over</h1>
        <p>Points: {points}</p>
        <button onClick={restartGame}>Play Again</button>
      </div>
    )
  }


  return (

    <div>

      <h1>Scramble</h1>

      <h2>{scrambled}</h2>

      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button type="submit">Guess</button>
      </form>

      <button onClick={passWord}>Pass ({passes})</button>

      <p>{message}</p>

      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>

    </div>

  )

}


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)