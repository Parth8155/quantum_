"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowDown,
    Play,
    BookOpen,
    Atom,
    Zap,
    Target,
    ChevronRight,
    Lightbulb,
    Users,
    Globe
} from "lucide-react"

interface WelcomeSectionProps {
    onGetStarted: () => void
    onLearnMore: () => void
}

export function WelcomeSection({ onGetStarted, onLearnMore }: WelcomeSectionProps) {
    const [currentExample, setCurrentExample] = useState(0)

    const examples = [
        {
            title: "Superposition",
            description: "A qubit can be both 0 and 1 at the same time",
            analogy: "Like a coin spinning in the air - both heads and tails until it lands"
        },
        {
            title: "Entanglement",
            description: "Two qubits can be mysteriously connected",
            analogy: "Like having two magic coins that always land on opposite sides"
        },
        {
            title: "Interference",
            description: "Quantum states can amplify or cancel each other",
            analogy: "Like sound waves that can make music louder or create silence"
        }
    ]

    const features = [
        {
            icon: Atom,
            title: "Interactive Circuit Builder",
            description: "Drag and drop quantum gates to build circuits visually",
            color: "text-blue-400"
        },
        {
            icon: Zap,
            title: "Real-time Visualization",
            description: "Watch quantum states change on the Bloch sphere",
            color: "text-yellow-400"
        },
        {
            icon: Target,
            title: "Real Quantum Hardware",
            description: "Run your circuits on actual quantum computers via IBM Quantum",
            color: "text-green-400"
        },
        {
            icon: BookOpen,
            title: "Step-by-step Learning",
            description: "Guided tutorials from basic concepts to advanced algorithms",
            color: "text-purple-400"
        }
    ]

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 relative overflow-hidden">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 text-center mb-16">
                <div className="space-y-6">
                    <Badge className="px-4 py-2 text-sm font-exo bg-blue-500/20 text-blue-300 border-blue-400/40">
                        🚀 Welcome to the Future of Computing
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-glow-blue leading-tight">
                        Quantum Computing
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">
                            Made Simple
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground font-exo max-w-4xl mx-auto leading-relaxed">
                        Discover how quantum computers work through interactive experiments,
                        visual learning, and hands-on circuit building.
                        <span className="text-foreground font-semibold">No physics degree required!</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button
                            size="lg"
                            className="px-8 py-4 text-lg font-exo hover:scale-105 transition-transform"
                            onClick={onGetStarted}
                        >
                            <Play className="h-6 w-6 mr-3" />
                            Start Building Circuits
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-4 text-lg font-exo hover:scale-105 transition-transform"
                            onClick={onLearnMore}
                        >
                            <Lightbulb className="h-6 w-6 mr-3" />
                            Learn the Basics First
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Concept Showcase */}
            <div className="max-w-4xl mx-auto px-4 mb-16">
                <Card className="glass border-blue-400/30">
                    <CardHeader className="text-center">
                        <CardTitle className="font-orbitron text-2xl">
                            Quantum vs Classical Computing
                        </CardTitle>
                        <CardDescription className="font-exo text-lg">
                            Understanding the key differences in 30 seconds
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold font-exo text-lg text-blue-300">Classical Computer</h3>
                                <div className="p-4 rounded-lg glass-dark">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                                        <span className="font-tech">Bit: 0</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                                        <span className="font-tech">Bit: 1</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-exo">
                                        Processes information one step at a time, like reading a book page by page.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold font-exo text-lg text-purple-300">Quantum Computer</h3>
                                <div className="p-4 rounded-lg glass-dark border border-purple-400/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-green-400 rounded-sm animate-pulse"></div>
                                        <span className="font-tech">Qubit: 0 + 1</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-sm animate-pulse"></div>
                                        <span className="font-tech">Entangled Qubits</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-exo">
                                        Explores many possibilities simultaneously, like reading all pages at once.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-4 mb-16">
                <h2 className="text-3xl font-bold font-orbitron text-center mb-8">
                    What Makes Our Platform Special?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <Card key={index} className="glass hover:border-blue-400/40 transition-all group">
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-4">
                                        <Icon className={`h-12 w-12 mx-auto ${feature.color} group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <h3 className="font-semibold font-exo mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground font-exo">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Success Stories / Stats */}
            <div className="max-w-4xl mx-auto px-4 mb-16">
                <Card className="glass">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="flex items-center justify-center mb-2">
                                    <Users className="h-8 w-8 text-blue-400" />
                                </div>
                                <h3 className="font-bold font-tech text-3xl text-blue-300">10,000+</h3>
                                <p className="text-muted-foreground font-exo">Students Learning Quantum</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-center mb-2">
                                    <Zap className="h-8 w-8 text-yellow-400" />
                                </div>
                                <h3 className="font-bold font-tech text-3xl text-yellow-300">1M+</h3>
                                <p className="text-muted-foreground font-exo">Circuits Built & Tested</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-center mb-2">
                                    <Globe className="h-8 w-8 text-green-400" />
                                </div>
                                <h3 className="font-bold font-tech text-3xl text-green-300">50+</h3>
                                <p className="text-muted-foreground font-exo">Real Quantum Computers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <div className="space-y-4">
                    <p className="text-lg font-exo text-muted-foreground">
                        Ready to dive into the quantum world?
                    </p>
                    <Button
                        size="lg"
                        variant="outline"
                        className="px-6 py-3 font-exo group"
                        onClick={() => {
                            document.getElementById('learning')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                    >
                        <ArrowDown className="h-5 w-5 mr-2 group-hover:translate-y-1 transition-transform" />
                        Explore Learning Hub
                    </Button>
                </div>
            </div>
        </section>
    )
}
