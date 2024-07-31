import { atom } from 'jotai'

export interface Breadcrumb {
  href: string;
  label: string;
}

export const breadcrumbsAtom = atom<Breadcrumb[]>([])