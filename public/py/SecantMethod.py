def secant_method(f, x0, x1, tol=1e-6, max_iters=100):
   
    n = 0
    history = [x0, x1]
    while n < max_iters:
        f_x0 = f(x0)
        f_x1 = f(x1)
        if f_x1 - f_x0 == 0:
            print("División por cero en la iteración", n)
            break
        # Fórmula de actualización del método de la secante
        x2 = x1 - f_x1 * (x1 - x0) / (f_x1 - f_x0)
        history.append(x2)
        print(f"x{n+1} = {x2} y{n} = {f(x2)}")
        # Verificar el criterio de convergencia
        if abs(f(x2)) < tol:
            return x2, n+1, history
        # Preparar para la siguiente iteración
        x0, x1 = x1, x2
        n += 1
        
    print("No se alcanzó la convergencia después de", max_iters, "iteraciones.")
    return x1, n, history
    
    
import numpy as np
import matplotlib.pyplot as plt

# Definir la función
def f(x):
    return x**3 - 2*x - 2
    
def fder(x):
    return 3*x**2 - 2

# Aproximaciones iniciales
x0 = 1.0
x1 = 2.0

# Ejecutar el método de la secante
root, iterations, history = secant_method(fder, x0, x1)
print(f"La raíz aproximada para la derivada es x = {root} después de {iterations} iteraciones.")
print(f"Por lo que el mínimo calculado es: {f(root)}")
# Graficar la función y las aproximaciones
x_vals = np.linspace(-1, 2.5, 400)
# x_vals = np.linspace(0.8, 2, 400)
y_vals = f(x_vals)

plt.figure(figsize=(8, 6))

# Graficamos la derivada
yd_vals = fder(x_vals)
plt.plot(x_vals, yd_vals, label='fprim(x) = 3x²-2')
plt.plot(history, [fder(x) for x in history], 'ro-')

# Graficamos la función
plt.plot(x_vals, y_vals, label='f(x) = x³ - 2x - 2')
plt.axhline(0, color='black', linewidth=0.5)
plt.plot(history, [f(x) for x in history], 'ro-', label='Aproximaciones')

# Finish
plt.xlabel('x')
plt.ylabel('y')
plt.title('Método de la Secante')
plt.legend()
plt.grid(True)
plt.show()



