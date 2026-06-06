// ============================================================
// drug-interaction.ts — ICU Helper Drug Interaction Checker
// ============================================================

export interface InteractionResult {
  drug1: string
  drug2: string
  severity: 'major' | 'moderate' | 'minor' | 'none'
  effect: string
  management: string
}

export interface DrugEntry {
  name: string
  interactions?: {
    major?: Array<{ drug?: string; effect?: string; management?: string } | string>
    moderate?: Array<{ drug?: string; effect?: string; management?: string } | string>
    minor?: Array<{ drug?: string; effect?: string; management?: string } | string>
  }
}

// ─── Helpers ─────────────────────────────────────────────────

type SeverityLevel = 'major' | 'moderate' | 'minor'

const SEVERITY_ORDER: SeverityLevel[] = ['major', 'moderate', 'minor']

function normStr(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getInteractionName(entry: { drug?: string; effect?: string; management?: string } | string): string {
  if (typeof entry === 'string') return entry
  return entry.drug ?? ''
}

function getInteractionEffect(entry: { drug?: string; effect?: string; management?: string } | string): string {
  if (typeof entry === 'string') return ''
  return entry.effect ?? ''
}

function getInteractionManagement(entry: { drug?: string; effect?: string; management?: string } | string): string {
  if (typeof entry === 'string') return ''
  return entry.management ?? ''
}

/**
 * Try to find interaction of `srcDrug` with `targetName` (drug name string)
 * in `srcEntry.interactions`. Returns result or null.
 */
function findInteractionInEntry(
  srcEntry: DrugEntry,
  targetKey: string,
  targetEntry: DrugEntry,
): InteractionResult | null {
  const interactions = srcEntry.interactions
  if (!interactions) return null

  const targetNorm = normStr(targetEntry.name)
  const targetKeyNorm = normStr(targetKey)

  for (const severity of SEVERITY_ORDER) {
    const list = interactions[severity]
    if (!list) continue
    for (const item of list) {
      const interName = getInteractionName(item)
      const interNorm = normStr(interName)
      if (interNorm && (interNorm === targetNorm || interNorm === targetKeyNorm || targetNorm.includes(interNorm) || interNorm.includes(targetNorm))) {
        return {
          drug1: srcEntry.name,
          drug2: targetEntry.name,
          severity,
          effect: getInteractionEffect(item),
          management: getInteractionManagement(item),
        }
      }
    }
  }
  return null
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Check interaction between two drugs (bidirectional).
 */
export function checkInteraction(
  drug1Key: string,
  drug2Key: string,
  drugDb: Record<string, DrugEntry>,
): InteractionResult {
  const entry1 = drugDb[drug1Key]
  const entry2 = drugDb[drug2Key]

  if (!entry1 || !entry2) {
    return {
      drug1: entry1?.name ?? drug1Key,
      drug2: entry2?.name ?? drug2Key,
      severity: 'none',
      effect: '',
      management: '',
    }
  }

  // drug1 → drug2
  const r1 = findInteractionInEntry(entry1, drug2Key, entry2)
  if (r1) return r1

  // drug2 → drug1
  const r2 = findInteractionInEntry(entry2, drug1Key, entry1)
  if (r2) {
    // Swap names to maintain drug1/drug2 labelling order from caller
    return {
      drug1: entry1.name,
      drug2: entry2.name,
      severity: r2.severity,
      effect: r2.effect,
      management: r2.management,
    }
  }

  return {
    drug1: entry1.name,
    drug2: entry2.name,
    severity: 'none',
    effect: '',
    management: '',
  }
}

/**
 * Check all pairwise interactions for an array of drug keys.
 * Returns only results with severity !== 'none', sorted major-first.
 */
export function checkMultipleInteractions(
  drugKeys: string[],
  drugDb: Record<string, DrugEntry>,
): InteractionResult[] {
  const results: InteractionResult[] = []

  for (let i = 0; i < drugKeys.length; i++) {
    for (let j = i + 1; j < drugKeys.length; j++) {
      const result = checkInteraction(drugKeys[i]!, drugKeys[j]!, drugDb)
      if (result.severity !== 'none') {
        results.push(result)
      }
    }
  }

  const severityIndex = (s: InteractionResult['severity']): number => {
    if (s === 'none') return SEVERITY_ORDER.length
    return SEVERITY_ORDER.indexOf(s)
  }
  return results.sort((a, b) => severityIndex(a.severity) - severityIndex(b.severity))
}

/**
 * Render interaction results into a DOM container.
 */
export function renderInteractionPanel(containerId: string, results: InteractionResult[]): void {
  const container = document.getElementById(containerId)
  if (!container) return

  const resultsDiv = container.querySelector<HTMLElement>('.interaction-results')
  const target = resultsDiv ?? container

  if (results.length === 0) {
    target.innerHTML = '<div style="padding:10px 4px;color:var(--muted,#6b7280);font-size:13px;">✅ Tidak ditemukan interaksi signifikan dalam database</div>'
    return
  }

  const severityLabel: Record<string, string> = {
    major: 'MAJOR',
    moderate: 'MODERATE',
    minor: 'MINOR',
  }

  target.innerHTML = results
    .map(r => {
      const cls = `interaction-card interaction-${r.severity}`
      const badgeCls = `interaction-badge ${r.severity}`
      const managementHtml = r.management
        ? `<div style="margin-top:4px;font-size:12px;color:var(--muted,#6b7280)"><strong>Manajemen:</strong> ${r.management}</div>`
        : ''
      return `<div class="${cls}">
  <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
    <span class="${badgeCls}">${severityLabel[r.severity] ?? r.severity.toUpperCase()}</span>
    <span style="font-weight:600;font-size:13px;">${r.drug1} × ${r.drug2}</span>
  </div>
  ${r.effect ? `<div style="font-size:13px;">${r.effect}</div>` : ''}
  ${managementHtml}
</div>`
    })
    .join('')
}

// ─── UI Builder ──────────────────────────────────────────────

/**
 * Initialize the Drug Interaction Checker UI into the given container element.
 */
export function initInteractionChecker(
  containerId: string,
  drugDb: Record<string, DrugEntry>,
): void {
  const container = document.getElementById(containerId)
  if (!container) return

  const drugKeys = Object.keys(drugDb)

  // Build datalist options
  const datalistId = `${containerId}-datalist`
  const datalistOptions = drugKeys
    .map(k => `<option value="${k}">`)
    .join('')

  container.innerHTML = `
<datalist id="${datalistId}">${datalistOptions}</datalist>
<div class="drug-checker-wrap" id="${containerId}-inputs">
  <input class="drug-checker-input calc-input" type="text" list="${datalistId}" placeholder="Obat 1 (mis. norepinefrin)" autocomplete="off">
  <input class="drug-checker-input calc-input" type="text" list="${datalistId}" placeholder="Obat 2 (mis. midazolam)" autocomplete="off">
</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
  <button class="calc-btn" id="${containerId}-add-btn" style="font-size:12px;padding:6px 12px;">+ Tambah Obat</button>
  <button class="calc-btn" id="${containerId}-check-btn" style="font-size:12px;padding:6px 12px;">⚠️ Cek Interaksi</button>
  <button class="calc-btn" id="${containerId}-clear-btn" style="font-size:12px;padding:6px 12px;background:var(--muted,#6b7280);">✕ Reset</button>
</div>
<div class="interaction-results" id="${containerId}-results"></div>
`

  const inputsWrap = container.querySelector<HTMLElement>(`#${containerId}-inputs`)!
  const addBtn = container.querySelector<HTMLButtonElement>(`#${containerId}-add-btn`)!
  const checkBtn = container.querySelector<HTMLButtonElement>(`#${containerId}-check-btn`)!
  const clearBtn = container.querySelector<HTMLButtonElement>(`#${containerId}-clear-btn`)!
  const resultsDiv = container.querySelector<HTMLElement>(`#${containerId}-results`)!

  let inputCount = 2

  addBtn.addEventListener('click', () => {
    if (inputCount >= 4) return
    inputCount++
    const inp = document.createElement('input')
    inp.className = 'drug-checker-input calc-input'
    inp.type = 'text'
    inp.setAttribute('list', datalistId)
    inp.placeholder = `Obat ${inputCount} (opsional)`
    inp.autocomplete = 'off'
    inputsWrap.appendChild(inp)
    if (inputCount >= 4) addBtn.disabled = true
  })

  clearBtn.addEventListener('click', () => {
    // Remove extra inputs back to 2
    const allInputs = inputsWrap.querySelectorAll<HTMLInputElement>('input')
    allInputs.forEach((inp, idx) => {
      if (idx < 2) {
        inp.value = ''
      } else {
        inp.remove()
      }
    })
    inputCount = 2
    addBtn.disabled = false
    resultsDiv.innerHTML = ''
  })

  checkBtn.addEventListener('click', () => {
    const allInputs = inputsWrap.querySelectorAll<HTMLInputElement>('input')
    const selectedKeys: string[] = []

    allInputs.forEach(inp => {
      const val = inp.value.trim().toLowerCase()
      if (!val) return
      // Match by key or by name
      if (drugDb[val]) {
        selectedKeys.push(val)
      } else {
        // Try fuzzy match by name
        const matched = drugKeys.find(k => normStr(drugDb[k]!.name) === normStr(val) || k === normStr(val))
        if (matched) selectedKeys.push(matched)
      }
    })

    if (selectedKeys.length < 2) {
      resultsDiv.innerHTML = '<div style="padding:10px 4px;color:var(--muted,#6b7280);font-size:13px;">⚠️ Masukkan minimal 2 nama obat yang valid.</div>'
      return
    }

    const results = checkMultipleInteractions(selectedKeys, drugDb)
    renderInteractionPanel(`${containerId}-results`, results)
  })
}

// ─── Global Expose ───────────────────────────────────────────

declare global {
  interface Window {
    initDrugInteractionChecker: typeof initInteractionChecker
  }
}

window.initDrugInteractionChecker = initInteractionChecker
