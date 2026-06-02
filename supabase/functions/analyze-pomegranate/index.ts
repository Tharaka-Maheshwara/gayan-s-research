import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ROBOFLOW_API_KEY = "5ZQYWzl1ALm6kurt5tGB";
const WORKSPACE_NAME = "pomogranate-zvh7x";
const WORKFLOW_ID = "general-segmentation-api-2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let base64 = "";
    let fileName = "image";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const imageFile = formData.get("image") as File | null;

      if (!imageFile) {
        return new Response(JSON.stringify({ error: "No image provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      fileName = imageFile.name;

    } else {
      const body = await req.json();

      if (!body.image) {
        return new Response(JSON.stringify({ error: "No image provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      base64 = body.image.includes(",") ? body.image.split(",")[1] : body.image;
      fileName = body.fileName || "image";
    }

    const apiUrl = `https://serverless.roboflow.com/infer/workflows/${WORKSPACE_NAME}/${WORKFLOW_ID}`;

    const payload = {
      api_key: ROBOFLOW_API_KEY,
      inputs: {
        image: { type: "base64", value: base64 },
      },
      parameters: {
        classes: "Pomegranate, Class 1, Class II",
      },
      use_cache: true,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Roboflow error:", errText);
      return new Response(JSON.stringify({ error: "Roboflow API error", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const processed = processRoboflowResult(result, fileName);

    return new Response(JSON.stringify(processed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function processRoboflowResult(result: unknown, fileName: string) {
  const raw = result as Record<string, unknown>;
  let grade = "Class II";
  let confidence = 0;
  let predictions: unknown[] = [];

  try {
    const outputs = (raw?.outputs as Record<string, unknown>[]) || [];
    const firstOutput = outputs[0] || {};
    const predictionsList = (firstOutput?.predictions as Record<string, unknown>) || {};
    const preds = (predictionsList?.predictions as Record<string, unknown>[]) || [];
    predictions = preds;

    if (preds.length === 0) {
      grade = "Undetected";
      confidence = 0;
    } else {
      const topPred = preds.reduce(
        (best: Record<string, unknown>, curr: Record<string, unknown>) => {
          return (curr.confidence as number) > (best.confidence as number) ? curr : best;
        },
        preds[0]
      );

      confidence = Math.round(((topPred.confidence as number) || 0) * 100);
      const rawClass = ((topPred.class as string) || "").toLowerCase();

      if (rawClass.includes("extra") || rawClass === "pomegranate") {
        grade = "Extra Class";
      } else if (
        rawClass.includes("class 1") ||
        rawClass.includes("class i") ||
        rawClass === "1"
      ) {
        grade = "Class I";
      } else if (
        rawClass.includes("class 2") ||
        rawClass.includes("class ii") ||
        rawClass === "2"
      ) {
        grade = "Class II";
      } else {
        grade = "Class II";
      }
    }
  } catch (e) {
    console.error("Processing error:", e);
  }

  return {
    grade,
    confidence,
    predictions,
    raw: result,
    fileName,
    timestamp: new Date().toISOString(),
  };
}