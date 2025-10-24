# Pipeline Simulator  
**Interactive CPU Pipeline Simulator & Visualizer**

[Visit the live demo →](https://pipeline-simulator-coral.vercel.app)

## Table of Contents  
- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Acknowledgements](#acknowledgements)  

## Overview  
Pipeline Simulator provides an interactive web-based environment to visualize and experiment with CPU instruction pipelines, hazards, forwarding, stalls, and more. It is especially useful for students learning computer architecture and pipeline design.

Using this tool, you can:  
- Configure the pipeline depth and stages  
- Insert instructions and monitor their flow through the pipeline  
- Visualize hazards (data, control, structural) and how they affect throughput  
- Understand techniques like forwarding/ bypassing and pipeline stalls  
- Analyze performance (cycles, instructions completed, CPI)  

## Features  
- Live, step-by-step visualization of instructions moving through pipeline stages.  
- Hazard detection and highlighting.  
- Forwarding (bypass) logic simulation.  
- Pipeline stalls and bubbles simulation.  
- Performance metrics: cycle count, instruction count, CPI.  
- Intuitive UI: drag-and-drop instructions, configurable pipeline parameters.  
- Export/loading of instruction sequences (if supported).  
- Responsive layout: works on desktop and tablets.


## Tech Stack  
- Frontend: React.js, Typescript, Vite (hooks, functional components)  
- UI/Visualization: CSS, SVG/Canvas, or relevant library   
- Backend: None / Static hosting (Vercel)  
- Build & deployment: Vite or Create React App, deployed to Vercel  

## Getting Started  
### Prerequisites  
- Node.js (v16 or later)  
- npm or yarn  

### Installation  
```bash
git clone https://github.com/your-username/pipeline-simulator.git
cd pipeline-simulator
npm install    # or yarn install