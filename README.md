# QuantumPlayground 🌌

> *An immersive quantum computing playground that bridges the gap between theoretical quantum mechanics and hands-on experimentation*

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
[![IBM Quantum](https://img.shields.io/badge/IBM%20Quantum-Integrated-purple?logo=ibm)](https://quantum-computing.ibm.com)
[![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-3D%20Graphics-orange)](https://docs.pmnd.rs/react-three-fiber)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.9-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

An interactive quantum circuit simulator with IBM Quantum integration, featuring a cosmic dark theme, real-time 3D Bloch sphere visualization, and comprehensive educational content for quantum computing enthusiasts.

## 🌟 Features

- 🔬 **Interactive Circuit Builder**: Drag-and-drop quantum gates to build circuits
- ⚛️ **3D Bloch Sphere Visualization**: Real-time quantum state visualization with React Three Fiber
- � **IBM Quantum Integration**: Execute circuits on real quantum computers
- 📚 **Educational Content**: Comprehensive quantum computing learning materials
- 🎯 **Real-time Simulation**: Local quantum circuit simulation
- 📊 **Results Visualization**: Interactive charts and analytics
- 🌌 **Dark Universe Theme**: Cosmic colors with glass morphism effects
- 🌐 **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure IBM Quantum API

1. Get your IBM Quantum API token from [IBM Quantum](https://quantum-computing.ibm.com/)
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Edit `.env.local` and add your actual API token:
   ```
   IBM_QUANTUM_API_TOKEN=your_actual_api_token_here
   IBM_QUANTUM_CHANNEL=ibm_quantum
   IBM_QUANTUM_HUB_GROUP_PROJECT=ibm-q/open/main
   ```

### 3. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

### Building Quantum Circuits

1. **Add Gates**: Drag quantum gates from the toolbar to the circuit canvas
2. **Configure Gates**: Click on gates to adjust parameters (rotation angles, etc.)
3. **Interactive Visualization**: Watch the Bloch sphere update in real-time as you build your circuit

### Running on IBM Quantum

1. **Open IBM Quantum Panel**: Click "Run on IBM Quantum" button
2. **Select Backend**: Choose from available quantum processors or simulators
3. **Configure Job**: Set number of shots (measurements)
4. **Submit**: Click "Submit Job" to run on real quantum hardware
5. **Monitor Progress**: Track job status in the Jobs tab
6. **Download Results**: Get measurement results when job completes

### Backend Features

- **Real-time Backend Status**: See which quantum computers are online
- **Queue Information**: View pending jobs for each backend
- **Automatic Refresh**: Job status updates every 5 seconds
- **Fallback Simulation**: Local simulation if IBM API is unavailable

## Architecture

### Frontend Components

- `components/bloch-sphere.tsx` - Interactive 3D Bloch sphere visualization
- `components/quantum-backend-panel.tsx` - IBM Quantum integration UI
- `components/particle-background.tsx` - Cosmic particle animation
- `app/page.tsx` - Main quantum circuit builder interface

### Backend API

- `app/api/quantum/backends/route.ts` - Fetch available quantum backends
- `app/api/quantum/jobs/route.ts` - Submit, monitor, and cancel quantum jobs
- `lib/server/ibm-quantum-server.ts` - Server-side IBM Quantum integration

### Styling

- `app/globals.css` - Dark universe theme with cosmic colors
- Custom CSS variables for OKLCH color space
- Glass morphism effects and futuristic animations

## Technologies

- **Framework**: Next.js 15.2.4 with TypeScript
- **3D Graphics**: React Three Fiber for Bloch sphere
- **Styling**: Tailwind CSS v4.1.9 with custom theme
- **UI Components**: Radix UI primitives
- **Quantum Integration**: IBM Quantum Runtime API
- **Fonts**: Google Fonts (Orbitron, Exo 2, Share Tech Mono)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `IBM_QUANTUM_API_TOKEN` | Your IBM Quantum API token | Required |
| `IBM_QUANTUM_CHANNEL` | IBM Quantum channel | `ibm_quantum` |
| `IBM_QUANTUM_HUB_GROUP_PROJECT` | IBM hub/group/project | `ibm-q/open/main` |

## Development

### File Structure

```
app/
├── api/quantum/          # Backend API routes
├── globals.css          # Cosmic theme styles
├── layout.tsx           # Root layout
└── page.tsx             # Main interface

components/
├── ui/                  # Reusable UI components
├── bloch-sphere.tsx     # 3D quantum visualization
├── particle-background.tsx  # Cosmic animation
└── quantum-backend-panel.tsx  # IBM integration

lib/
├── server/
│   └── ibm-quantum-server.ts  # Server-side IBM service
└── utils.ts             # Utility functions
```

### Adding New Quantum Gates

1. Update the gate definitions in `quantum-simulator.ts`
2. Add gate rendering logic in the circuit builder
3. Update Qiskit code generation in `ibm-quantum-server.ts`

### Customizing the Theme

- Modify CSS variables in `globals.css`
- Adjust color values in Tailwind config
- Update glass morphism effects with backdrop-filter

## Troubleshooting

### API Token Issues

- Verify your IBM Quantum API token is valid
- Check that your account has access to quantum backends
- Ensure environment variables are properly set

### Backend Connection

- If IBM API is unavailable, the system falls back to local simulation
- Check browser console for detailed error messages
- Verify your hub/group/project settings

### 3D Visualization

- Ensure WebGL is supported in your browser
- Update graphics drivers if Bloch sphere doesn't render
- Try refreshing the page if animations are stuck

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with real IBM Quantum backends
5. Submit a pull request

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Acknowledgments

- IBM Quantum team for the amazing quantum computing platform
- React Three Fiber community for 3D visualization tools
- Tailwind CSS for the utility-first styling approach
