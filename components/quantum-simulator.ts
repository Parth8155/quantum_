export type Complex = [number, number] // [re, im]
export type StateVector = Complex[]

export type GateInstance = {
  id: string
  type: "X" | "Y" | "Z" | "H" | "S" | "T" | "RX" | "RY" | "RZ" | "P" | "CNOT" | "MEASURE"
  qubits: number[]
  params?: { theta?: number }
  column?: number
}

export type Circuit = {
  numQubits: number
  columns: number
  grid: (string | null)[][]
  gates: GateInstance[]
}

export function defaultCircuit(numQubits: number, columns: number): Circuit {
  return {
    numQubits,
    columns,
    grid: Array.from({ length: columns }, () => Array.from({ length: numQubits }, () => null)),
    gates: [],
  }
}

export function applyCircuit(circuit: Circuit): StateVector {
  const n = circuit.numQubits
  let state = zeroState(n)
  const byCol = new Map<number, GateInstance[]>()
  for (const g of circuit.gates) {
    if (g.column == null) continue
    if (!byCol.has(g.column)) byCol.set(g.column, [])
    byCol.get(g.column)!.push(g)
  }
  const columns = Array.from(byCol.keys()).sort((a, b) => a - b)
  for (const col of columns) {
    const gs = byCol.get(col)!
    // Apply single-qubit gates first (on distinct qubits), then CNOTs
    for (const g of gs) {
      if (g.type === "CNOT") continue
      if (g.type === "MEASURE") continue // no collapse in sim; preview only
      state = applySingleGate(state, n, g)
    }
    for (const g of gs) {
      if (g.type === "CNOT") {
        state = applyCNOT(state, n, g.qubits[0], g.qubits[1])
      }
    }
  }
  return state
}

export function zeroState(n: number): StateVector {
  const N = 1 << n
  const sv: StateVector = Array.from({ length: N }, () => [0, 0])
  sv[0] = [1, 0]
  return sv
}

// Utilities
export function cadd([ar, ai]: Complex, [br, bi]: Complex): Complex {
  return [ar + br, ai + bi]
}
export function cmul([ar, ai]: Complex, [br, bi]: Complex): Complex {
  return [ar * br - ai * bi, ar * bi + ai * br]
}

export function applySingleGate(state: StateVector, n: number, g: GateInstance): StateVector {
  const q = g.qubits[0]
  const U = gateMatrix(g)
  // Apply U on qubit q
  const N = state.length
  const res: StateVector = Array.from({ length: N }, () => [0, 0])
  for (let i = 0; i < N; i++) {
    const bit = (i >> q) & 1
    const partner = i ^ (1 << q)
    const a = state[bit ? partner : i]
    const b = state[bit ? i : partner]
    // out0 = U00 * a + U01 * b
    // out1 = U10 * a + U11 * b
    const U00 = U[0]; const U01 = U[1]; const U10 = U[2]; const U11 = U[3]
    if (bit === 0) {
      res[i] = cadd(cmul(U00, a), cmul(U01, b))
      res[partner] = cadd(cmul(U10, a), cmul(U11, b))
    }
  }
  // Fill missing (we only wrote pairs when bit===0 above)
  for (let i = 0; i < N; i++) {
    if (res[i][0] === 0 && res[i][1] === 0) {
      // partner handled earlier
    }
  }
  return res
}

export function applyCNOT(state: StateVector, n: number, control: number, target: number): StateVector {
  if (control === target) return state
  const N = state.length
  const res: StateVector = Array.from({ length: N }, () => [0, 0])
  for (let i = 0; i < N; i++) {
    const ctrl = (i >> control) & 1
    let outIndex = i
    if (ctrl === 1) outIndex = i ^ (1 << target)
    res[outIndex] = cadd(res[outIndex], state[i])
  }
  return res
}

export function gateMatrix(g: GateInstance): [Complex, Complex, Complex, Complex] {
  const PI = Math.PI
  switch (g.type) {
    case "X":
      return [[0, 0], [1, 0], [1, 0], [0, 0]]
    case "Y":
      return [[0, 0], [0, -1], [0, 1], [0, 0]]
    case "Z":
      return [[1, 0], [0, 0], [0, 0], [-1, 0]]
    case "H": {
      const s = 1 / Math.sqrt(2)
      return [[s, 0], [s, 0], [s, 0], [-s, 0]]
    }
    case "S":
      return [[1, 0], [0, 0], [0, 0], [0, 1]]
    case "T":
      return [[1, 0], [0, 0], [0, 0], [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)]]
    case "P": {
      const t = g.params?.theta ?? PI / 2
      return [[1, 0], [0, 0], [0, 0], [Math.cos(t), Math.sin(t)]]
    }
    case "RX": {
      const t = g.params?.theta ?? PI / 2
      const c = Math.cos(t / 2)
      const s = Math.sin(t / 2)
      return [[ [c, 0][0], [0, 0][1] ] as any, [ [0, -s][0], [0, -s][1] ] as any, [ [0, -s][0], [0, -s][1] ] as any, [ [c, 0][0], [0, 0][1] ] as any] as any
    }
    case "RY": {
      const t = g.params?.theta ?? PI / 2
      const c = Math.cos(t / 2)
      const s = Math.sin(t / 2)
      return [[ [c, 0][0], [0, 0][1] ] as any, [ [s, 0][0], [0, 0][1] ] as any, [ [-s, 0][0], [0, 0][1] ] as any, [ [c, 0][0], [0, 0][1] ] as any] as any
    }
    case "RZ": {
      const t = g.params?.theta ?? PI / 2
      return [[Math.cos(-t / 2), Math.sin(-t / 2)], [0, 0], [0, 0], [Math.cos(t / 2), Math.sin(t / 2)]]
    }
    default:
      return [[1, 0], [0, 0], [0, 0], [1, 0]]
  }
}

