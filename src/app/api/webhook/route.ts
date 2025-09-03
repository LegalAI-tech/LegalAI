import { NextResponse } from "next/server"

const DEFAULT_WEBHOOK = "https://anubrataguin.app.n8n.cloud/webhook-test/ce8fcade-95db-4110-97fa-daa5ace8da16"

function extractAssistantText(data: any): string | null {
  if (!data) return null
  if (typeof data === "string") return data
  if (typeof data === "number" || typeof data === "boolean") return String(data)

  const preferredKeys = [
    "text",
    "message",
    "reply",
    "result",
    "body",
    "data",
    "response",
    "output",
    "answer",
  ]

  if (Array.isArray(data) && data.length > 0) {
    const first = data[0]
    if (first && typeof first === "object") {
      if (first.json) return extractAssistantText(first.json)
      if (first.data) return extractAssistantText(first.data)
      if (first.body) return extractAssistantText(first.body)
    }
  }

  if (typeof data === "object") {
    for (const key of preferredKeys) {
      if (key in data) {
        const val = data[key]
        if (typeof val === "string" && val.trim()) return val
        if (typeof val === "object") {
          const nested = extractAssistantText(val)
          if (nested) return nested
        }
      }
    }

    // Recursively collect candidate strings
    const candidates: string[] = []
    function walk(obj: any, depth = 0) {
      if (!obj || depth > 6) return
      if (typeof obj === "string") {
        const s = obj.trim()
        if (s) candidates.push(s)
        return
      }
      if (typeof obj === "number" || typeof obj === "boolean") {
        candidates.push(String(obj))
        return
      }
      if (Array.isArray(obj)) {
        for (const item of obj) walk(item, depth + 1)
        return
      }
      if (typeof obj === "object") {
        for (const k of Object.keys(obj)) {
          try {
            walk(obj[k], depth + 1)
          } catch (e) {
          }
        }
      }
    }

    walk(data)

    if (candidates.length === 0) return null

    candidates.sort((a, b) => b.length - a.length)
    return candidates[0]
  }

  return null
}

function formatAsParagraph(text: string): string {
  return text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      
      l = l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*/g, '')

      if (/^\d+\./.test(l)) {
        return `\n${l}` 
      }
      
      if (/^[-]/.test(l)) {
        return `\n${l}` 
      }
      return l
    })
    .join(' ')
    
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .trim()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const webhookUrl = process.env.N8N_WEBHOOK_URL || DEFAULT_WEBHOOK

    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const contentType = resp.headers.get("content-type") || ""
    let remoteData: any = null
    if (contentType.includes("application/json")) {
      remoteData = await resp.json()
    } else {
      remoteData = await resp.text()
    }

    let extracted = extractAssistantText(remoteData)

    if (extracted && typeof extracted === 'string') {
      const trimmed = extracted.trim()
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const parsed = JSON.parse(trimmed)
          const reparsed = extractAssistantText(parsed)
          if (reparsed) extracted = reparsed
          else if (typeof parsed === 'object' && parsed !== null) {
            // If object has one key, take its value
            const keys = Object.keys(parsed)
            if (keys.length === 1) {
              const v = parsed[keys[0]]
              if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') extracted = String(v)
            }
          }
        } catch (e) {
         
        }
      }
    }

    const finalText = extracted ? formatAsParagraph(String(extracted)) : ''

    return NextResponse.json({ text: finalText })
  } catch (err) {
    
    console.error("Error forwarding webhook:", err)
    return NextResponse.json({ text: "" }, { status: 502 })
  }
}
