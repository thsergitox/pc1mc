import numpy as np
import matplotlib.pyplot as plt

# Definir el intervalo y paso
t = np.arange(-2, 4, 0.1)
dt = 0.1

# Definir la función f(t) = sin(t) y la derivada exacta df/dt = cos(t)
f = np.sin(t)
dfdt_exact = np.cos(t)

# Esquema de diferencias hacia adelante (forward difference)
dfdtF = (np.sin(t + dt) - np.sin(t)) / dt

# Esquema de diferencias hacia atrás (backward difference)
dfdtB = (np.sin(t) - np.sin(t - dt)) / dt

# Esquema de diferencias centradas (central difference)
dfdtC = (np.sin(t + dt) - np.sin(t - dt)) / (2 * dt)

# Plotear la función original y su derivada exacta
plt.plot(t, f, 'k--', linewidth=1.2, label='Function (sin(t))')
plt.plot(t, dfdt_exact, 'k', linewidth=3, label='Exact Derivative (cos(t))')

# Plotear las derivadas aproximadas (Forward, Backward, Central)
plt.plot(t, dfdtF, 'b', linewidth=1.2, label='Forward Difference')
plt.plot(t, dfdtB, 'g', linewidth=1.2, label='Backward Difference')
plt.plot(t, dfdtC, 'r', linewidth=1.2, label='Central Difference')

# Añadir leyenda y mostrar el gráfico
plt.legend(loc='upper right')
plt.grid(True)
plt.title("Comparison of Numerical Derivatives (Forward, Backward, Central)")
plt.xlabel("t")
plt.ylabel("df/dt")
plt.show()
