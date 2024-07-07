import { atom } from 'jotai'

export type Contexts = "OVERALL" | "ICS" | "SBP" | "MK" | "PROF" | "PBLI" | "PC"

export const currentFormIdAtom = atom<string | undefined>(undefined)
export const selectedResponseIdAtom = atom<string | undefined>(undefined)
export const selectedFormCodeIdAtom = atom<string | undefined>(undefined)
export const selectedContextAtom = atom<Contexts>("OVERALL")