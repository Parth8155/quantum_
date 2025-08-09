"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
    Cloud,
    Cpu,
    Clock,
    Zap,
    CheckCircle,
    XCircle,
    AlertCircle,
    Play,
    Pause,
    Trash2,
    Download,
    RefreshCw,
    BarChart3
} from "lucide-react"
import { Circuit } from "@/components/quantum-simulator"
import { QuantumResultsPanel } from "@/components/quantum-results-panel"
import { IBMQuantumConnectionTester } from "@/components/ibm-connection-tester"

interface QuantumBackend {
    name: string
    status: 'online' | 'offline' | 'maintenance'
    qubits: number
    pending_jobs: number
    description: string
    coupling_map?: number[][]
    basis_gates: string[]
    max_shots?: number
    simulator?: boolean
}

interface QuantumJob {
    id: string
    ibm_job_id?: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    results?: any
    backend: string
    shots: number
    qiskit_code: string
    created_at: string
    updated_at: string
    error?: string
    execution_time?: string
}

interface QuantumBackendPanelProps {
    circuit: Circuit
    onResults?: (results: any) => void
}

export function QuantumBackendPanel({ circuit, onResults }: QuantumBackendPanelProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [backends, setBackends] = useState<QuantumBackend[]>([])
    const [jobs, setJobs] = useState<QuantumJob[]>([])
    const [selectedBackend, setSelectedBackend] = useState<string>("")
    const [shots, setShots] = useState(1024)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("connection")
    const [resultsPanel, setResultsPanel] = useState<{ isOpen: boolean; results: any | null }>({
        isOpen: false,
        results: null
    })

    useEffect(() => {
        if (isOpen) {
            loadBackends()
            loadJobs()
        }
    }, [isOpen])

    useEffect(() => {
        // Auto-refresh jobs every 5 seconds
        const interval = setInterval(() => {
            if (isOpen) {
                loadJobs()
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [isOpen])

    const refreshData = () => {
        loadBackends()
        loadJobs()
    }

    const loadBackends = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/quantum/backends')
            const data = await response.json()

            if (response.ok) {
                setBackends(data)
                if (data.length > 0 && !selectedBackend) {
                    setSelectedBackend(data[0].name)
                }
            } else {
                throw new Error(data.error || 'Failed to fetch backends')
            }
        } catch (error) {
            console.error("Failed to load backends:", error)
            alert(`Failed to load backends: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    const loadJobs = async () => {
        try {
            const response = await fetch('/api/quantum/jobs')
            const data = await response.json()

            if (response.ok) {
                setJobs(Array.isArray(data) ? data.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                ) : [])
            } else {
                throw new Error(data.error || 'Failed to fetch jobs')
            }
        } catch (error) {
            console.error("Failed to load jobs:", error)
        }
    }

    const submitJob = async () => {
        if (!selectedBackend) {
            alert("Please select a backend")
            return
        }

        try {
            setLoading(true)

            const response = await fetch('/api/quantum/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    circuit,
                    backend: selectedBackend,
                    shots
                })
            })

            const data = await response.json()

            if (response.ok) {
                await loadJobs() // Refresh jobs list
                setActiveTab("jobs")
                alert(`Job submitted successfully! Job ID: ${data.id}`)
            } else {
                throw new Error(data.error || 'Failed to submit job')
            }
        } catch (error) {
            console.error("Failed to submit job:", error)
            alert(`Failed to submit job: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    const cancelJob = async (jobId: string) => {
        try {
            const response = await fetch(`/api/quantum/jobs?id=${jobId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                loadJobs()
            } else {
                const data = await response.json()
                throw new Error(data.error || 'Failed to cancel job')
            }
        } catch (error) {
            console.error("Failed to cancel job:", error)
            alert(`Failed to cancel job: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    const viewResults = async (jobId: string) => {
        try {
            const response = await fetch(`/api/quantum/jobs?id=${jobId}`)
            const job = await response.json()

            if (response.ok && job.results) {
                // Show results in the new visualization panel
                setResultsPanel({
                    isOpen: true,
                    results: job.results
                })

                // Pass results to parent component
                if (onResults) {
                    onResults(job.results)
                }
            } else {
                throw new Error('Job results not available')
            }
        } catch (error) {
            console.error("Failed to load results:", error)
            alert("Failed to load results")
        }
    }

    const downloadResults = async (jobId: string) => {
        try {
            const response = await fetch(`/api/quantum/jobs?id=${jobId}`)
            const job = await response.json()

            if (response.ok && job.results) {
                const blob = new Blob([JSON.stringify(job.results, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `quantum_results_${jobId}.json`
                a.click()
                URL.revokeObjectURL(url)
            } else {
                throw new Error('Job results not available')
            }
        } catch (error) {
            console.error("Failed to download results:", error)
            alert("Failed to download results")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500'
            case 'completed': return 'bg-green-500'
            case 'running': return 'bg-blue-500'
            case 'pending': return 'bg-yellow-500'
            case 'failed': return 'bg-red-500'
            case 'cancelled': return 'bg-gray-500'
            case 'maintenance': return 'bg-orange-500'
            default: return 'bg-gray-500'
        }
    }

    const selectedBackendInfo = backends.find((b: QuantumBackend) => b.name === selectedBackend)

    // Calculate estimated cost based on shots and circuit complexity
    const estimatedCost = Math.ceil((shots / 1000) * (circuit.gates.length / 10) * 0.1)

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="glass-dark text-accent-foreground hover:bg-accent/20 font-exo"
                    >
                        <Cloud className="h-4 w-4 mr-2" />
                        Run on IBM Quantum
                    </Button>
                </DialogTrigger>

                <DialogContent className="glass-panel max-w-4xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="font-orbitron text-glow-blue">IBM Quantum Runtime</DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="connection" className="font-exo">Connection</TabsTrigger>
                            <TabsTrigger value="submit" className="font-exo">Submit Job</TabsTrigger>
                            <TabsTrigger value="jobs" className="font-exo">Jobs ({jobs.length})</TabsTrigger>
                            <TabsTrigger value="backends" className="font-exo">Backends</TabsTrigger>
                        </TabsList>

                        <TabsContent value="connection" className="space-y-4">
                            <IBMQuantumConnectionTester />
                        </TabsContent>

                        <TabsContent value="submit" className="space-y-4">
                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron">Job Configuration</CardTitle>
                                    <CardDescription className="font-exo">
                                        Configure and submit your quantum circuit to run on real quantum hardware
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-exo">Backend</Label>
                                            <Select value={selectedBackend} onValueChange={setSelectedBackend}>
                                                <SelectTrigger className="font-tech">
                                                    <SelectValue placeholder="Select a backend" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {backends.map((backend: QuantumBackend) => (
                                                        <SelectItem key={backend.name} value={backend.name}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${getStatusColor(backend.status)}`} />
                                                                {backend.name} ({backend.qubits} qubits)
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-exo">Shots</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="8192"
                                                value={shots}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShots(parseInt(e.target.value) || 1024)}
                                                className="font-tech"
                                            />
                                        </div>
                                    </div>

                                    {selectedBackendInfo && (
                                        <Card className="frosted">
                                            <CardContent className="pt-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Status</div>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedBackendInfo.status)}`} />
                                                            <span className="font-tech capitalize">{selectedBackendInfo.status}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Queue</div>
                                                        <div className="font-tech">{selectedBackendInfo.pending_jobs} jobs</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Estimated Cost</div>
                                                        <div className="font-tech">{estimatedCost} credits</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Circuit Depth</div>
                                                        <div className="font-tech">{circuit.gates.length} gates</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Button
                                        onClick={submitJob}
                                        disabled={!selectedBackend || loading}
                                        className="w-full font-exo"
                                    >
                                        {loading ? (
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Play className="h-4 w-4 mr-2" />
                                        )}
                                        Submit to Quantum Computer
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="jobs">
                            <ScrollArea className="h-96">
                                <div className="space-y-3">
                                    {jobs.length === 0 ? (
                                        <Card className="glass">
                                            <CardContent className="pt-6 text-center">
                                                <div className="text-muted-foreground font-exo">No jobs submitted yet</div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        jobs.map((job: QuantumJob) => (
                                            <Card key={job.id} className="glass">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-1">
                                                            <div className="font-tech text-sm">{job.id}</div>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <span className="font-exo">{job.backend}</span>
                                                                <span className="font-exo">{job.shots} shots</span>
                                                                <span className="font-exo">{new Date(job.created_at).toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={`${getStatusColor(job.status)} text-white border-0`}
                                                            >
                                                                {job.status}
                                                            </Badge>

                                                            {job.status === 'running' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => cancelJob(job.id)}
                                                                >
                                                                    <Pause className="h-3 w-3" />
                                                                </Button>
                                                            )}

                                                            {job.status === 'completed' && (
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => viewResults(job.id)}
                                                                        title="View Results"
                                                                    >
                                                                        <BarChart3 className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => downloadResults(job.id)}
                                                                        title="Download JSON"
                                                                    >
                                                                        <Download className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {job.status === 'running' && (
                                                        <Progress value={Math.random() * 70 + 20} className="mt-2" />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="backends">
                            <ScrollArea className="h-96">
                                <div className="grid gap-3">
                                    {backends.map((backend: QuantumBackend) => (
                                        <Card key={backend.name} className="glass">
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-tech font-semibold">{backend.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(backend.status)}`} />
                                                        <span className="text-xs font-exo capitalize">{backend.status}</span>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-muted-foreground font-exo mb-3">
                                                    {backend.description}
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 text-xs">
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Qubits</div>
                                                        <div className="font-tech font-semibold">{backend.qubits}</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Queue</div>
                                                        <div className="font-tech font-semibold">{backend.pending_jobs}</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-exo text-muted-foreground">Gates</div>
                                                        <div className="font-tech font-semibold">{backend.basis_gates.length}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <QuantumResultsPanel
                isOpen={resultsPanel.isOpen}
                onClose={() => setResultsPanel({ isOpen: false, results: null })}
                results={resultsPanel.results}
                onDownload={() => {
                    if (resultsPanel.results) {
                        const blob = new Blob([JSON.stringify(resultsPanel.results, null, 2)], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `quantum_results_${Date.now()}.json`
                        a.click()
                        URL.revokeObjectURL(url)
                    }
                }}
            />
        </>
    )
}
