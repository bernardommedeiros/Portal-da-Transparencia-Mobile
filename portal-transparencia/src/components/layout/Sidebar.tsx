import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/despesas', icon: Receipt, label: 'Despesas' },
    { to: '/orgaos', icon: Building2, label: 'Órgãos' },
    { to: '/fornecedores', icon: Users, label: 'Fornecedores' }
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-3 px-2 mb-8">
        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Transparência</span>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              )
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
