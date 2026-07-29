import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

async function getMappings() {
  const jsonDirectory = path.join(process.cwd(), 'public/mappings');
  try {
    const crossContents = await fs.readFile(jsonDirectory + '/cross_tradition_mappings.json', 'utf8');
    const schemaContents = await fs.readFile(jsonDirectory + '/symbolic_schema.json', 'utf8');
    return {
      cross: JSON.parse(crossContents).cross_tradition_mappings,
      schema: JSON.parse(schemaContents).abstract_mapping
    };
  } catch (error) {
    console.error("Error reading mapping files", error);
    return null;
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { sourceTradition, targetTradition, text, concept } = data;

    if (!sourceTradition || !targetTradition) {
      return NextResponse.json({ error: 'Source and target traditions are required.' }, { status: 400 });
    }

    const mappings = await getMappings();
    if (!mappings) {
      return NextResponse.json({ error: 'Failed to load tradition mappings.' }, { status: 500 });
    }

    const sourceData = mappings.cross[sourceTradition];
    const targetData = mappings.cross[targetTradition];

    if (!sourceData) return NextResponse.json({ error: `Tradition not found: ${sourceTradition}` }, { status: 404 });
    if (!targetData) return NextResponse.json({ error: `Tradition not found: ${targetTradition}` }, { status: 404 });

    const sourceOps = sourceData.corresponding_operators || [];
    const targetOps = targetData.corresponding_operators || [];
    const sharedOps = sourceOps.filter(op => targetOps.includes(op));

    // Concept resolution if text/concept provided
    let conceptMatch = null;
    let conceptTranslation = null;

    const queryTerm = (concept || text || "").toLowerCase();
    if (queryTerm) {
      for (const [key, mapping] of Object.entries(mappings.schema)) {
        if (queryTerm.includes(key.toLowerCase()) || key.toLowerCase().includes(queryTerm)) {
          conceptMatch = key;
          const sourceConcept = mapping[sourceTradition] || mapping["Kabbalah"] || key;
          const targetConcept = mapping[targetTradition] || mapping["Zen"] || mapping["Dynamical Systems"] || key;
          const rsOp = mapping["Recursive_Symbolics"] || "Operator: General";
          
          conceptTranslation = {
            matched_key: key,
            source_projection: sourceConcept,
            target_projection: targetConcept,
            rs_operator: rsOp,
            narrative: `Your state '${key}' maps to ${sourceTradition}'s [${sourceConcept}] and ${targetTradition}'s [${targetConcept}] via ${rsOp}.`
          };
          break;
        }
      }
    }

    let translationPath = "";
    if (sharedOps.length > 0) {
      translationPath = `To translate ${sourceTradition} → ${targetTradition}, pivot around shared operator(s) [${sharedOps.join(", ")}]. Map ${sourceData.structural_pattern} to ${targetData.structural_pattern}.`;
    } else {
      translationPath = `No direct shared operators found. To translate, a higher-order transformation from [${sourceOps.join(", ")}] to [${targetOps.join(", ")}] is required.`;
    }

    const response = NextResponse.json({
      ephemeral_status: "STATISTICALLY_STATELESS_NO_LOGGING",
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
        concept_translation: conceptTranslation,
        analysis: {
          shared_operators: sharedOps,
          epistemological_differences: `${sourceTradition} frames this as '${sourceData.structural_pattern}'; ${targetTradition} frames it as '${targetData.structural_pattern}'.`,
          translation_path: translationPath,
          integration_strategy: `Combine ${sourceTradition}'s ${sourceData.structure_type} with ${targetTradition}'s ${targetData.structure_type} to create a ${sharedOps.length > 0 ? "synthesized" : "orthogonal"} model.`
        }
      }
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;

  } catch (error) {
    console.error('Error in /api/tradition-compare:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
