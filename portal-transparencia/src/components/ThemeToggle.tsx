import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#16181C] border border-[#EFF3F4] dark:border-[#333639] shadow-sm hover:bg-[#F7F9F9] dark:hover:bg-[#202327] transition-all"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-[#0F1419]" />
      ) : (
        <SunIcon className="h-5 w-5 text-[#E7E9EA]" />
      )}
    </button>
  )
}
