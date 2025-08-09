import { Circuit, GateInstance } from "./quantum-simulator"

export function generateQiskit(circuit: Circuit) {
  const lines: string[] = []
  lines.push("from qiskit import QuantumCircuit")
  lines.push(`qc = QuantumCircuit(${circuit.numQubits})`)
  // sort by column
  const gates = [...circuit.gates].sort((a, b) => (a.column! - b.column!))
  for (const g of gates) {
    lines.push(toQiskit(g))
  }
  lines.push("print(qc)")
  return lines.join("\n")
}

function toQiskit(g: GateInstance) {
  const [q0, q1] = g.qubits
  const t = g.type
  switch (t) {
    case "X":
    case "Y":
    case "Z":
    case "H":
    case "S":
    case "T":
      return `qc.${t.toLowerCase()}(${q0})`
    case "RX":
    case "RY":
    case "RZ":
      return `qc.${t.toLowerCase()}(${(g.params?.theta ?? Math.PI / 2).toFixed(6)}, ${q0})`
    case "P":
      return `qc.p(${(g.params?.theta ?? Math.PI / 2).toFixed(6)}, ${q0})`
    case "CNOT":
      return `qc.cx(${q0}, ${q1})`
    case "MEASURE":
      // keep simple: to classical not defined; show comment
      return `# measurement in Z basis on q${q0} (add classical register to record)`
    default:
      return `# ${t} not supported in export`
  }
}
