import * as React from "react"
import './App.css'
import Calculator from './pages/Calculator'
import HessianCalculator from './pages/HessianCalculator'

function App() {
  const options = { derivadas: 'Derivadas', hessiana: 'Hessiana' }
  const [type, setType] = React.useState<string>(options.derivadas)

  const first = type === options.derivadas
  const comparator = first ? options.hessiana : options.derivadas
  
  const handleClick = () => {
    setType(comparator)
  }

  return (
    <>    
    <div className="bg-gray-600">
      {
        first ? <Calculator handle={handleClick}/> : <HessianCalculator handle={handleClick}/>
      }
    </div>
    </>
  )
}

export default App
