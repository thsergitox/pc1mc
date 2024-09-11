import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import * as math from "mathjs"
import * as React from "react"
import { BlockMath } from 'react-katex'

const calculateHessian = (func: string, variables: string[], point: number[], h: number) => {
  const n = variables.length
  const hessian = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0))

  const compiledFunc = math.compile(func)

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const pointWithH = [...point]

      // Crear los puntos que necesitamos para la fórmula
      pointWithH[i] += h
      pointWithH[j] += h
      const f_xi_h_xj_h = compiledFunc.evaluate(
        Object.fromEntries(variables.map((v, index) => [v, pointWithH[index]]))
      )

      pointWithH[j] -= 2 * h
      const f_xi_h_xj_mh = compiledFunc.evaluate(
        Object.fromEntries(variables.map((v, index) => [v, pointWithH[index]]))
      )

      pointWithH[i] -= 2 * h
      const f_xi_mh_xj_mh = compiledFunc.evaluate(
        Object.fromEntries(variables.map((v, index) => [v, pointWithH[index]]))
      )

      pointWithH[j] += 2 * h
      const f_xi_mh_xj_h = compiledFunc.evaluate(
        Object.fromEntries(variables.map((v, index) => [v, pointWithH[index]]))
      )

      // Aplicar la fórmula para la segunda derivada
      hessian[i][j] =
        (f_xi_h_xj_h - f_xi_h_xj_mh - f_xi_mh_xj_h + f_xi_mh_xj_mh) / (4 * h * h)
    }
  }

  return hessian
}

export default function HessianCalculator({handle}: {handle: () => void}) {
  const hessianFormula = '\\frac{\\partial^2 f}{\\partial x_i \\partial x_j} \\approx \\frac{f(x_i+h, x_j+h) - f(x_i+h, x_j-h) - f(x_i-h, x_j+h) + f(x_i-h, x_j-h)}{4h^2}';
  const [func, setFunc] = React.useState<string>('')
  const [variables, setVariables] = React.useState<string[]>(['x', 'y']) // Por defecto dos variables
  const [point, setPoint] = React.useState<number[]>([0, 0]) // Punto predeterminado para evaluar
  const [hValue, setHValue] = React.useState<number>(0.01) // Valor predeterminado de h
  const [hessianMatrix, setHessianMatrix] = React.useState<number[][] | null>(null)

  const handleCalculateHessian = () => {
    if (!func) {
      alert('Por favor, ingrese una función.')
      return
    }

    try {
      const hessian = calculateHessian(func, variables, point, hValue)
      setHessianMatrix(hessian)
    } catch (error) {
      alert(`Error al calcular la Hessiana: ${error}`)
    }
  }

  return (
  
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex justify-between items-center space-x-4"> 
          <CardTitle className="text-2xl font-bold text-center">Calculadora de la <a onClick={handle}  className="cursor-pointer"> Hessiana</a></CardTitle>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
                Ingrese la función a evaluar
              </label>
              <Input
                id="function"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                placeholder="Ej: x^2 + y^2"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="variables" className="block text-sm font-medium text-gray-700 mb-1">
                Variables (separadas por comas)
              </label>
              <Input
                id="variables"
                value={variables.join(', ')}
                onChange={(e) => setVariables(e.target.value.split(',').map(v => v.trim()))}
                placeholder="Ej: x, y"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="point" className="block text-sm font-medium text-gray-700 mb-1">
                Punto para evaluar (separado por comas)
              </label>
              <Input
                id="point"
                value={point.join(', ')}
                onChange={(e) => setPoint(e.target.value.split(',').map(v => parseFloat(v.trim())))}
                placeholder="Ej: 1, 1"
                className="w-full"
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
            <Button onClick={handleCalculateHessian} className="w-full">Calcular Hessiana</Button>
          </div>



          



        <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Fórmula del Método en LaTeX:</h3>
              <Card className="p-4 min-h-[60px]">
                <BlockMath math={hessianFormula || 'N/A'} />
              </Card>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Derivada Exacta:</h3>
              {hessianMatrix && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Matriz Hessiana:</h3>
              <div className="grid grid-cols-1 gap-4">
                {hessianMatrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-3 gap-4">
                    {row.map((value, colIndex) => (
                      <Card key={colIndex} className="p-4">
                        <h4 className="text-sm font-medium mb-1">({rowIndex}, {colIndex})</h4>
                        <p>{value.toFixed(4)}</p>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
            
          </div>
        </CardContent>
      </Card>
    
  )
}
