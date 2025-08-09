"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, Clock, Cpu, Zap } from "lucide-react"

interface QuantumResultsData {
    counts: Record<string, number>
    success: boolean
    shots: number
    execution_time: string
    backend_name: string
    job_id?: string
}

interface QuantumResultsPanelProps {
    isOpen: boolean
    onClose: () => void
    results: QuantumResultsData | null
    onDownload?: () => void
}

export function QuantumResultsPanel({ isOpen, onClose, results, onDownload }: QuantumResultsPanelProps) {
    if (!results) return null

    // Calculate probabilities and sort by count
    const sortedCounts = Object.entries(results.counts)
        .sort(([, a], [, b]) => b - a)
        .map(([state, count]) => ({
            state,
            count,
            probability: (count / results.shots) * 100
        }))

    const maxCount = Math.max(...Object.values(results.counts))

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="glass-panel max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="font-orbitron text-glow-blue flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Quantum Execution Results
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="visualization" className="h-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="visualization" className="font-exo">Visualization</TabsTrigger>
                        <TabsTrigger value="statistics" className="font-exo">Statistics</TabsTrigger>
                        <TabsTrigger value="raw" className="font-exo">Raw Data</TabsTrigger>
                    </TabsList>

                    <TabsContent value="visualization" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Backend Explanation */}
                            <Card className={`glass ${results.backend_name.includes('simulator') ? 'border-yellow-400/30' : 'border-blue-400/30'}`}>
                                <CardHeader>
                                    <CardTitle className="font-orbitron text-sm flex items-center gap-2">
                                        {results.backend_name.includes('simulator') || results.backend_name.includes('local') ? (
                                            <>
                                                <Cpu className="h-4 w-4 text-yellow-400" />
                                                Computer Simulation
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="h-4 w-4 text-blue-400" />
                                                Quantum Computer
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {results.backend_name.includes('simulator') || results.backend_name.includes('local') ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-exo text-yellow-200">
                                                🖥️ <strong>This ran on your computer</strong>
                                            </p>
                                            <p className="text-xs text-muted-foreground font-exo">
                                                Your circuit was simulated mathematically on classical hardware.
                                                Results are perfect and deterministic - no quantum noise!
                                            </p>
                                            <div className="mt-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                                                <p className="text-xs font-exo text-yellow-200">
                                                    💡 To run on real quantum hardware, use the "Run on IBM Quantum" button
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm font-exo text-blue-200">
                                                ⚛️ <strong>This ran on a real quantum computer!</strong>
                                            </p>
                                            <p className="text-xs text-muted-foreground font-exo">
                                                Your circuit executed on actual quantum hardware with real qubits.
                                                Results include quantum noise and environmental effects.
                                            </p>
                                            <div className="mt-2 p-2 rounded bg-blue-500/10 border border-blue-500/20">
                                                <p className="text-xs font-exo text-blue-200">
                                                    ✨ You just used cutting-edge quantum technology!
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Execution Summary */}
                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron text-sm">Execution Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Backend</span>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={`font-tech ${results.backend_name.includes('simulator') || results.backend_name.includes('local')
                                                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                                                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                                    }`}
                                            >
                                                {results.backend_name.includes('simulator') || results.backend_name.includes('local')
                                                    ? '🖥️ Simulator'
                                                    : '⚛️ Real Quantum'
                                                }
                                            </Badge>
                                            <span className="text-xs font-tech text-muted-foreground">
                                                {results.backend_name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Total Shots</span>
                                        <span className="font-tech">{results.shots.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Execution Time</span>
                                        <span className="font-tech flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {results.execution_time}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Status</span>
                                        <Badge className={results.success ? "bg-green-500" : "bg-red-500"}>
                                            {results.success ? "Success" : "Failed"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Measurement Distribution */}
                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron text-sm">Measurement Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {sortedCounts.map(({ state, count, probability }) => (
                                            <div key={state} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-tech">|{state}⟩</span>
                                                    <span className="font-exo">
                                                        {count} ({probability.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={(count / maxCount) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Visual Bar Chart */}
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="font-orbitron text-sm">Measurement Histogram</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="h-64 flex items-end justify-center gap-2 p-4 rounded-lg frosted">
                                        {sortedCounts.map(({ state, count, probability }) => (
                                            <div key={state} className="flex flex-col items-center gap-2 flex-1 max-w-20">
                                                <div className="text-xs font-tech text-muted-foreground">
                                                    {probability.toFixed(1)}%
                                                </div>
                                                <div
                                                    className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm relative"
                                                    style={{
                                                        height: `${(count / maxCount) * 180}px`,
                                                        minHeight: '4px'
                                                    }}
                                                >
                                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-tech">
                                                        {count}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-tech text-foreground">
                                                    |{state}⟩
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="statistics" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron text-sm">Statistical Analysis</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Most Frequent State</span>
                                        <span className="font-tech">|{sortedCounts[0]?.state}⟩</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Unique States</span>
                                        <span className="font-tech">{sortedCounts.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Max Probability</span>
                                        <span className="font-tech">{sortedCounts[0]?.probability.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-exo text-muted-foreground">Min Probability</span>
                                        <span className="font-tech">{sortedCounts[sortedCounts.length - 1]?.probability.toFixed(2)}%</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron text-sm">Measurement Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {sortedCounts.map(({ state, count, probability }) => (
                                            <div key={state} className="flex items-center justify-between p-2 rounded frosted">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-tech">|{state}⟩</span>
                                                    <div className="text-xs text-muted-foreground">
                                                        ({state.length} qubits)
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-tech text-sm">{count} shots</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {probability.toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="raw" className="space-y-4">
                        <Card className="glass">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="font-orbitron text-sm">Raw JSON Data</CardTitle>
                                {onDownload && (
                                    <Button variant="outline" size="sm" onClick={onDownload}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download JSON
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground bg-background/50 p-4 rounded-md overflow-auto max-h-96">
                                    {JSON.stringify(results, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    {onDownload && (
                        <Button variant="outline" onClick={onDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Results
                        </Button>
                    )}
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
