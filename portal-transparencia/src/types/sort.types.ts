export interface SortOption {
  label: string
  value: string
}

export interface SortSelectorProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
}