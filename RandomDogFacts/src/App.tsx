import { useState } from 'react'
import './App.css'

const dogFacts: string[] = [
  "Dogs have a sense of time and can tell how long you've been gone.",
  "A dog's nose print is unique, much like a human fingerprint.",
  "Dogs can learn more than 1,000 words.",
  "Dalmatians are born completely white and develop their spots as they grow.",
  "A Greyhound can beat a Cheetah in a long-distance race.",
  "Dogs curl up in a ball when sleeping to protect their organs — a holdover from their wild days.",
  "The Basenji is the only breed of dog that can't bark, but they can yodel!",
  "A dog's sense of smell is 10,000 to 100,000 times more acute than a human's.",
  "Three dogs survived the sinking of the Titanic — two Pomeranians and one Pekingese.",
  "Dogs have three eyelids: an upper lid, a lower lid, and a third lid called a nictitating membrane.",
  "The tallest dog ever was a Great Dane named Zeus who stood 44 inches tall.",
  "Dogs can see in color, but their range is more limited compared to humans.",
  "A one-year-old dog is as physically mature as a 15-year-old human.",
  "Dogs' ears are controlled by at least 18 muscles.",
  "When dogs kick after going to the bathroom, they are using scent glands on their paws to further mark their territory.",
  "Puppies are born deaf and don't begin to hear until they are about 21 days old.",
  "The Norwegian Lundehund is the only dog breed with six toes on each foot.",
  "Dogs can smell your feelings — they can detect fear, sadness, and other emotions through chemical changes in your body.",
  "The average dog can run about 19 mph at full speed.",
  "Dogs dream just like humans and go through similar sleep stages including REM sleep.",
]

function getRandomFact(currentFact: string | null): string {
  if (dogFacts.length <= 1) return dogFacts[0]
  let fact: string
  do {
    fact = dogFacts[Math.floor(Math.random() * dogFacts.length)]
  } while (fact === currentFact)
  return fact
}

function App() {
  const [fact, setFact] = useState<string | null>(null)

  return (
    <div className="app">
      <h1>🐶 Random Dog Facts</h1>
      <button onClick={() => setFact(getRandomFact(fact))}>
        {fact === null ? 'Get a Dog Fact!' : 'Another One!'}
      </button>
      {fact && <p className="fact">{fact}</p>}
    </div>
  )
}

export default App
