import { useState, useCallback, useEffect } from 'react'
import ContactsPage from './ContactsPage'
import './App.css'

const catFacts = [
  "Cats sleep for about 70% of their lives.",
  "A group of cats is called a clowder.",
  "Cats have over 20 vocalizations, including the purr, meow, and chirp.",
  "A cat's hearing is much more sensitive than a human's or dog's.",
  "Cats can rotate their ears 180 degrees.",
  "A cat has 230 bones in its body — a human has 206.",
  "Cats can jump up to six times their length.",
  "A cat's purr vibrates at 25–150 Hz, a frequency that promotes healing.",
  "The oldest known pet cat was found in a 9,500-year-old grave on Cyprus.",
  "Cats spend about 30–50% of their day grooming themselves.",
  "A house cat can reach speeds of up to 30 mph over short distances.",
  "Cats have a specialized collarbone that allows them to always land on their feet.",
  "A cat's nose print is unique, much like a human's fingerprint.",
  "Cats can't taste sweetness due to a genetic mutation.",
  "The first cat in space was a French cat named Félicette in 1963.",
  "Cats have whiskers on the backs of their front legs as well as their faces.",
  "A cat's brain is 90% similar to a human's brain.",
  "Cats can see in light levels six times lower than what a human needs.",
  "The average cat has 12 whiskers on each side of its face.",
  "Cats use their tails for balance and to communicate their mood.",
  "A domestic cat's purr has been shown to lower stress and blood pressure in humans.",
  "Cats have three eyelids — the third is called a nictitating membrane.",
  "Ancient Egyptians would shave their eyebrows to mourn the death of a cat.",
  "Cats can make over 100 different sounds, while dogs can only make about 10.",
  "A cat's field of vision is about 200 degrees, compared to 180 degrees for humans.",
]

function getRandomFact(currentFact: string | null): string {
  if (catFacts.length <= 1) return catFacts[0]
  let next: string
  do {
    next = catFacts[Math.floor(Math.random() * catFacts.length)]
  } while (next === currentFact)
  return next
}

type Page = 'cat-facts' | 'contacts'

function getPageFromHash(): Page {
  return window.location.hash === '#contacts' ? 'contacts' : 'cat-facts'
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash)
  const [fact, setFact] = useState<string | null>(null)

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (target: Page) => {
    window.location.hash = target === 'contacts' ? '#contacts' : '#cat-facts'
  }

  const handleClick = useCallback(() => {
    setFact((prev) => getRandomFact(prev))
  }, [])

  return (
    <>
      <nav className="app-nav">
        <button
          className={`nav-link${page === 'cat-facts' ? ' nav-active' : ''}`}
          onClick={() => navigate('cat-facts')}
        >
          🐱 Cat Facts
        </button>
        <button
          className={`nav-link${page === 'contacts' ? ' nav-active' : ''}`}
          onClick={() => navigate('contacts')}
        >
          📇 Contacts
        </button>
      </nav>

      {page === 'contacts' ? (
        <ContactsPage />
      ) : (
        <div className="app">
          <div className="cat-emoji" aria-hidden="true">🐱</div>
          <h1>Random Cat Facts</h1>
          <p className="subtitle">Click the button to learn something about cats!</p>

          <div className="fact-card" aria-live="polite">
            {fact ? (
              <p className="fact-text">{fact}</p>
            ) : (
              <p className="fact-placeholder">Your cat fact will appear here…</p>
            )}
          </div>

          <button className="fact-button" onClick={handleClick}>
            {fact ? 'Another Fact! 🐾' : 'Get a Cat Fact 🐾'}
          </button>
        </div>
      )}
    </>
  )
}

export default App
