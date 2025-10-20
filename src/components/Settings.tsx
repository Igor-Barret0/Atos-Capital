import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Settings as SettingsIcon, User as UserIcon, Bell as BellIcon } from 'lucide-react';
import { useLanguage, type Language } from '../contexts/LanguageContext';


type TabType = 'general' | 'account' | 'notifications';
type Theme = 'light' | 'dark' | 'system';


const TabButton: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-3 rounded-md transition-colors ${
      active
        ? 'bg-atos-red text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-xs font-medium mt-1">{label}</span>
  </button>
);


const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState<TabType>('general');
 
  // Estado para o tema
  const [theme, setTheme] = useState<Theme>('light');
 
  // Usando o contexto de idioma
  const { language, setLanguage, t } = useLanguage();
 
  // Estado para os dados da conta
  const [account] = useState({
    name: 'Usuário',
    email: 'usuario@exemplo.com',
    password: '********',
    profileImage: ''
  });


  // Estado para notificações
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sound: true
  });


  // Carregar configurações salvas
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);


    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) setLanguage(savedLanguage as Language);


    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, [setLanguage]);


  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
   
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };


  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };


  const handleNotificationChange = (type: keyof typeof notifications, checked: boolean) => {
    const updatedNotifications = { ...notifications, [type]: checked };
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('settings.general')}
            </h3>
           
            {/* Seção de Tema */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('settings.theme')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {/* Tema Claro */}
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    theme === 'light'
                      ? 'border-atos-red bg-atos-red/5 dark:bg-atos-red/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-atos-red/50'
                  }`}
                >
                  <div className="bg-white rounded-md p-2 shadow-sm">
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <p className="text-sm font-medium text-center mt-2">{t('settings.light')}</p>
                </button>


                {/* Tema Escuro */}
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-atos-red bg-atos-red/5 dark:bg-atos-red/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-atos-red/50'
                  }`}
                >
                  <div className="bg-gray-800 rounded-md p-2 shadow-sm">
                    <div className="h-2 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <p className="text-sm font-medium text-center mt-2">{t('settings.dark')}</p>
                </button>


                {/* Tema do Sistema */}
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    theme === 'system'
                      ? 'border-atos-red bg-atos-red/5 dark:bg-atos-red/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-atos-red/50'
                  }`}
                >
                  <div className="bg-gradient-to-r from-white to-gray-800 rounded-md p-2 shadow-sm">
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <p className="text-sm font-medium text-center mt-2">{t('settings.systemTheme')}</p>
                </button>
              </div>
            </div>


            {/* Seletor de Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.language')}
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-atos-red focus:border-transparent"
                >
                  <option value="auto">{t('settings.detectLanguage')}</option>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>
        );
     
      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            </h3>
           
            <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('account.name')}</h4>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-300"></p>
                </div>
              </div>


              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('account.email')}</h4>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-300"></p>
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>
               
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('account.phone')}</h4>
                  <p className="text-base text-gray-900 dark:text-gray-300"></p>
                </div>
              </div>


              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <button
                  className="w-full text-left text-atos-red hover:text-atos-red/90 text-sm font-medium py-2 px-3 -mx-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => console.log('Log out of all devices')}
                >
                  {t('account.logoutAll')}
                </button>
               
                <button
                  className="w-full text-left text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 text-sm font-medium py-2 px-3 -mx-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  onClick={() => {
                    if (window.confirm(t('account.deleteConfirm'))) {
                      console.log('Delete account');
                    }
                  }}
                >
                  {t('account.delete')}
                </button>
              </div>
            </div>
          </div>
        );
     
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('settings.notifications')}
            </h3>
           
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.emailNotifications')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-atos-red"></div>
                </label>
              </div>
             
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.pushNotifications')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-atos-red"></div>
                </label>
              </div>
             
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.sound')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sound}
                    onChange={(e) => handleNotificationChange('sound', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-atos-red"></div>
                </label>
              </div>
            </div>
          </div>
        );
     
      default:
        return null;
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden relative z-[101]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            aria-label={t('settings.close')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
       
        {/* Conteúdo com rolagem */}
        <div className="flex flex-1 overflow-hidden">
          {/* Navegação lateral */}
          <div className="w-32 border-r border-gray-200 dark:border-gray-700 p-3 space-y-2 bg-gray-50 dark:bg-gray-800/50 overflow-y-auto">
            <TabButton
              active={activeTab === 'general'}
              icon={<SettingsIcon className="h-5 w-5" />}
              label={t('settings.general')}
              onClick={() => setActiveTab('general')}
            />
            <TabButton
              active={activeTab === 'account'}
              icon={<UserIcon className={`h-5 w-5 ${activeTab === 'account' ? 'text-white' : 'text-gray-700 dark:text-atos-red'}`} />}
              label={t('settings.account')}
              onClick={() => setActiveTab('account')}
            />
            <TabButton
              active={activeTab === 'notifications'}
              icon={<BellIcon className="h-5 w-5" />}
              label={t('settings.notifications')}
              onClick={() => setActiveTab('notifications')}
            />
          </div>
         
          {/* Conteúdo da aba com rolagem */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
       
        {/* Rodapé removido */}
      </div>
    </div>
  );
};


export default Settings;