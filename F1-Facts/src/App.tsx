import { useState } from 'react'
import './App.css'

const f1Facts: string[] = [
  "The first ever Formula 1 World Championship race was held at Silverstone, UK on May 13, 1950.",
  "Michael Schumacher and Lewis Hamilton share the record for most World Drivers' Championships with 7 titles each.",
  "An F1 car can accelerate from 0 to 100 mph and decelerate back to 0 in under 5 seconds.",
  "F1 cars generate enough downforce to theoretically drive upside down on the ceiling of a tunnel at speeds above 130 mph.",
  "During a race, an F1 driver can lose up to 3 kg (6.6 lbs) of body weight due to dehydration.",
  "The steering wheel of a modern F1 car can cost over $50,000 and has more than 20 buttons and switches.",
  "F1 pit crews can change all four tires in under 2 seconds — the record is 1.80 seconds set by Red Bull Racing in 2019.",
  "F1 engines rev up to around 15,000 RPM and produce approximately 1,000 horsepower from a 1.6-litre V6 turbo-hybrid.",
  "The brakes on an F1 car can reach temperatures of over 1,000°C (1,832°F) during heavy braking.",
  "Ayrton Senna holds the record for most pole positions at the Monaco Grand Prix with 5.",
  "F1 cars have over 300 sensors that transmit roughly 1.5 GB of telemetry data back to the team during a race.",
  "The Monaco Grand Prix has been held since 1929, making it one of the oldest motor races in the world.",
  "An F1 car's exhaust gases exit at approximately 950°C (1,742°F).",
  "Lewis Hamilton holds the record for the most race wins in F1 history with over 100 victories.",
  "The DRS (Drag Reduction System) was introduced in 2011 to promote overtaking by reducing aerodynamic drag.",
  "F1 tires are filled with nitrogen instead of regular air for more consistent pressure under extreme heat.",
  "Juan Manuel Fangio won 5 World Championships in the 1950s, a record that stood for 46 years.",
  "The longest F1 circuit ever used was the Pescara Circuit in Italy at 25.8 km (16 miles) long.",
  "F1 drivers experience up to 6G of lateral force when cornering at high speed.",
  "The halo safety device, introduced in 2018, can withstand the weight of a London double-decker bus.",
  "Ferrari is the only team to have competed in every single season of the F1 World Championship since 1950.",
  "The shortest F1 race ever was the 2021 Belgian Grand Prix, lasting only 3 laps behind a safety car due to heavy rain.",
  "F1 cars produce around 4 times their own weight in downforce at top speed.",
  "Max Verstappen became the youngest ever F1 race winner at 18 years old at the 2016 Spanish Grand Prix.",
  "A Formula 1 car is made up of approximately 14,500 individual components.",
]

function getRandomFact(currentFact: string | null): string {
  let fact: string
  do {
    fact = f1Facts[Math.floor(Math.random() * f1Facts.length)]
  } while (fact === currentFact && f1Facts.length > 1)
  return fact
}

function App() {
  const [fact, setFact] = useState<string | null>(null)

  return (
    <div className="app">
      <h1>🏎️ F1 Facts</h1>
      <button className="fact-button" onClick={() => setFact(getRandomFact(fact))}>
        {fact ? 'Another Fact!' : 'Show me an F1 Fact!'}
      </button>
      {fact && (
        <div className="fact-card">
          <p>{fact}</p>
        </div>
      )}
    </div>
  )
}

export default App
