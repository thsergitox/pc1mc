import numpy as np
import matplotlib.pyplot as plt

# Definir la función objetivo y su gradiente
def func(x):
    return (x[0] - 1)**2 + 2 * (x[1] - 2)**2

def grad(x):
    dfdx = 2 * (x[0] - 1)
    dfdy = 4 * (x[1] - 2)
    return np.array([dfdx, dfdy])

# Parámetros del algoritmo RMSProp
alpha = 0.1      # Tasa de aprendizaje inicial
rho = 0.9        # Factor de decaimiento
epsilon = 1e-8   # Término para estabilidad numérica
max_iters = 100  # Número máximo de iteraciones

# Inicializar variables
x = np.array([5.0, 5.0])  # Punto inicial
s = np.zeros(2)         # Promedio móvil de gradientes al cuadrado
path = [x.copy()]         # Almacenar la trayectoria

# Algoritmo RMSProp
for i in range(max_iters):

    g = grad(x)
    s = rho * s + (1 - rho) * g**2
    x -= (alpha / (np.sqrt(s) + epsilon)) * g
    print(f'Iteración {i + 1}: x = {x}, f(x) = {func(x)}, ||g|| = {np.linalg.norm(g)}, s = {s}')
    path.append(x.copy())

# Convertir la trayectoria a un arreglo para facilitar el plot
path = np.array(path)

# Generar el gráfico
# Crear una cuadrícula de puntos
x_vals = np.linspace(-1, 6, 400)
y_vals = np.linspace(-1, 6, 400)
X, Y = np.meshgrid(x_vals, y_vals)
Z = (X - 1)**2 + 2 * (Y - 2)**2

# Configurar el gráfico
plt.figure(figsize=(8, 6))
# Dibujar las curvas de nivel
contours = plt.contour(X, Y, Z, levels=30, cmap='viridis')
plt.clabel(contours, inline=True, fontsize=8)
# Dibujar la trayectoria
plt.plot(path[:, 0], path[:, 1], 'ro-', markersize=4, linewidth=1, label='Trayectoria RMSProp')
# Marcar el punto inicial y final
plt.plot(path[0, 0], path[0, 1], 'go', markersize=8, label='Inicio')
plt.plot(path[-1, 0], path[-1, 1], 'bo', markersize=8, label='Fin')
# Etiquetas y título
plt.title('Descenso mediante RMSProp')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.show()
