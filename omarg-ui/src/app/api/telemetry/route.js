import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Proxy the request to the Python microservice
    const response = await fetch('http://localhost:5001/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Telemetry Bridge Error:", response.status);
      return NextResponse.json({ success: false, error: 'Bridge refused connection' }, { status: 502 });
    }
  } catch (error) {
    console.error("Failed to post telemetry:", error);
    // Even if telemetry fails, we don't want to crash the UI
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
