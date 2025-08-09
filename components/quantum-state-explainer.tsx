"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, RotateCcw, Zap, Info } from "lucide-react"

interface QuantumStateExplainerProps {
    gateCount: number
    lastGateAdded?: string
    stateVector?: any
    onReset: () => void
}

export function QuantumStateExplainer({
    gateCount,
    lastGateAdded,
    stateVector,
    onReset
}: QuantumStateExplainerProps) {

    const getGateExplanation = (gateType: string) => {
        const explanations: Record<string, { title: string; effect: string; icon: string }> = {
            'H': {
                title: 'Hadamard Gate',
                effect: 'Creates superposition - qubit becomes 50% |0⟩ and 50% |1⟩',
                icon: '🌀'
            },
            'X': {
                title: 'Pauli-X Gate',
                effect: 'Bit flip - turns |0⟩ into |1⟩ and |1⟩ into |0⟩',
                icon: '🔄'
            },
            'Y': {
                title: 'Pauli-Y Gate',
                effect: 'Bit flip + phase flip - rotates around Y-axis',
                icon: '↕️'
            },
            'Z': {
                title: 'Pauli-Z Gate',
                effect: 'Phase flip - changes the phase of |1⟩ state',
                icon: '⚡'
            },
            'RX': {
                title: 'X-Rotation Gate',
                effect: 'Rotates qubit around X-axis by specified angle',
                icon: '🔄'
            },
            'RY': {
                title: 'Y-Rotation Gate',
                effect: 'Rotates qubit around Y-axis by specified angle',
                icon: '↕️'
            },
            'RZ': {
                title: 'Z-Rotation Gate',
                effect: 'Rotates qubit around Z-axis by specified angle',
                icon: '⚡'
            },
            'CNOT': {
                title: 'CNOT Gate',
                effect: 'Entangles qubits - flips target if control is |1⟩',
                icon: '🔗'
            }
        }

        return explanations[gateType] || {
            title: 'Quantum Gate',
            effect: 'Manipulates the quantum state',
            icon: '⚛️'
        }
    }

    return (
        <Card className="glass border-blue-400/30">
            <CardHeader>
                <CardTitle className="font-orbitron text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    Quantum State Monitor
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current State */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-exo text-muted-foreground">Circuit Gates</span>
                        <Badge variant="outline" className="font-tech">
                            {gateCount} gates
                        </Badge>
                    </div>

                    {gateCount === 0 ? (
                        <div className="p-3 rounded-lg bg-muted/20 border border-muted/40">
                            <p className="text-sm font-exo text-center">
                                🎯 <strong>Starting State</strong>
                            </p>
                            <p className="text-xs text-muted-foreground text-center mt-1">
                                All qubits are in |0⟩ state (North pole of Bloch sphere)
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <p className="text-sm font-exo">
                                    ⚛️ <strong>Modified Quantum State</strong>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    The Bloch sphere shows the current state after {gateCount} gate{gateCount > 1 ? 's' : ''}
                                </p>
                            </div>

                            {lastGateAdded && (
                                <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-tech text-green-300">LAST GATE ADDED:</span>
                                        <Badge className="bg-green-500/20 text-green-300 text-xs">
                                            {getGateExplanation(lastGateAdded).icon} {lastGateAdded}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-exo text-green-200">
                                        <strong>{getGateExplanation(lastGateAdded).title}</strong>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {getGateExplanation(lastGateAdded).effect}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Interactive Instructions */}
                <div className="space-y-2">
                    <p className="text-xs font-exo text-muted-foreground">
                        💡 <strong>Try this:</strong>
                    </p>
                    <div className="space-y-1 text-xs font-exo text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            <span>Add an <strong>H gate</strong> to see superposition</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            <span>Add an <strong>X gate</strong> to flip the qubit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            <span>Watch the sphere <strong>rotate</strong> in real-time!</span>
                        </div>
                    </div>
                </div>

                {gateCount > 0 && (
                    <>
                        <Separator />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReset}
                            className="w-full font-exo"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset to |0⟩ State
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
