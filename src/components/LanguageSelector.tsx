import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <Globe className="w-5 h-5" />
        <span>{i18n.language === 'pt-BR' ? 'PT-BR' : 'EN'}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
        <div className="py-1" role="menu">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => changeLanguage('pt-BR')}
          >
            Português (Brasil)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
