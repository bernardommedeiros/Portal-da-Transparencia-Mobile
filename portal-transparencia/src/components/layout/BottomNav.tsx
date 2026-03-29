import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Resumo' },
    { to: '/despesas', icon: Receipt, label: 'Despesas' },
    { to: '/orgaos', icon: Building2, label: 'Órgãos' },
    { to: '/fornecedores', icon: Users, label: 'Fornecs' }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-16 h-full transition-colors',
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            )
          }
        >
          <link.icon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
