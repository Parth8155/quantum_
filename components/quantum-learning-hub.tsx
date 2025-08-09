"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Atom,
    Brain,
    Lightbulb,
    Zap,
    Target,
    BookOpen,
    Play,
    CheckCircle,
    ArrowRight,
    Cpu,
    Lock,
    Globe,
    TrendingUp,
    Users,
    Timer
} from "lucide-react"

interface LessonProgress {
    completed: boolean
    timeSpent: number
}

interface QuantumLearningHubProps {
    onStartInteractiveDemo?: () => void
}

export function QuantumLearningHub({ onStartInteractiveDemo }: QuantumLearningHubProps) {
    const [activeLesson, setActiveLesson] = useState<string | null>(null)
    const [progress, setProgress] = useState<Record<string, LessonProgress>>({})

    const markLessonComplete = (lessonId: string) => {
        setProgress(prev => ({
            ...prev,
            [lessonId]: { completed: true, timeSpent: (prev[lessonId]?.timeSpent || 0) + 5 }
        }))
    }

    const lessons = [
        {
            id: "basics",
            title: "What is Quantum Computing?",
            description: "Understanding the fundamental differences from classical computing",
            icon: Atom,
            difficulty: "Beginner",
            duration: "5 min",
            concepts: ["Quantum vs Classical", "Superposition", "Entanglement"]
        },
        {
            id: "qubits",
            title: "Understanding Qubits",
            description: "The building blocks of quantum computers",
            icon: Zap,
            difficulty: "Beginner",
            duration: "7 min",
            concepts: ["Binary vs Quantum", "Bloch Sphere", "Measurement"]
        },
        {
            id: "gates",
            title: "Quantum Gates & Circuits",
            description: "How to manipulate quantum information",
            icon: Cpu,
            difficulty: "Intermediate",
            duration: "10 min",
            concepts: ["Logic Gates", "Circuit Design", "Gate Operations"]
        },
        {
            id: "algorithms",
            title: "Famous Quantum Algorithms",
            description: "Real-world applications and use cases",
            icon: Brain,
            difficulty: "Advanced",
            duration: "15 min",
            concepts: ["Shor's Algorithm", "Grover's Search", "Quantum Advantage"]
        }
    ]

    const applications = [
        {
            title: "Cryptography & Security",
            description: "Breaking and creating unbreakable codes",
            icon: Lock,
            color: "text-red-400",
            examples: ["RSA Breaking", "Quantum Key Distribution", "Post-Quantum Cryptography"]
        },
        {
            title: "Drug Discovery",
            description: "Simulating molecular interactions",
            icon: Target,
            color: "text-green-400",
            examples: ["Protein Folding", "Chemical Reactions", "Molecular Optimization"]
        },
        {
            title: "Financial Modeling",
            description: "Risk analysis and portfolio optimization",
            icon: TrendingUp,
            color: "text-blue-400",
            examples: ["Monte Carlo Simulations", "Risk Assessment", "Trading Strategies"]
        },
        {
            title: "Machine Learning",
            description: "Quantum-enhanced AI algorithms",
            icon: Brain,
            color: "text-purple-400",
            examples: ["Quantum Neural Networks", "Pattern Recognition", "Optimization"]
        }
    ]

    return (
        <section id="learning" className="py-12 relative">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-glow-blue mb-4">
                        Welcome to Quantum Computing
                    </h1>
                    <p className="text-xl text-muted-foreground font-exo max-w-3xl mx-auto mb-8">
                        Discover the fascinating world of quantum computing through interactive lessons,
                        hands-on experiments, and real-world applications. No physics background required!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            size="lg"
                            className="font-exo"
                            onClick={onStartInteractiveDemo}
                        >
                            <Play className="h-5 w-5 mr-2" />
                            Start Interactive Demo
                        </Button>
                        <Button size="lg" variant="outline" className="font-exo">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Begin Learning Path
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="introduction" className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
                        <TabsTrigger value="introduction" className="font-exo">Introduction</TabsTrigger>
                        <TabsTrigger value="lessons" className="font-exo">Lessons</TabsTrigger>
                        <TabsTrigger value="applications" className="font-exo">Applications</TabsTrigger>
                        <TabsTrigger value="playground" className="font-exo">Try It Now</TabsTrigger>
                    </TabsList>

                    {/* Introduction Tab */}
                    <TabsContent value="introduction" className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron flex items-center gap-2">
                                        <Atom className="h-6 w-6 text-blue-400" />
                                        Classical vs Quantum
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg frosted">
                                            <h4 className="font-semibold font-exo mb-2">Classical Computers</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Use bits (0 or 1) to process information sequentially.
                                                Like a light switch - either ON or OFF.
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg frosted border border-blue-400/20">
                                            <h4 className="font-semibold font-exo mb-2">Quantum Computers</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Use qubits that can be 0, 1, or both simultaneously (superposition).
                                                Like a spinning coin - both heads and tails until it lands.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass">
                                <CardHeader>
                                    <CardTitle className="font-orbitron flex items-center gap-2">
                                        <Lightbulb className="h-6 w-6 text-yellow-400" />
                                        Key Concepts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                                            <div>
                                                <h4 className="font-semibold font-exo">Superposition</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Qubits can exist in multiple states simultaneously
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                                            <div>
                                                <h4 className="font-semibold font-exo">Entanglement</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Qubits can be mysteriously connected across any distance
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                                            <div>
                                                <h4 className="font-semibold font-exo">Interference</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantum states can amplify or cancel each other out
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="glass text-center">
                                <CardContent className="pt-6">
                                    <Globe className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                                    <h3 className="font-bold font-tech text-2xl">50+</h3>
                                    <p className="text-sm text-muted-foreground font-exo">Quantum Computers Worldwide</p>
                                </CardContent>
                            </Card>
                            <Card className="glass text-center">
                                <CardContent className="pt-6">
                                    <Users className="h-8 w-8 mx-auto text-green-400 mb-2" />
                                    <h3 className="font-bold font-tech text-2xl">1000x</h3>
                                    <p className="text-sm text-muted-foreground font-exo">Faster for Some Problems</p>
                                </CardContent>
                            </Card>
                            <Card className="glass text-center">
                                <CardContent className="pt-6">
                                    <TrendingUp className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                                    <h3 className="font-bold font-tech text-2xl">$65B</h3>
                                    <p className="text-sm text-muted-foreground font-exo">Market by 2030</p>
                                </CardContent>
                            </Card>
                            <Card className="glass text-center">
                                <CardContent className="pt-6">
                                    <Timer className="h-8 w-8 mx-auto text-orange-400 mb-2" />
                                    <h3 className="font-bold font-tech text-2xl">10min</h3>
                                    <p className="text-sm text-muted-foreground font-exo">To Get Started</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Lessons Tab */}
                    <TabsContent value="lessons" className="space-y-6">
                        <div className="grid gap-6">
                            {lessons.map((lesson) => {
                                const Icon = lesson.icon
                                const isCompleted = progress[lesson.id]?.completed
                                const getDifficultyColor = (difficulty: string) => {
                                    switch (difficulty) {
                                        case "Beginner": return "bg-green-500"
                                        case "Intermediate": return "bg-yellow-500"
                                        case "Advanced": return "bg-red-500"
                                        default: return "bg-gray-500"
                                    }
                                }

                                return (
                                    <Card key={lesson.id} className="glass hover:border-blue-400/40 transition-all">
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="p-3 rounded-lg glass-dark">
                                                        <Icon className="h-6 w-6 text-blue-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold font-orbitron">{lesson.title}</h3>
                                                            {isCompleted && <CheckCircle className="h-5 w-5 text-green-400" />}
                                                        </div>
                                                        <p className="text-muted-foreground font-exo mb-3">{lesson.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <Badge className={getDifficultyColor(lesson.difficulty)}>
                                                                {lesson.difficulty}
                                                            </Badge>
                                                            <span className="text-muted-foreground font-exo">⏱️ {lesson.duration}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {lesson.concepts.map((concept) => (
                                                                <Badge key={concept} variant="outline" className="text-xs">
                                                                    {concept}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant={isCompleted ? "outline" : "default"}
                                                    onClick={() => {
                                                        setActiveLesson(lesson.id)
                                                        if (!isCompleted) markLessonComplete(lesson.id)
                                                    }}
                                                    className="font-exo"
                                                >
                                                    {isCompleted ? "Review" : "Start"}
                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Progress Overview */}
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="font-orbitron">Your Learning Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-exo">Completed Lessons</span>
                                        <span className="font-tech">
                                            {Object.values(progress).filter(p => p.completed).length} / {lessons.length}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(Object.values(progress).filter(p => p.completed).length / lessons.length) * 100}
                                        className="h-2"
                                    />
                                    <p className="text-xs text-muted-foreground font-exo">
                                        Complete all lessons to unlock advanced quantum algorithms and real-world projects!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold font-orbitron mb-4">Real-World Applications</h2>
                            <p className="text-lg text-muted-foreground font-exo max-w-2xl mx-auto">
                                Quantum computing isn't just theoretical - it's already solving real problems in various industries
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {applications.map((app) => {
                                const Icon = app.icon
                                return (
                                    <Card key={app.title} className="glass hover:border-blue-400/40 transition-all">
                                        <CardHeader>
                                            <CardTitle className="font-orbitron flex items-center gap-3">
                                                <Icon className={`h-6 w-6 ${app.color}`} />
                                                {app.title}
                                            </CardTitle>
                                            <CardDescription className="font-exo">
                                                {app.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <h4 className="font-semibold font-exo text-sm">Current Applications:</h4>
                                                <ul className="space-y-1">
                                                    {app.examples.map((example) => (
                                                        <li key={example} className="text-sm text-muted-foreground font-exo flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                            {example}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* Playground Tab */}
                    <TabsContent value="playground" className="space-y-6">
                        <Card className="glass">
                            <CardHeader className="text-center">
                                <CardTitle className="font-orbitron text-2xl">Ready to Build Your First Quantum Circuit?</CardTitle>
                                <CardDescription className="font-exo text-lg">
                                    Use our interactive circuit builder to experiment with quantum gates and see real results
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg frosted">
                                        <h3 className="font-semibold font-exo mb-2">1. Build Circuit</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Drag and drop quantum gates to create your circuit
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg frosted">
                                        <h3 className="font-semibold font-exo mb-2">2. Visualize</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Watch the Bloch sphere update in real-time
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg frosted">
                                        <h3 className="font-semibold font-exo mb-2">3. Run & Analyze</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Execute on simulators or real quantum computers
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Button
                                        size="lg"
                                        className="font-exo"
                                        onClick={() => {
                                            document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })
                                            onStartInteractiveDemo?.()
                                        }}
                                    >
                                        <Play className="h-5 w-5 mr-2" />
                                        Start Building Circuits
                                    </Button>
                                    <p className="text-sm text-muted-foreground font-exo">
                                        No installation required - everything runs in your browser!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}
