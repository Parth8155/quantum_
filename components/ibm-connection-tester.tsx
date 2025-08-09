import React, { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle, XCircle, Loader2, Wifi, WifiOff } from 'lucide-react'

interface ConnectionStatus {
    success: boolean
    message?: string
    error?: string
    token_status?: string
    api_endpoint?: string
    details?: string
}

export function IBMQuantumConnectionTester() {
    const [testing, setTesting] = useState(false)
    const [status, setStatus] = useState<ConnectionStatus | null>(null)

    const testConnection = async () => {
        setTesting(true)
        setStatus(null)

        try {
            const response = await fetch('/api/quantum/test-connection')
            const result = await response.json()
            setStatus(result)
        } catch (error) {
            setStatus({
                success: false,
                error: 'Failed to test connection',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        } finally {
            setTesting(false)
        }
    }

    const getStatusIcon = () => {
        if (testing) return <Loader2 className="h-4 w-4 animate-spin" />
        if (!status) return <Wifi className="h-4 w-4" />
        return status.success ?
            <CheckCircle className="h-4 w-4 text-green-500" /> :
            <XCircle className="h-4 w-4 text-red-500" />
    }

    const getStatusBadge = () => {
        if (testing) return <Badge variant="secondary">Testing...</Badge>
        if (!status) return <Badge variant="outline">Not Tested</Badge>
        return status.success ?
            <Badge variant="default" className="bg-green-500">Connected</Badge> :
            <Badge variant="destructive">Failed</Badge>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getStatusIcon()}
                    IBM Quantum Connection Test
                </CardTitle>
                <CardDescription>
                    Verify your IBM Quantum API connection and token validity
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={testConnection}
                        disabled={testing}
                        className="w-full sm:w-auto"
                    >
                        {testing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Testing Connection...
                            </>
                        ) : (
                            <>
                                <Wifi className="h-4 w-4 mr-2" />
                                Test IBM Quantum Connection
                            </>
                        )}
                    </Button>
                    {getStatusBadge()}
                </div>

                {status && (
                    <div className="space-y-2">
                        {status.success ? (
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                                    <CheckCircle className="h-4 w-4" />
                                    {status.message}
                                </div>
                                {status.api_endpoint && (
                                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                                        Connected to: {status.api_endpoint}
                                    </p>
                                )}
                                {status.token_status && (
                                    <p className="text-sm text-green-600 dark:text-green-300">
                                        Token Status: {status.token_status}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium">
                                    <XCircle className="h-4 w-4" />
                                    {status.error || 'Connection Failed'}
                                </div>
                                {status.details && (
                                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                        {status.details}
                                    </p>
                                )}
                                {status.token_status === 'invalid' && (
                                    <div className="mt-2 text-sm text-red-600 dark:text-red-300">
                                        <p className="font-medium">Troubleshooting steps:</p>
                                        <ul className="list-disc list-inside mt-1 space-y-1">
                                            <li>Verify your IBM Quantum API token in .env.local</li>
                                            <li>Check if your IBM Quantum account is active</li>
                                            <li>Ensure you have access to IBM Quantum services</li>
                                            <li>Try regenerating your API token from IBM Quantum Platform</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="text-sm text-muted-foreground">
                    <p>This test verifies:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>IBM Quantum API token validity</li>
                        <li>Network connectivity to IBM servers</li>
                        <li>Access to quantum backends</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
