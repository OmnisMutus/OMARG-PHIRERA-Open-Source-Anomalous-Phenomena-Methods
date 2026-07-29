import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Basic schema validation for a personal ontology
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { name, mapping } = data;
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Ontology must include a string "name"' }, { status: 400 });
    }

    if (!mapping || typeof mapping !== 'object') {
      return NextResponse.json({ error: 'Ontology must include a "mapping" object' }, { status: 400 });
    }

    // Check required fields in the mapping
    const requiredFields = ['structure_type', 'structural_pattern', 'recursive_interpretation', 'corresponding_operators', 'core_concept'];
    for (const field of requiredFields) {
      if (!mapping[field]) {
        return NextResponse.json({ error: `Missing required field in mapping: ${field}` }, { status: 400 });
      }
    }

    if (!Array.isArray(mapping.corresponding_operators)) {
      return NextResponse.json({ error: '"corresponding_operators" must be an array' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ontology validated successfully',
      ontology: { [name]: mapping }
    });

  } catch (error) {
    console.error('Error validating ontology:', error);
    return NextResponse.json({ error: 'Invalid JSON format or processing error' }, { status: 400 });
  }
}
