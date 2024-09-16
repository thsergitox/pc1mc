import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import * as math from "mathjs"
import * as React from "react"
import { BlockMath } from 'react-katex'
import Plot from 'react-plotly.js'
import Props from '../types/Props'

const Quadratic: React.FC<Props> = ({ handle, options }) => {
  const fxFormula = `x^* = \\frac{1}{2} \\cdot \\frac{y_a(b^2 - c^2) + y_b(c^2 - a^2) + y_c(a^2 - b^2)}{y_a(b - c) + y_b(c - a) + y_c(a - b)}`;
  
  const [a, setA] = React.useState<number>(0) // Punto a inicial
  const [b, setB] = React.useState<number>(0) // Punto b inicial
  const [c, setC] = React.useState<number>(0) // Punto c inicial
  const [func, setFunc] = React.useState<string>('') // Función
  const [iterations, setIterations] = React.useState<number>(5) // Número de iteraciones
  const [iterationIndex, setIterationIndex] = React.useState<number>(0) // Índice de la iteración
  const [results, setResults] = React.useState<{ a: number, b: number, c: number, x: number}[]>([]) // Resultados por iteración

  // Evaluar la función
  const evaluateFunc = (x: number) => {
    try {
      const compiledFunc = math.compile(func)
      return compiledFunc.evaluate({ x })
    } catch (error) {
      console.error("Error evaluando la función:", error)
      return NaN
    }
  }

  // Implementación del algoritmo Quadratic Fit Search
  const quadraticFitSearch = (f: (x: number) => number, a: number, b: number, c: number, n: number) => {
    let ya = evaluateFunc(a);
    let yb = evaluateFunc(b);
    let yc = evaluateFunc(c);
    const iterationsData = [];
    iterationsData.push({ a, b, c, x: 0 });

    for (let i = 0; i < n; i++) {
      const x = 0.5 * ((ya * (b ** 2 - c ** 2)) + (yb * (c ** 2 - a ** 2)) + (yc * (a ** 2 - b ** 2))) /
                ((ya * (b - c)) + (yb * (c - a)) + (yc * (a - b)));
      
      const yx = evaluateFunc(x);

      if (x > b) {
        if (yx > yb) {
          c = x;
          yc = yx;
        } else {
          a = b;
          ya = yb;
          b = x;
          yb = yx;
        }
      } else if (x < b) {
        if (yx > yb) {
          a = x;
          ya = yx;
        } else {
          c = b;
          yc = yb;
          b = x;
          yb = yx;
        }
      }

      iterationsData.push({ a, b, c, x});
    }

    return iterationsData;
  }

  // Manejar el clic del botón para ejecutar el algoritmo
  const handleCalculate = () => {
    if (func && !isNaN(a) && !isNaN(b) && !isNaN(c) && iterations > 0) {
      setResults([])
      const data = quadraticFitSearch(evaluateFunc, a, b, c, iterations);
      setResults(data); // Guardar todas las iteraciones
      setIterationIndex(0); // Iniciar con la primera iteración
    } else {
      console.error("Por favor, ingrese valores válidos para la función, los puntos a, b, c y el número de iteraciones.");
    }
  }

  // Graficar la función original
  const generatePlotData = () => {
    const xValues = [];
    const yValues = [];
    
    for (let x = -10; x <= 10; x += 0.1) {
      xValues.push(x);
      yValues.push(evaluateFunc(x));
    }

    return {
      x: xValues,
      y: yValues
    };
  }

  // Mostrar la función cuadrática resultante en el gráfico
  const plotQuadraticIteration = (a: number, b: number, c: number) => {
    const xValues = []
    const yValues = []
    const ya = evaluateFunc(a)
    const yb = evaluateFunc(b)
    const yc = evaluateFunc(c)
    
    for (let x = a - 5; x <= c + 5; x += 0.1) {
      const quadY = ya * ((x - b) * (x - c)) / ((a - b) * (a - c)) + yb * ((x - a) * (x - c)) / ((b - a) * (b - c)) + yc * ((x - a) * (x - b)) / ((c - a) * (c - b))

      xValues.push(x);
      yValues.push(quadY);
    }

    return {
      x: xValues,
      y: yValues
    };
  }

  // Iterar en el gráfico para ver los cambios en cada iteración
  const handleIterate = () => {
    if (results && iterationIndex < iterations - 1) {
      setIterationIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex justify-between items-center space-x-4">
        <CardTitle className="text-2xl font-bold text-center">Bracketing: <a onClick={() => handle(options.derivadas)} className="cursor-pointer"> Quadratic Fit Search</a></CardTitle>
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
            <label htmlFor="a" className="block text-sm font-medium text-gray-700 mb-1">
              Valor inicial de a
            </label>
            <Input
              id="a"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              placeholder="Ej: 0"
              className="w-full"
              type="number"
            />
          </div>
          <div>
            <label htmlFor="b" className="block text-sm font-medium text-gray-700 mb-1">
              Valor inicial de b
            </label>
            <Input
              id="b"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              placeholder="Ej: 1"
              className="w-full"
              type="number"
            />
          </div>
          <div>
            <label htmlFor="c" className="block text-sm font-medium text-gray-700 mb-1">
              Valor inicial de c
            </label>
            <Input
              id="c"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              placeholder="Ej: 2"
              className="w-full"
              type="number"
            />
          </div>
          <div>
            <label htmlFor="iterations" className="block text-sm font-medium text-gray-700 mb-1">
              Número de iteraciones
            </label>
            <Input
              id="iterations"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              placeholder="Ej: 5"
              className="w-full"
              type="number"
            />
          </div>
          <button onClick={handleCalculate} className="bg-blue-500 text-white p-2 mt-4 rounded">
            Ejecutar Quadratic Fit Search
          </button>
          <button onClick={handleIterate} className="bg-green-500 text-white p-2 mt-4 rounded">
            Mostrar Iteración Cuadrática
          </button>

          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Resultados:</h3>
              <Card className="p-4">
                <p><strong>a:</strong> {results[iterationIndex]?.a}</p>
                <p><strong>b:</strong> {results[iterationIndex]?.b}</p>
                <p><strong>c:</strong> {results[iterationIndex]?.c}</p>
                <p><strong>x_min:</strong> {results[iterationIndex]?.x}</p>
              </Card>
            </div>
          )}
        </div>

        {/* Parte derecha con la fórmula y el gráfico */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Card className="p-4 min-h-[60px]">
              <BlockMath math={fxFormula || 'N/A'} />
            </Card>
          </div>

          {/* Graficar la función */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Gráfico de la función:</h3>
            <Plot
              data={[
                {
                  x: generatePlotData().x,
                  y: generatePlotData().y,
                  type: 'scatter',
                  mode: 'lines',
                  marker: { color: 'blue' },
                  name: 'Función Original'
                },
                {
                  x: plotQuadraticIteration(results[iterationIndex]?.a, results[iterationIndex]?.b, results[iterationIndex]?.c).x,
                  y: plotQuadraticIteration(results[iterationIndex]?.a, results[iterationIndex]?.b, results[iterationIndex]?.c).y,
                  type: 'scatter',
                  mode: 'lines',
                  marker: { color: 'red' },
                  name: 'Función Cuadrática'
                },
                {
                  x: [results[iterationIndex]?.a, results[iterationIndex]?.b, results[iterationIndex]?.c],
                  y: [evaluateFunc(results[iterationIndex]?.a), evaluateFunc(results[iterationIndex]?.b), evaluateFunc(results[iterationIndex]?.c)],
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'black', size: 10 },
                  name: 'Puntos a, b, c'
                }
              ]}
              layout={{
                title: `Iteración ${iterationIndex + 1}`,
                width: 800,  // Aumentamos el tamaño del gráfico
                height: 600   // Aumentamos la altura del gráfico
              }}
              className="w-full h-full"
            />
          </div>

          
        </div>
      </CardContent>
    </Card>
  )
}

export default Quadratic;
