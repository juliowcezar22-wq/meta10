import { Plus, X, Type, CheckCircle } from 'lucide-react'

export interface QuestionFormData {
  question_type: string
  enunciado: string
  alternatives: { letra: string, texto: string }[]
  gabarito: string
  comentario: string
  difficulty: string
}

interface QuestionFormFieldsProps {
  formData: QuestionFormData
  setFormData: (data: QuestionFormData) => void
}

export function QuestionFormFields({ formData, setFormData }: QuestionFormFieldsProps) {
  const handleAddAlternative = () => {
    if (formData.alternatives.length >= 5) return
    const nextLetra = String.fromCharCode(97 + formData.alternatives.length)
    setFormData({
      ...formData,
      alternatives: [...formData.alternatives, { letra: nextLetra, texto: '' }]
    })
  }

  const handleRemoveAlternative = (index: number) => {
    if (formData.alternatives.length <= 2) return
    const newAlts = formData.alternatives.filter((_, i) => i !== index).map((alt, i) => ({
      ...alt,
      letra: String.fromCharCode(97 + i)
    }))
    let newGabarito = formData.gabarito
    if (!newAlts.find(a => a.letra === newGabarito)) {
      newGabarito = 'a'
    }
    setFormData({ ...formData, alternatives: newAlts, gabarito: newGabarito })
  }

  const handleAltChange = (index: number, val: string) => {
    const newAlts = [...formData.alternatives]
    newAlts[index].texto = val
    setFormData({ ...formData, alternatives: newAlts })
  }

  return (
    <>
      {/* Type Selector */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Tipo de Questão</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, question_type: 'multipla_escolha', gabarito: 'a' })}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.question_type === 'multipla_escolha' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-surface-200 text-surface-500 hover:bg-surface-50'}`}
          >
            <Type className="w-4 h-4" />
            Múltipla Escolha
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, question_type: 'verdadeiro_falso', gabarito: 'verdadeiro' })}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.question_type === 'verdadeiro_falso' ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-surface-200 text-surface-500 hover:bg-surface-50'}`}
          >
            <CheckCircle className="w-4 h-4" />
            Verdadeiro ou Falso
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">Enunciado</label>
        <textarea 
          value={formData.enunciado}
          onChange={(e) => setFormData({ ...formData, enunciado: e.target.value })}
          className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          rows={3}
          required
          minLength={3}
        />
      </div>

      {formData.question_type === 'multipla_escolha' && (
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">Alternativas e Gabarito</label>
          <div className="space-y-3">
            {formData.alternatives.map((alt, index) => (
              <div key={alt.letra} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-colors ${formData.gabarito === alt.letra ? 'border-success-500 bg-success-50/50' : 'border-surface-200 bg-surface-50'}`}>
                <div className="pt-2">
                  <input 
                    type="radio" 
                    name="gabarito" 
                    checked={formData.gabarito === alt.letra}
                    onChange={() => setFormData({ ...formData, gabarito: alt.letra })}
                    className="w-4 h-4 text-success-500 focus:ring-success-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  <span className="font-bold text-surface-500 uppercase w-6 shrink-0">{alt.letra})</span>
                  <input 
                    type="text" 
                    required 
                    value={alt.texto} 
                    onChange={(e) => handleAltChange(index, e.target.value)} 
                    placeholder={`Alternativa ${alt.letra.toUpperCase()}`}
                    className="flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  />
                </div>
                {index >= 2 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveAlternative(index)}
                    className="p-2 text-surface-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors mt-1 shrink-0"
                    title="Remover alternativa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {formData.alternatives.length < 5 && (
            <button 
              type="button" 
              onClick={handleAddAlternative}
              className="mt-3 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar Alternativa
            </button>
          )}
        </div>
      )}

      {formData.question_type === 'verdadeiro_falso' && (
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">Gabarito</label>
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.gabarito === 'verdadeiro' ? 'border-success-500 bg-success-50 text-success-700 font-bold' : 'border-surface-200 hover:bg-surface-50 text-surface-600'}`}>
              <input 
                type="radio" 
                name="gabarito_vf" 
                value="verdadeiro"
                checked={formData.gabarito === 'verdadeiro'}
                onChange={(e) => setFormData({ ...formData, gabarito: e.target.value })}
                className="hidden"
              />
              Verdadeiro
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.gabarito === 'falso' ? 'border-danger-500 bg-danger-50 text-danger-700 font-bold' : 'border-surface-200 hover:bg-surface-50 text-surface-600'}`}>
              <input 
                type="radio" 
                name="gabarito_vf" 
                value="falso"
                checked={formData.gabarito === 'falso'}
                onChange={(e) => setFormData({ ...formData, gabarito: e.target.value })}
                className="hidden"
              />
              Falso
            </label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Dificuldade</label>
          <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Comentário (opcional)</label>
          <textarea value={formData.comentario} onChange={(e) => setFormData({ ...formData, comentario: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" rows={2} />
        </div>
      </div>
    </>
  )
}
