import { MATERIAL_TYPES } from '@/lib/constants'

export interface StoreFilterState {
  q: string
  tipo: string
  disciplina: string
  assunto: string
  page: number
}

export type StoreSearchParamsInput = { [key: string]: string | string[] | undefined } | undefined

// Lê e valida os query params da loja (?q, ?tipo, ?disciplina, ?assunto, ?pagina)
export function parseStoreParams(sp: StoreSearchParamsInput): StoreFilterState {
  const get = (k: string) => {
    const v = sp?.[k]
    return typeof v === 'string' ? v : ''
  }
  const tipoRaw = get('tipo')
  return {
    q: get('q'),
    tipo: MATERIAL_TYPES.some(m => m.slug === tipoRaw) ? tipoRaw : '',
    disciplina: get('disciplina'),
    assunto: get('assunto'),
    page: Math.max(1, parseInt(get('pagina'), 10) || 1),
  }
}

// Monta a query string preservando filtros (usado nos links de paginação)
export function storeHref(basePath: string, state: StoreFilterState, page?: number): string {
  const params = new URLSearchParams()
  if (state.q.trim()) params.set('q', state.q.trim())
  if (state.tipo) params.set('tipo', state.tipo)
  if (state.disciplina) params.set('disciplina', state.disciplina)
  if (state.assunto) params.set('assunto', state.assunto)
  if (page && page > 1) params.set('pagina', String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}
