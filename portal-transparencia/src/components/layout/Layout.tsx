import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import ThemeToggle from '../ThemeToggle';

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="md:hidden flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Portal da Transparência</span>
          </div>
          <div className="hidden md:flex flex-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
