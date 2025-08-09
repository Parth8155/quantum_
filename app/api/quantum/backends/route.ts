import { NextRequest, NextResponse } from 'next/server'
import { IBMQuantumServerService } from '@/lib/server/ibm-quantum-server'

export async function GET(request: NextRequest) {
  try {
    // Get IBM Quantum API token from environment or header
    const headerToken = request.headers.get('X-IBM-Token')
    const apiToken = process.env.IBM_QUANTUM_API_TOKEN || headerToken
    
    if (!apiToken) {
      return NextResponse.json(
        { error: 'IBM Quantum API token not configured. Please add IBM_QUANTUM_API_TOKEN to environment variables.' },
        { status: 401 }
      )
    }

    // Initialize IBM Quantum service
    const ibmService = new IBMQuantumServerService({
      apiToken,
      channel: (process.env.IBM_QUANTUM_CHANNEL as any) || 'ibm_quantum',
      hubGroupProject: process.env.IBM_QUANTUM_HUB_GROUP_PROJECT || 'ibm-q/open/main'
    })

    // Fetch available backends from IBM
    const backends = await ibmService.getAvailableBackends()
    
    return NextResponse.json(backends)
  } catch (error) {
    console.error('Error fetching backends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quantum backends from IBM Quantum' },
      { status: 500 }
    )
  }
}
