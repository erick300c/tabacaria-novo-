import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { icon: LayoutDashboard, label: t('common.dashboard'), path: '/' },
    { icon: Package, label: t('common.inventory'), path: '/inventory' },
    { icon: ShoppingCart, label: t('common.sales'), path: '/sales' },
    { icon: FileText, label: t('common.reports'), path: '/reports' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Pro</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-l-4 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-6 space-y-4">
        <LanguageSelector />
        <button className="flex items-center text-gray-700 hover:text-red-500">
          <LogOut className="w-5 h-5 mr-3" />
          {t('common.logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
