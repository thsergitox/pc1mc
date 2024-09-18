import * as React from "react"
import './App.css'
import Calculator from './pages/Calculator'
import HessianCalculator from './pages/HessianCalculator'
import Quadratic from "./pages/Quadratic"

function App() {
  const options = { derivadas: 'Derivadas', hessiana: 'Hessiana', bracketing: 'Quadratic Fit Search' }
  const [type, setType] = React.useState<string>(options.derivadas)
  
  const handleClick = (typeValue: string) => {
    setType(typeValue)
  }

  return (
    <>    
    <div className="bg-white">
      {
      type === options.derivadas ? (
        <Calculator handle={handleClick} options={options}/>
      ) : type === options.hessiana ? (
        <HessianCalculator handle={handleClick} options={options} />
      ) : type === options.bracketing ? (
        <div>
          <Quadratic handle={handleClick} options={options} />
        </div>
      ) : (
        <div>
          <h1>Not implemented yet</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          </button>
        </div>
      )
      }
    </div>
    </>
  )
}

export default App
