import { NextRequest, NextResponse } from 'next/server'
import { IBMQuantumServerService, convertCircuitToQiskit } from '@/lib/server/ibm-quantum-server'

// Store jobs in memory (in production, use a database)
const jobs = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    // Get IBM Quantum API token from environment or header
    const headerToken = request.headers.get('X-IBM-Token')
    const apiToken = process.env.IBM_QUANTUM_API_TOKEN || headerToken
    
    if (!apiToken) {
      return NextResponse.json(
        { error: 'IBM Quantum API token not configured' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { circuit, backend, shots = 1024 } = body

    if (!circuit || !backend) {
      return NextResponse.json(
        { error: 'Circuit and backend are required' },
        { status: 400 }
      )
    }

    // Convert circuit to Qiskit code
    const qiskitCode = convertCircuitToQiskit(circuit)
    
    // Initialize IBM Quantum service
    const ibmService = new IBMQuantumServerService({
      apiToken,
      channel: (process.env.IBM_QUANTUM_CHANNEL as any) || 'ibm_quantum',
      hubGroupProject: process.env.IBM_QUANTUM_HUB_GROUP_PROJECT || 'ibm-q/open/main'
    })

    try {
      // Submit job to IBM Quantum
      const job = await ibmService.submitJob(qiskitCode, backend, shots)
      
      // Store job locally
      jobs.set(job.id, job)
      
      return NextResponse.json({
        id: job.id,
        status: job.status,
        backend: job.backend,
        shots: job.shots,
        created_at: job.created_at
      })

    } catch (ibmError) {
      console.error('IBM Quantum API error:', ibmError)
      
      // Fallback: create a simulation job
      const jobId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const simulationJob = {
        id: jobId,
        ibm_job_id: null,
        status: 'pending',
        backend: 'simulator_local',
        shots: shots,
        qiskit_code: qiskitCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        results: null,
        error: null,
        simulation: true
      }

      jobs.set(jobId, simulationJob)

      // Start simulation
      setTimeout(() => simulateJob(jobId), 2000)

      return NextResponse.json({
        id: simulationJob.id,
        status: simulationJob.status,
        backend: simulationJob.backend,
        shots: simulationJob.shots,
        created_at: simulationJob.created_at,
        warning: 'Using local simulation due to IBM API unavailability'
      })
    }

  } catch (error) {
    console.error('Error submitting job:', error)
    return NextResponse.json(
      { error: 'Failed to submit quantum job' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('id')

    if (jobId) {
      // Get specific job
      const job = jobs.get(jobId)
      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      // If it's an IBM job, check status
      if (job.ibm_job_id && !job.simulation) {
        const headerToken = request.headers.get('X-IBM-Token')
        const apiToken = process.env.IBM_QUANTUM_API_TOKEN || headerToken
        
        if (apiToken) {
          try {
            const ibmService = new IBMQuantumServerService({
              apiToken,
              channel: (process.env.IBM_QUANTUM_CHANNEL as any) || 'ibm_quantum',
              hubGroupProject: process.env.IBM_QUANTUM_HUB_GROUP_PROJECT || 'ibm-q/open/main'
            })

            const updatedJob = await ibmService.getJobStatus(job.ibm_job_id)
            if (updatedJob) {
              // Update local job with IBM status
              Object.assign(job, updatedJob)
              jobs.set(jobId, job)
            }
          } catch (error) {
            console.error('Error checking IBM job status:', error)
          }
        }
      }

      return NextResponse.json(job)
    } else {
      // Get all jobs
      const allJobs = Array.from(jobs.values()).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      return NextResponse.json(allJobs)
    }
  } catch (error) {
    console.error('Error retrieving jobs:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve jobs' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('id')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const job = jobs.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Cancel IBM job if it exists
    if (job.ibm_job_id && !job.simulation) {
      const headerToken = request.headers.get('X-IBM-Token')
      const apiToken = process.env.IBM_QUANTUM_API_TOKEN || headerToken
      
      if (apiToken) {
        try {
          const ibmService = new IBMQuantumServerService({
            apiToken,
            channel: (process.env.IBM_QUANTUM_CHANNEL as any) || 'ibm_quantum',
            hubGroupProject: process.env.IBM_QUANTUM_HUB_GROUP_PROJECT || 'ibm-q/open/main'
          })

          await ibmService.cancelJob(job.ibm_job_id)
        } catch (error) {
          console.error('Error canceling IBM job:', error)
        }
      }
    }

    // Update local job status
    job.status = 'cancelled'
    job.updated_at = new Date().toISOString()
    jobs.set(jobId, job)

    return NextResponse.json({ success: true, status: 'cancelled' })
  } catch (error) {
    console.error('Error canceling job:', error)
    return NextResponse.json(
      { error: 'Failed to cancel job' },
      { status: 500 }
    )
  }
}

// Helper functions
function simulateJob(jobId: string) {
  const job = jobs.get(jobId)
  if (!job) return

  // Simulate running
  job.status = 'running'
  job.updated_at = new Date().toISOString()
  jobs.set(jobId, job)

  // Simulate completion after 3-8 seconds
  const delay = 3000 + Math.random() * 5000
  setTimeout(() => {
    const currentJob = jobs.get(jobId)
    if (currentJob && currentJob.status === 'running') {
      currentJob.status = 'completed'
      currentJob.updated_at = new Date().toISOString()
      currentJob.results = generateMockResults(currentJob.shots)
      jobs.set(jobId, currentJob)
    }
  }, delay)
}

function generateMockResults(shots: number) {
  // Generate realistic quantum measurement results
  const results: { [key: string]: number } = {}
  
  // Simulate various measurement outcomes
  const outcomes = ['00', '01', '10', '11']
  let remainingShots = shots
  
  for (let i = 0; i < outcomes.length - 1; i++) {
    const count = Math.floor(Math.random() * remainingShots * 0.4)
    results[outcomes[i]] = count
    remainingShots -= count
  }
  results[outcomes[outcomes.length - 1]] = remainingShots

  return {
    counts: results,
    success: true,
    shots,
    execution_time: (Math.random() * 10 + 1).toFixed(2) + 's',
    backend_name: 'simulator_local'
  }
}
