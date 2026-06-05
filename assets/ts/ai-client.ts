// ============================================================
// ai-client.ts — Gemini AI Client untuk ICU Helper
// ============================================================

import { GoogleGenAI } from '@google/genai'

// ─── Types ───────────────────────────────────────────────────

export interface AiStreamCallbacks {
  onChunk: (text: string) => void
  onDone:  (fullText: string) => void
  onError: (err: Error) => void
}

export interface AiRequestOptions {
  systemInstruction?: string
  temperature?: number
  maxOutputTokens?: number
}

// ─── Singleton client ────────────────────────────────────────

let _client: GoogleGenAI | null = null

function getClient(): GoogleGenAI {
  if (!_client) {
    const key = (window as unknown as Record<string, string>)['GEMINI_API_KEY']
      ?? (import.meta as unknown as { env?: Record<string, string> }).env?.['VITE_GEMINI_API_KEY']
      ?? ''
    if (!key) throw new Error('GEMINI_API_KEY tidak tersedia. Tambahkan ke environment variable VITE_GEMINI_API_KEY.')
    _client = new GoogleGenAI({ apiKey: key })
  }
  return _client
}

// ─── Default system instruction ──────────────────────────────

const ICU_SYSTEM_INSTRUCTION = `Kamu adalah asisten klinis ICU yang membantu dokter dan tenaga medis Indonesia.
Berikan respons dalam Bahasa Indonesia yang jelas, ringkas, dan berbasis evidence-based medicine terkini.
Gunakan terminologi medis yang tepat namun tetap mudah dipahami.
Selalu ingatkan bahwa keputusan klinis akhir ada di tangan dokter yang merawat.
Format: gunakan bullet points (•) untuk daftar, **bold** untuk poin penting, dan beri referensi guideline bila relevan.
Batasan: jangan berikan diagnosis definitif — bantu interpretasi data dan saran manajemen awal.`

// ─── Core streaming function ─────────────────────────────────

export async function streamAiResponse(
  prompt: string,
  callbacks: AiStreamCallbacks,
  options: AiRequestOptions = {},
): Promise<void> {
  try {
    const client = getClient()
    const model  = 'gemini-2.0-flash'

    const response = await client.models.generateContentStream({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: options.systemInstruction ?? ICU_SYSTEM_INSTRUCTION,
        temperature:       options.temperature       ?? 0.3,
        maxOutputTokens:   options.maxOutputTokens   ?? 1024,
      },
    })

    let fullText = ''
    for await (const chunk of response) {
      const text = chunk.text ?? ''
      fullText += text
      callbacks.onChunk(text)
    }
    callbacks.onDone(fullText)
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)))
  }
}

// ─── Simple one-shot (non-streaming) ────────────────────────

export async function askAi(
  prompt: string,
  options: AiRequestOptions = {},
): Promise<string> {
  const client = getClient()
  const result = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: options.systemInstruction ?? ICU_SYSTEM_INSTRUCTION,
      temperature:       options.temperature       ?? 0.3,
      maxOutputTokens:   options.maxOutputTokens   ?? 1024,
    },
  })
  return result.text ?? ''
}

// ─── UI helper: render streaming ke elemen DOM ───────────────

export function createAiPanel(containerId: string, title: string): {
  show: () => void
  hide: () => void
  setLoading: (loading: boolean) => void
  appendChunk: (text: string) => void
  setError: (msg: string) => void
  reset: () => void
} {
  const container = document.getElementById(containerId)
  if (!container) throw new Error(`Container #${containerId} tidak ditemukan`)

  // Pastikan panel ada
  let panel = container.querySelector<HTMLElement>('.ai-panel')
  if (!panel) {
    panel = document.createElement('div')
    panel.className = 'ai-panel'
    panel.innerHTML = `
      <div class="ai-panel-header">
        <span class="ai-panel-icon">✦</span>
        <span class="ai-panel-title">${title}</span>
        <span class="ai-panel-badge">Gemini AI</span>
        <span class="ai-panel-disclaimer">· Panduan awal — keputusan klinis ada di dokter</span>
      </div>
      <div class="ai-panel-body"></div>
      <div class="ai-panel-loader hidden">
        <span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span>
        <span style="font-size:11px;color:var(--muted);margin-left:6px">Menganalisis...</span>
      </div>
      <div class="ai-panel-error hidden"></div>`
    container.appendChild(panel)
  }

  const body     = panel.querySelector<HTMLElement>('.ai-panel-body')!
  const loader   = panel.querySelector<HTMLElement>('.ai-panel-loader')!
  const errorEl  = panel.querySelector<HTMLElement>('.ai-panel-error')!

  return {
    show:    () => { panel!.classList.remove('hidden') },
    hide:    () => { panel!.classList.add('hidden') },
    reset:   () => { body.innerHTML = ''; errorEl.innerHTML = ''; errorEl.classList.add('hidden') },
    setLoading: (loading) => {
      loader.classList.toggle('hidden', !loading)
      body.classList.toggle('ai-body-loading', loading)
    },
    appendChunk: (text) => {
      // Convert markdown-lite ke HTML inline
      const current = body.getAttribute('data-raw') ?? ''
      const updated = current + text
      body.setAttribute('data-raw', updated)
      body.innerHTML = renderMarkdownLite(updated)
    },
    setError: (msg) => {
      loader.classList.add('hidden')
      errorEl.textContent = '⚠ ' + msg
      errorEl.classList.remove('hidden')
    },
  }
}

// ─── Markdown lite renderer ───────────────────────────────────

function renderMarkdownLite(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^• (.+)$/gm,     '<li>$1</li>')
    .replace(/^- (.+)$/gm,     '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)+/g, match => `<ul>${match}</ul>`)
    .replace(/\n\n/g,          '</p><p>')
    .replace(/^(?!<[uolh]|<p)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g,      '')
}
