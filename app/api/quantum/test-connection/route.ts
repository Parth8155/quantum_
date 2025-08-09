import { NextRequest, NextResponse } from 'next/server'
import { validateIBMToken } from '@/lib/server/ibm-quantum-server'

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.IBM_QUANTUM_API_TOKEN
    
    if (!apiToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'IBM_QUANTUM_API_TOKEN not found in environment variables',
          details: 'Please add your IBM Quantum API token to .env.local'
        },
        { status: 400 }
      )
    }

    console.log('Testing IBM Quantum API connection...')
    console.log('Token (first 10 chars):', apiToken.substring(0, 10) + '...')

    // Test the connection
    const isValid = await validateIBMToken(apiToken)
    
    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to IBM Quantum!',
        token_status: 'valid',
        api_endpoint: 'https://runtime-us-east.quantum-computing.ibm.com'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to authenticate with IBM Quantum API',
        token_status: 'invalid',
        details: 'Please check your API token or IBM Quantum account status'
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Error testing IBM connection:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
