"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import styles from "@/styles/quantum-circuit.module.css"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Play, Trash2 } from 'lucide-react'
import { BlochSphere } from "@/components/bloch-sphere"
import { ProbabilityPanel } from "@/components/visualization-panel"
import { generateQiskit } from "@/components/qiskit-export"
import { ParticleBackground } from "@/components/particle-background"
import { WelcomeSection } from "@/components/welcome-section"
import { QuantumLearningHub } from "@/components/quantum-learning-hub"
import { QuantumStateExplainer } from "@/components/quantum-state-explainer"
import {
  Circuit,
  defaultCircuit,
  GateInstance,
  applyCircuit,
  getProbabilities,
  prettyStateVector,
  reduceToSingleQubit,
} from "@/components/quantum-simulator"
import { cn } from "@/lib/utils"
import { formatTheta } from "@/lib/utils"
import { BottomConsole } from "../components/ui/bottom-console";
import { QuantumBackendPanel } from "@/components/quantum-backend-panel"

type EditGateState = { open: boolean; gate?: GateInstance | null; column?: number; qubit?: number }

export default function Page() {
  const [circuit, setCircuit] = useState<Circuit>(() => defaultCircuit(2, 12))
  const [edit, setEdit] = useState<EditGateState>({ open: false })
  const [log, setLog] = useState<string[]>([])
  const [consoleOpen, setConsoleOpen] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)
  const [quantumResults, setQuantumResults] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentView, setCurrentView] = useState<'welcome' | 'learning' | 'builder'>('welcome')
  const [lastGateAdded, setLastGateAdded] = useState<string | undefined>(undefined)

  // Derived simulation results
  const { stateVector, probs } = useMemo(() => {
    const sv = applyCircuit(circuit)
    const p = getProbabilities(sv)
    return { stateVector: sv, probs: p }
  }, [circuit])

  const blochState = useMemo(() => {
    return reduceToSingleQubit(stateVector, circuit.numQubits, 0)
  }, [stateVector, circuit.numQubits])

  useEffect(() => {
    const btn = document.getElementById("run-btn")
    if (btn) {
      const handler = () => onRun()
      btn.addEventListener("click", handler)
      return () => btn.removeEventListener("click", handler)
    }
  }, [circuit])

  const onDropGate = useCallback(
    (col: number, qubit: number, data: { type: string; param?: string }) => {
      if (circuit.grid[col][qubit]) return

      const gate: GateInstance = {
        id: crypto.randomUUID(),
        type: data.type as any,
        qubits: [qubit],
      }

      if (data.param === "theta") {
        gate.params = { theta: Math.PI / 2 }
      }

      if (gate.type === "CNOT") {
        setEdit({ open: true, gate, column: col, qubit })
        return
      }

      setCircuit((c) => {
        const next = structuredClone(c)
        next.grid[col][qubit] = gate.id
        next.gates.push({ ...gate, column: col })
        return next
      })

      // Track the last gate added for the explainer
      setLastGateAdded(gate.type)
    },
    [circuit.grid],
  )

  const onEditGateParams = useCallback(
    (gateId: string) => {
      const g = circuit.gates.find((g) => g.id === gateId)
      if (!g) return
      setEdit({ open: true, gate: g })
    },
    [circuit.gates],
  )

  const onRemoveGate = useCallback(
    (gateId: string) => {
      setCircuit((c) => {
        const next = structuredClone(c)
        const g = next.gates.find((x) => x.id === gateId)
        if (!g) return c
        if (g.type === "CNOT") {
          const col = g.column!
          const [ctrl, tgt] = g.qubits
          if (next.grid[col][ctrl] === gateId) next.grid[col][ctrl] = null
          if (next.grid[col][tgt] === gateId) next.grid[col][tgt] = null
        } else {
          const col = g.column!
          const q = g.qubits[0]
          if (next.grid[col][q] === gateId) next.grid[col][q] = null
        }
        next.gates = next.gates.filter((x) => x.id !== gateId)
        return next
      })
    },
    [],
  )

  const onRun = () => {
    setIsSimulating(true)

    // Simulate some processing time
    setTimeout(() => {
      const svText = prettyStateVector(stateVector)
      const probsText = Object.entries(probs)
        .map(([bit, p]) => `${bit}: ${(p * 100).toFixed(2)}%`)
        .join(", ")
      const out = [
        `Ran ${circuit.gates.length} gates across ${circuit.numQubits} qubits.`,
        `State Vector: ${svText}`,
        `Probabilities: ${probsText}`,
      ]
      setLog((l) => [...out, ...l].slice(0, 200))
      setConsoleOpen(true)
      setIsSimulating(false)
    }, 500)
  }

  const handleQuantumResults = (results: any) => {
    setQuantumResults(results)
    if (results.counts) {
      const resultText = Object.entries(results.counts)
        .map(([state, count]) => `${state}: ${count} shots`)
        .join(", ")

      const out = [
        `IBM Quantum Results (${results.shots} shots):`,
        `Counts: ${resultText}`,
        `Execution time: ${results.execution_time || 'N/A'}`,
      ]
      setLog((l) => [...out, ...l].slice(0, 200))
      setConsoleOpen(true)
    }
  }

  const qiskit = useMemo(() => generateQiskit(circuit), [circuit])

  const handleGetStarted = () => {
    setCurrentView('builder')
    setShowWelcome(false)
    setTimeout(() => {
      document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleLearnMore = () => {
    setCurrentView('learning')
    setTimeout(() => {
      document.getElementById('learning')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleStartDemo = () => {
    setCurrentView('builder')
    setShowWelcome(false)
    setTimeout(() => {
      document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleNavigate = (view: 'welcome' | 'learning' | 'builder') => {
    setCurrentView(view)
    if (view === 'welcome') {
      setShowWelcome(true)
    } else if (view === 'learning') {
      setTimeout(() => {
        document.getElementById('learning')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else if (view === 'builder') {
      setShowWelcome(false)
      setTimeout(() => {
        document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      {/* Welcome Section */}
      {showWelcome && currentView === 'welcome' && (
        <WelcomeSection
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />
      )}

      {/* Learning Hub */}
      {currentView === 'learning' && (
        <QuantumLearningHub onStartInteractiveDemo={handleStartDemo} />
      )}

      {/* Circuit Builder Section */}
      {(currentView === 'builder' || !showWelcome) && (
        <section id="builder" className="p-4 md:p-6 relative z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
              <div className="w-full min-w-0">
                <CircuitCanvas
                  circuit={circuit}
                  onDropGate={onDropGate}
                  onEditGateParams={onEditGateParams}
                  onRemoveGate={onRemoveGate}
                  setCircuit={setCircuit}
                  isSimulating={isSimulating}
                  handleQuantumResults={handleQuantumResults}
                />
              </div>
              <aside
                id="visualizer"
                className="w-full rounded-xl glass-panel p-4 xl:sticky xl:top-6 self-start"
                aria-label="Visualization panel"
              >
                <Tabs defaultValue="bloch" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="bloch" className="text-center">Bloch Sphere</TabsTrigger>
                    <TabsTrigger value="probs" className="text-center">Probabilities</TabsTrigger>
                    <TabsTrigger value="state" className="text-center">State</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bloch" className="mt-4">
                    <div className="space-y-4">
                      <div className="h-[320px] rounded-lg glass backdrop-blur-md flex items-center justify-center">
                        <BlochSphere
                          state={blochState}
                          isAnimating={isSimulating}
                          showTrail={true}
                          key={`bloch-${circuit.gates.length}`}
                        />
                      </div>
                      <QuantumStateExplainer
                        gateCount={circuit.gates.length}
                        lastGateAdded={lastGateAdded}
                        stateVector={stateVector}
                        onReset={() => {
                          setCircuit(() => defaultCircuit(circuit.numQubits, circuit.columns))
                          setLastGateAdded(undefined)
                        }}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="probs" className="mt-4">
                    <ProbabilityPanel probs={probs} />
                  </TabsContent>
                  <TabsContent value="state" className="mt-4">
                    <div className="rounded-lg glass p-3">
                      <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                        {prettyStateVector(stateVector)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* BottomConsole and EditGateDialog are always available */}
      <BottomConsole
        open={consoleOpen}
        onOpenChange={setConsoleOpen}
        logs={log}
        qiskit={qiskit}
      />

      <EditGateDialog
        state={edit}
        onClose={() => setEdit({ open: false })}
        onConfirm={(updated) => {
          if (!updated) return setEdit({ open: false })
          if (edit.gate && !edit.gate.column && edit.column != null && edit.qubit != null) {
            const col = edit.column!
            setCircuit((c: Circuit) => {
              const next = structuredClone(c)
              const ctrl = edit.qubit!
              const tgt = updated.qubits.find((q: number) => q !== ctrl)!
              if (next.grid[col][ctrl] == null && next.grid[col][tgt] == null) {
                next.grid[col][ctrl] = edit.gate!.id
                next.grid[col][tgt] = edit.gate!.id
                next.gates.push({ ...updated, column: col })
              }
              return next
            })
            setEdit({ open: false })
            return
          }
          setCircuit((c: Circuit) => {
            const next = structuredClone(c)
            const idx = next.gates.findIndex((g: GateInstance) => g.id === updated.id)
            if (idx >= 0) next.gates[idx] = { ...next.gates[idx], ...updated }
            return next
          })
          setEdit({ open: false })
        }}
        numQubits={circuit.numQubits}
      />
    </div>
  )
}

function CircuitCanvas({
  circuit,
  onDropGate,
  onEditGateParams,
  onRemoveGate,
  setCircuit,
  isSimulating,
  handleQuantumResults,
}: {
  circuit: Circuit
  onDropGate: (col: number, qubit: number, data: { type: string; param?: string }) => void
  onEditGateParams: (gateId: string) => void
  onRemoveGate: (gateId: string) => void
  setCircuit: (updater: (c: Circuit) => Circuit) => void
  isSimulating: boolean
  handleQuantumResults: (results: any) => void
}) {
  const columns = Array.from({ length: circuit.columns }, (_, i) => i)

  return (
    <section
      className="w-full rounded-xl glass-panel p-4"
      aria-label="Circuit canvas"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium text-foreground font-orbitron text-matrix">Quantum Circuit</div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="bg-primary/20 text-primary-foreground border border-primary/40 hover:bg-primary/30 flex items-center gap-2 font-exo"
            onClick={() => (document.getElementById("run-btn") as HTMLButtonElement | null)?.click()}
            disabled={isSimulating}
          >
            <Play className="h-4 w-4" />
            {isSimulating ? "Simulating..." : "Simulate"}
          </Button>

          <QuantumBackendPanel
            circuit={circuit}
            onResults={handleQuantumResults}
          />

          <Button
            size="sm"
            variant="outline"
            className="border-border bg-secondary/50 hover:bg-secondary text-secondary-foreground flex items-center gap-2 font-exo"
            onClick={() => {
              setCircuit(() => defaultCircuit(circuit.numQubits, circuit.columns))
            }}
          >
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="relative overflow-auto rounded-lg glass">
        <div className="min-w-[800px] p-4">
          {/* Timeline header */}
          {/* eslint-disable-next-line react/forbid-dom-props */}
          <div
            className={styles['quantum-circuit-grid']}
            style={{ gridTemplateColumns: `100px repeat(${circuit.columns}, 60px)` }}
          >
            <div className="h-8" />
            {columns.map((c) => (
              <div key={c} className={styles['quantum-timeline-cell']}>
                t{c}
              </div>
            ))}
          </div>

          {/* Wires */}
          {Array.from({ length: circuit.numQubits }, (_, q) => q).map((q) => (
            /* eslint-disable-next-line react/forbid-dom-props */
            <div
              key={q}
              className={styles['quantum-qubit-row']}
              style={{ gridTemplateColumns: `100px repeat(${circuit.columns}, 60px)` }}
            >
              {/* Label */}
              <div className={styles['quantum-qubit-label']}>
                <span className="text-glow">|q{q}⟩</span>
              </div>

              {/* Cells */}
              {columns.map((col) => {
                const gateId = circuit.grid[col][q]
                const gate = gateId ? circuit.gates.find((g) => g.id === gateId) : undefined
                return (
                  <CanvasCell
                    key={`${col}-${q}`}
                    hasGate={!!gate}
                    onDrop={(data) => onDropGate(col, q, data)}
                  >
                    {/* Wire */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 pointer-events-none" />

                    {/* Gate */}
                    {gate && (
                      <GatePill
                        gate={gate}
                        qubit={q}
                        onEdit={() => onEditGateParams(gate.id)}
                        onRemove={() => onRemoveGate(gate.id)}
                      />
                    )}

                    {/* CNOT connector */}
                    {gate && gate.type === "CNOT" && gate.qubits.includes(q) && (
                      <CnotConnector gate={gate} thisQubit={q} columnsWidth={60} labelCol={100} column={gate.column!} />
                    )}
                  </CanvasCell>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2 p-2 rounded-md frosted font-exo">
        <Info className="h-4 w-4 text-accent" />
        <span>Drag gates from the left library and drop them into the grid. Click a gate to edit parameters or remove.</span>
      </div>

      {/* Qubit controls */}
      <div className="flex items-center gap-4 mt-4">
        <span className="text-sm font-medium text-foreground font-orbitron">Qubits:</span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 rounded-full p-0 border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => {
              if (circuit.numQubits > 1) {
                setCircuit((c) => defaultCircuit(c.numQubits - 1, c.columns))
              }
            }}
          >
            −
          </Button>
          <span className="w-8 text-center font-tech text-lg font-semibold text-foreground text-glow">
            {circuit.numQubits}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 rounded-full p-0 border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => {
              if (circuit.numQubits < 8) {
                setCircuit((c) => defaultCircuit(c.numQubits + 1, c.columns))
              }
            }}
          >
            +
          </Button>
        </div>
      </div>
    </section>
  )
}

function CanvasCell({
  children,
  hasGate,
  onDrop,
}: {
  children?: React.ReactNode
  hasGate: boolean
  onDrop: (data: { type: string; param?: string }) => void
}) {
  return (
    <div
      className={cn(
        "relative h-16 border-b border-white/10 flex items-center justify-center",
        "frosted",
        "hover:glass transition-all duration-200",
        !hasGate && "cursor-crosshair"
      )}
      onDragOver={(e) => {
        if (hasGate) return
        if (e.dataTransfer.types.includes("application/x-quantum-gate")) {
          e.preventDefault()
        }
      }}
      onDrop={(e) => {
        if (hasGate) return
        const raw = e.dataTransfer.getData("application/x-quantum-gate")
        if (!raw) return
        try {
          const data = JSON.parse(raw)
          onDrop(data)
        } catch { }
      }}
    >
      <div className="absolute inset-1 rounded-md ring-0 transition-all duration-150" />
      {children}
    </div>
  )
}

function GatePill({
  gate,
  qubit,
  onEdit,
  onRemove,
}: {
  gate: GateInstance
  qubit: number
  onEdit: () => void
  onRemove: () => void
}) {
  const isParam = ["RX", "RY", "RZ", "P"].includes(gate.type)
  const label =
    gate.type === "CNOT"
      ? gate.qubits[0] === qubit
        ? "●"
        : "⊕"
      : isParam
        ? `${gate.type}(${formatTheta(gate.params?.theta)})`
        : gate.type === "MEASURE"
          ? "M"
          : gate.type

  return (
    <button
      className={cn(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "z-10 flex items-center justify-center rounded-md px-3 py-2 text-xs font-tech font-medium",
        "glass-dark",
        "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
        "text-foreground hover:text-primary-foreground",
        "transform hover:scale-105 transition-all duration-200",
        "min-w-[2rem] min-h-[2rem]"
      )}
      onClick={onEdit}
      onContextMenu={(e) => {
        e.preventDefault()
        onRemove()
      }}
      title="Click to edit, right-click to remove"
    >
      {label}
    </button>
  )
}

function CnotConnector({
  gate,
  thisQubit,
  columnsWidth,
  labelCol,
  column,
}: {
  gate: GateInstance
  thisQubit: number
  columnsWidth: number
  labelCol: number
  column: number
}) {
  const [q1, q2] = gate.qubits
  const isCtrl = thisQubit === q1
  const top = Math.min(q1, q2)
  const bottom = Math.max(q1, q2)
  const isBetween = thisQubit > top && thisQubit < bottom

  return (
    <>
      {isBetween && (
        <div className="absolute left-1/2 top-0 bottom-0 w-px cnot-connector-between -translate-x-1/2" />
      )}
      {isCtrl && (
        <div className="absolute left-1/2 top-connector-between cnot-connector-between" />
      )}
    </>
  )
}

function EditGateDialog({
  state,
  onClose,
  onConfirm,
  numQubits,
}: {
  state: EditGateState
  onClose: () => void
  onConfirm: (gate?: GateInstance) => void
  numQubits: number
}) {
  const gate = state.gate

  const [theta, setTheta] = useState<number>(Math.PI / 2)
  const [target, setTarget] = useState<number>(0)

  useEffect(() => {
    if (gate?.params?.theta != null) setTheta(gate.params.theta)
  }, [gate?.params?.theta])

  if (!gate) {
    return <Dialog open={state.open} onOpenChange={(o) => (!o ? onClose() : null)} />
  }

  const isParamGate = ["RX", "RY", "RZ", "P"].includes(gate.type)
  const isCnot = gate.type === "CNOT" && gate.qubits.length === 1

  return (
    <Dialog open={state.open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent className="glass-panel text-foreground">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-foreground text-glow-blue">{gate.type} parameters</DialogTitle>
        </DialogHeader>

        {isParamGate && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-exo">Angle θ (radians)</label>
            <Input
              type="number"
              step="0.01"
              value={theta}
              onChange={(e) => setTheta(parseFloat(e.target.value))}
              className="bg-input border-border text-foreground font-tech"
            />
          </div>
        )}

        {isCnot && (
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground font-medium font-exo">Target qubit</label>
            <select
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-full rounded-md bg-input border border-border p-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary font-tech"
              title="Select target qubit for CNOT gate"
            >
              {Array.from({ length: numQubits }, (_, i) => i)
                .filter((i) => i !== state.qubit)
                .map((i) => (
                  <option key={i} value={i}>
                    q{i}
                  </option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground font-exo">
              Control is q{state.qubit}, choose a different target.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 font-exo" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-exo"
            onClick={() => {
              const updated: GateInstance = {
                ...gate,
                params: isParamGate ? { theta } : gate.params,
                qubits: isCnot ? [state.qubit!, target] : gate.qubits,
              }
              onConfirm(updated)
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
