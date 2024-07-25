import { atom } from 'jotai'

// Global Forms
export const manageDialogOpenAtom = atom<boolean>(false);
export const manageDialogSelectedAssessmentIdAtom = atom<string | undefined>(undefined)

// Responses Page
export const currentFormIdAtom = atom<string | undefined>(undefined)
export const selectedResponseIdAtom = atom<string | undefined>(undefined)
export const selectedAssessmentIdAtom = atom<string | undefined>(undefined)