// Fix RX/RY matrices properly (typed above for convenience)
;(gateMatrix as any) = function (g: GateInstance): [Complex, Complex, Complex, Complex] {
  const PI = Math.PI
  switch (g.type) {
    case "X":
      return [[0, 0], [1, 0], [1, 0], [0, 0]]
    case "Y":
      return [[0, 0], [0, -1], [0, 1], [0, 0]]
    case "Z":
      return [[1, 0], [0, 0], [0, 0], [-1, 0]]
    case "H": {
      const s = 1 / Math.sqrt(2)
      return [[s, 0], [s, 0], [s, 0], [-s, 0]]
    }
    case "S":
      return [[1, 0], [0, 0], [0, 0], [0, 1]]
    case "T": {
      const t = Math.PI / 4
      return [[1, 0], [0, 0], [0, 0], [Math.cos(t), Math.sin(t)]]
    }
    case "P": {
      const t = g.params?.theta ?? PI / 2
      return [[1, 0], [0, 0], [0, 0], [Math.cos(t), Math.sin(t)]]
    }
    case "RX": {
      const t = g.params?.theta ?? PI / 2
      const c: Complex = [Math.cos(t / 2), 0]
      const ns: Complex = [0, -Math.sin(t / 2)]
      return [c, ns, ns.map((x, i) => (i === 1 ? -x : x)) as Complex, c]
    }
    case "RY": {
      const t = g.params?.theta ?? PI / 2
      const c: Complex = [Math.cos(t / 2), 0]
      const s: Complex = [Math.sin(t / 2), 0]
      return [c, s, [-s[0], -s[1]], c]
    }
    case "RZ": {
      const t = g.params?.theta ?? PI / 2
      const eMinus = [Math.cos(-t / 2), Math.sin(-t / 2)] as Complex
      const ePlus = [Math.cos(t / 2), Math.sin(t / 2)] as Complex
      return [eMinus, [0, 0], [0, 0], ePlus]
    }
    default:
      return [[1, 0], [0, 0], [0, 0], [1, 0]]
  }
} as any

export function getProbabilities(state: StateVector): Record<string, number> {
  const probs: Record<string, number> = {}
  const n = Math.log2(state.length) | 0
  for (let i = 0; i < state.length; i++) {
    const [r, im] = state[i]
    const p = r * r + im * im
    const bit = i.toString(2).padStart(n, "0")
    probs[bit] = p
  }
  return probs
}

export function prettyStateVector(state: StateVector): string {
  const n = Math.log2(state.length) | 0
  const lines = state.map(([r, i], idx) => {
    const bits = idx.toString(2).padStart(n, "0")
    const mag = Math.sqrt(r * r + i * i)
    const phase = Math.atan2(i, r)
    return `|${bits}⟩: amp=${r.toFixed(3)}${i >= 0 ? "+" : ""}${i.toFixed(3)}i  |amp|=${mag.toFixed(3)}  φ=${phase.toFixed(3)}`
  })
  return lines.join("\n")
}

export function reduceToSingleQubit(state: StateVector, n: number, qubit: number): { alpha: [number, number]; beta: [number, number] } | null {
  if (n === 1) {
    return { alpha: state[0], beta: state[1] }
  }
  // Partial trace other qubits -> Bloch from reduced density; approximate by amplitudes grouped on qubit.
  // Not exact for entangled states; we compute amplitudes for |0> and |1> marginally.
  let alpha: Complex = [0, 0]
  let beta: Complex = [0, 0]
  for (let i = 0; i < state.length; i++) {
    const bit = (i >> qubit) & 1
    const [r, im] = state[i]
    const amp2: number = r * r + im * im
    if (bit === 0) alpha = [alpha[0] + amp2, alpha[1]]
    else beta = [beta[0] + amp2, beta[1]]
  }
  // Convert "probabilities" into pseudo-amplitudes for direction only
  const aMag = Math.sqrt(alpha[0])
  const bMag = Math.sqrt(beta[0])
  return { alpha: [aMag, 0], beta: [bMag, 0] }
}
