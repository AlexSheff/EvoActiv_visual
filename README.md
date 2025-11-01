# EvoActiv - Evolutionary Activation Function Discovery

**EvoActiv** is an interactive web-based framework for discovering neural network activation functions using evolutionary algorithms. This simulation visualizes the process of generating, evaluating, and evolving mathematical formulas to find high-performing candidates.

The entire simulation runs client-side in your browser. **No API key or external services are required.**

## 🚀 Features

- **Interactive Simulation**: Watch evolution unfold in real-time as new activation functions are discovered.
- **Dynamic Visualization**: View the entire population of formulas in each generation, with clear performance metrics.
- **Tunable Parameters**: Adjust core evolutionary parameters like population size, mutation rate, crossover rate, and elitism to see how they affect the outcome.
- **In-depth Analysis**: Track the simulation's progress with charts that show performance over generations and analyze the trade-offs between accuracy and complexity.
- **Dataset Simulation**: Upload a custom dataset (by name) to see how it influences the discovery process.
- **Client-Side**: Runs entirely in the browser with no backend or API dependencies.

## ⚙️ How It Works

The goal is to discover non-trivial functions that combine mathematical operators (like `sin`, `cos`), trainable parameters (`a`, `b`, `c`), and the mandatory input variable `x`. The process mimics natural selection:

1.  **Initialization**: A random population of mathematical formulas is generated based on the configured complexity.
2.  **Evaluation**: Each formula is evaluated and assigned a fitness `score`. This score is a mock value that prioritizes high accuracy while penalizing high loss and complexity. Invalid formulas (e.g., those without the input `x`) are heavily penalized.
3.  **Selection**: Formulas are selected for reproduction using a "tournament selection" method, where better-scoring individuals are more likely to be chosen.
4.  **Reproduction**: New formulas (offspring) are created from the selected parents using two primary operators:
    -   **Crossover**: Two parent formulas swap sub-expressions to create a new child.
    -   **Mutation**: A formula is randomly altered by changing a function, variable, or parameter.
5.  **Elitism**: A small number of the best-performing formulas from the current generation are carried over directly to the next, ensuring that good solutions are not lost.
6.  **Repeat**: This cycle repeats for the configured number of generations, gradually improving the overall fitness of the population.

## 💻 Usage

Simply open the application in your web browser.

-   Use the **Configuration** panel on the left to set up your simulation parameters.
-   Press the **Play** button to start the simulation.
-   Observe the population evolving in the **Current Population** view.
-   Analyze trends and discover the best-performing functions in the **Results & Analysis** dashboard.
-   Use the **Pause** and **Reset** controls to manage the simulation flow.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **Charting**: Recharts

---

*This project is for demonstration and educational purposes.*
