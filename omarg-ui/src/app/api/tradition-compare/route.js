import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Helper function to read the mappings
async function getMappings() {
  const jsonDirectory = path.join(process.cwd(), 'public/mappings');
  
  try {
    const fileContents = await fs.readFile(jsonDirectory + '/cross_tradition_mappings.json', 'utf8');
    return JSON.parse(fileContents).cross_tradition_mappings;
  } catch (error) {
    console.error("Error reading cross_tradition_mappings.json", error);
    return null;
  }
}

// In a real app, this would query symbolic_schema.json or symbolic_api.json to resolve specific keywords
// For the MVP engine, we just compare the high-level structural paradigms of the traditions.
export async function POST(request) {
  try {
    const data = await request.json();
    const { sourceTradition, targetTradition, concept } = data;

    if (!sourceTradition || !targetTradition) {
      return NextResponse.json({ error: 'Source and target traditions are required.' }, { status: 400 });
    }

    const mappings = await getMappings();
    
    if (!mappings) {
      return NextResponse.json({ error: 'Failed to load tradition mappings.' }, { status: 500 });
    }

    const sourceData = mappings[sourceTradition];
    const targetData = mappings[targetTradition];

    if (!sourceData) return NextResponse.json({ error: `Tradition not found: ${sourceTradition}` }, { status: 404 });
    if (!targetData) return NextResponse.json({ error: `Tradition not found: ${targetTradition}` }, { status: 404 });

    // Compare RS Operators
    const sourceOps = sourceData.corresponding_operators || [];
    const targetOps = targetData.corresponding_operators || [];
    const sharedOps = sourceOps.filter(op => targetOps.includes(op));
    const disjointSource = sourceOps.filter(op => !targetOps.includes(op));
    const disjointTarget = targetOps.filter(op => !sourceOps.includes(op));

    let translationPath = "";
    if (sharedOps.length > 0) {
      translationPath = `To translate ${sourceTradition} → ${targetTradition}, pivot around shared operator(s) [${sharedOps.join(", ")}]. Map ${sourceData.structural_pattern} to ${targetData.structural_pattern}.`;
    } else {
      translationPath = `No direct shared operators found. To translate, a higher-order transformation from [${sourceOps.join(", ")}] to [${targetOps.join(", ")}] is required.`;
    }

    return NextResponse.json({
      comparison: {
        source: {
          name: sourceTradition,
          structure: sourceData.structural_pattern,
          interpretation: sourceData.recursive_interpretation,
          operators: sourceOps
        },
        target: {
          name: targetTradition,
          structure: targetData.structural_pattern,
          interpretation: targetData.recursive_interpretation,
          operators: targetOps
        },
        analysis: {
          shared_operators: sharedOps,
          epistemological_differences: `${sourceTradition} frames this as '${sourceData.structural_pattern}'; ${targetTradition} frames it as '${targetData.structural_pattern}'.`,
          translation_path: translationPath,
          integration_strategy: `Combine ${sourceTradition}'s ${sourceData.structure_type} with ${targetTradition}'s ${targetData.structure_type} to create a ${sharedOps.length > 0 ? "synthesized" : "orthogonal"} model.`
        }
      }
    });

  } catch (error) {
    console.error('Error in /api/tradition-compare:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
