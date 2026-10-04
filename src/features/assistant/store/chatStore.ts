import { create } from 'zustand'
import { insightsService, type ChatTurn } from '@/features/insights/services/insightsService'

interface ChatState {
  turns: ChatTurn[]
  busy: boolean
  error: Error | null
  send: (message: string) => Promise<void>
  reset: () => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  turns: [],
  busy: false,
  error: null,
  async send(message) {
    const question = message.trim()
    if (!question || get().busy) return
    const history = get().turns
    set({ turns: [...history, { role: 'user', text: question }], error: null, busy: true })
    try {
      const res = await insightsService.chat(question, history)
      set((s) => ({ turns: [...s.turns, { role: 'assistant', text: res.answer }], busy: false }))
    } catch (e) {
      set({ error: e as Error, busy: false })
    }
  },
  reset: () => set({ turns: [], busy: false, error: null }),
}))
