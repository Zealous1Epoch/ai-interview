import { create } from 'zustand'
import { dimensions, type Dimension } from '../data/dimensions'

export type PreviewMode = 'browse' | 'live'
export type DemoType = 'marketing' | 'dashboard' | 'blog'

export interface ConfigState {
  dimensions: Dimension[]
  selections: Record<string, string | number | null>
  activeDimensionId: string | null
  previewMode: PreviewMode
  demoType: DemoType

  setActiveDimension: (id: string | null) => void
  setPreviewMode: (mode: PreviewMode) => void
  setDemoType: (type: DemoType) => void
  selectOption: (dimensionId: string, optionId: string) => void
  setSliderValue: (dimensionId: string, value: number) => void
  resetAll: () => void
  exportConfig: () => string
  importConfig: (json: string) => void
}

function buildInitialSelections(): Record<string, string | number | null> {
  const sel: Record<string, string | number | null> = {}
  for (const dim of dimensions) {
    if (dim.controlType === 'slider' && dim.sliderConfig) {
      sel[dim.id] = dim.sliderConfig.defaultValue
    } else {
      sel[dim.id] = null
    }
  }
  return sel
}

const initialSelections = buildInitialSelections()

export const useConfigStore = create<ConfigState>((set, get) => ({
  dimensions,
  selections: { ...initialSelections },
  activeDimensionId: null,
  previewMode: 'live',
  demoType: 'marketing',

  setActiveDimension: (id) =>
    set({ activeDimensionId: id, previewMode: 'browse' }),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  setDemoType: (type) => set({ demoType: type }),

  selectOption: (dimensionId, optionId) =>
    set((state) => ({
      selections: { ...state.selections, [dimensionId]: optionId },
      previewMode: 'live',
    })),

  setSliderValue: (dimensionId, value) =>
    set((state) => ({
      selections: { ...state.selections, [dimensionId]: value },
    })),

  resetAll: () =>
    set({
      selections: { ...initialSelections },
      activeDimensionId: null,
      previewMode: 'live',
    }),

  exportConfig: () => JSON.stringify(get().selections, null, 2),

  importConfig: (json) => {
    try {
      const parsed = JSON.parse(json)
      set({ selections: { ...initialSelections, ...parsed } })
    } catch { /* invalid JSON, ignore */ }
  },
}))
