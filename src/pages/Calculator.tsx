import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import 'katex/dist/katex.min.css'
import { Check, ChevronsUpDown } from "lucide-react"
import * as math from "mathjs"
import * as React from "react"
import { BlockMath } from 'react-katex'
import Props from '../types/Props'

const methods = [
  { value: 'backward', label: 'Método de Backward', latex: '\\frac{f(x) - f(x-h)}{h}' },
  { value: 'forward', label: 'Método de Forward', latex: '\\frac{f(x+h) - f(x)}{h}' },
  { value: 'central', label: 'Método Central', latex: '\\frac{f(x+h) - f(x-h)}{2h}' },
]

// Cálculo simbólico de la derivada con math.js
const calculateExactDerivative = (func: string, variable: string) => {
  try {
    const derivative = math.derivative(func, variable)
    return derivative.toString() // Devuelve la derivada simbólica en formato de texto
  } catch (error) {
    return `Error al calcular la derivada exacta${error}`
  }
}

const calculateExactNumber = (func: string, variable: string, xVal: number) => {
  try {
    const derivative = math.derivative(func, variable)
    const number = derivative.evaluate({ x: xVal })
    return number // Devuelve el resultado de la derivada en un número
  } catch (error) {
    return `Error al calcular la derivada exacta${error}`
  }
}

// Métodos numéricos: Diferencias finitas (forward, backward, central)
const calculateNumericalDerivative = (func: string, method: string, xValue: number, h: number) => {
  const compiledFunc = math.compile(func)

  switch (method) {
    case 'backward':
      return (compiledFunc.evaluate({ x: xValue }) - compiledFunc.evaluate({ x: xValue - h })) / h
    case 'forward':
      return (compiledFunc.evaluate({ x: xValue + h }) - compiledFunc.evaluate({ x: xValue })) / h
    case 'central':
      return (compiledFunc.evaluate({ x: xValue + h }) - compiledFunc.evaluate({ x: xValue - h })) / (2 * h)
    default:
      return 'Método desconocido'
  }
}


const calculateValueError = (exact: number, numerical: number) => {
  return (exact - numerical)
}

const Calculator: React.FC<Props> = ({ handle, options }) => {
  const [func, setFunc] = React.useState<string>('')
  const [method, setMethod] = React.useState<string>("")
  const [exactDerivative, setExactDerivative] = React.useState<string>('')
  const [exactDerivativeNumer, setExactDerivativeNumber] = React.useState<number>(0)
  const [numericalDerivative, setNumericalDerivative] = React.useState<string>('')
  const [formula, setFormula] = React.useState<string>('')
  const [latexFormula, setLatexFormula] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const [xValue, setXValue] = React.useState<number>(1) // Valor predeterminado para x
  const [hValue, setHValue] = React.useState<number>(0.01) // Paso h pequeño para diferencias finitas
  const [open, setOpen] = React.useState<boolean>(false)
  const [errorValue, setErrorValue] = React.useState<number>(0)

  const handleMethodSelect = (value: string) => {
    setMethod(value === method ? "" : value)
    setFormula(methods.find(m => m.value === value)?.label || '')
    setOpen(false)
    setLatexFormula(methods.find(m => m.value === value)?.latex || '') 
  }

  const handleCalculate = () => {
    if (!func) {
      setError('Por favor, ingrese una función.')
      return
    }
    if (!method) {
      setError('Por favor, seleccione un método.')
      return
    }
    setError('')

    // Cálculo de la derivada exacta
    const exact = calculateExactDerivative(func, 'x')
    setExactDerivative(exact)
    
    const exactNumber = calculateExactNumber(func, 'x', xValue)
    setExactDerivativeNumber(exactNumber)

    // Cálculo de la derivada numérica
    const numerical = calculateNumericalDerivative(func, method, xValue, hValue)
    setNumericalDerivative(numerical.toString())

    const errorValue = calculateValueError(exactNumber, Number(numerical))
    setErrorValue(errorValue)
  }

  return (
    
      <Card className="w-full max-w-6xl mx-auto">
        
        <CardHeader className="flex justify-between items-center space-x-4">
          <CardTitle className="text-2xl font-bold ">Calculadora de <a onClick={() => handle(options.hessiana)}  className="cursor-pointer">Derivadas</a></CardTitle>
        
        
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
                Ingrese la función a evaluar
              </label>
              <Input
                id="function"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                placeholder="Ej: x^2 + 2x + 1"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                Seleccione el método a usar
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {method
                      ? methods.find((m) => m.value === method)?.label
                      : "Seleccione un método"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar método..." />
                    <CommandList>
                      <CommandEmpty>No se encontró ningún método.</CommandEmpty>
                      <CommandGroup>
                        {methods.map((m) => (
                          <CommandItem
                            key={m.value}
                            value={m.value}
                            onSelect={(currentValue) => handleMethodSelect(currentValue)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                method === m.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {m.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label htmlFor="xValue" className="block text-sm font-medium text-gray-700 mb-1">
                Valor de x
              </label>
              <Input
                id="xValue"
                value={xValue}
                onChange={(e) => setXValue(parseFloat(e.target.value))}
                placeholder="Ej: 1"
                className="w-full"
                type="number"
              />
            </div>
            <div>
              <label htmlFor="hValue" className="block text-sm font-medium text-gray-700 mb-1">
                Valor de h (paso)
              </label>
              <Input
                id="hValue"
                value={hValue}
                onChange={(e) => setHValue(parseFloat(e.target.value))}
                placeholder="Ej: 0.01"
                className="w-full"
                type="number"
              />
            </div>
            <Button onClick={handleCalculate} className="w-full">Calcular</Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Fórmula del Método en LaTeX:</h3>
              <Card className="p-4 min-h-[60px]">
                <BlockMath math={latexFormula || 'N/A'} />
              </Card>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Derivada Exacta:</h3>
              <Card className="p-4 min-h-[60px]">{exactDerivative ? `${exactDerivative} = ${exactDerivativeNumer}` : 'N/A'}</Card>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Derivada Numérica ({formula}):</h3>
              <Card className="p-4 min-h-[60px]">{numericalDerivative || 'N/A'}</Card>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Diferencia:</h3>
              <Card className="p-4 min-h-[60px]">{errorValue ? `${errorValue}` : 'N/A'}</Card>
            </div>
          </div>
        </CardContent>
      </Card>
    
  )
}

export default Calculator