import React, { useState } from 'react';
import { SidebarProps, MenuItem, ContextMenuState, DeleteConfirmationState } from '../types';
import { Button } from './ui/button';
import { MessageCircle, FileText, Menu, MoreVertical, Trash2, ChevronDown, User, Settings, LogOut as LogOutIcon, ArrowUpRight } from 'lucide-react';
import ContextMenu from './ContextMenu';
import DeleteConfirmation from './DeleteConfirmation';
import dynamic from 'next/dynamic';
import { useLanguage } from '../contexts/LanguageContext';


// Dynamically import Settings with no SSR to avoid hydration issues
const SettingsModal = dynamic(() => import('./Settings'), { ssr: false });


const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar, chats, activeChat, onSelectChat, onDeleteChat, onAddChat }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ isOpen: false, x: 0, y: 0, chatId: null, chatName: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({ isOpen: false, chatId: null, chatName: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useLanguage();


  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const isDarkMode = savedTheme === 'dark' ||
                     (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
   
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  const handleContextMenu = (e: React.MouseEvent, chatId: number, chatName: string): void => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, chatId, chatName });
  };


  const handleDeleteChat = (chatId: number): void => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) setDeleteConfirmation({ isOpen: true, chatId, chatName: chat.name });
  };


  const confirmDelete = () => {
    if (deleteConfirmation.chatId) {
      onDeleteChat(deleteConfirmation.chatId);
      setDeleteConfirmation({ isOpen: false, chatId: null, chatName: '' });
    }
  };


  const closeContextMenu = (): void => setContextMenu(prev => ({ ...prev, isOpen: false }));
  const closeDeleteConfirmation = (): void => setDeleteConfirmation({ isOpen: false, chatId: null, chatName: '' });
  const handleLogout = (): void => console.log('Usuário deslogado');


  const toggleMenu = (e: React.MouseEvent, chatId: number): void => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };


  React.useEffect(() => {
    const handleClickOutside = (): void => { if (openMenuId !== null) setOpenMenuId(null); };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);


  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    const newChat = { id: Date.now(), name: `Chat ${chats.length + 1}`, messages: [] };
    if (onAddChat) onAddChat(newChat);
    onSelectChat(newChat.id);
  };


  const handleNewChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNewChat(e);
  };


  const menuItems: MenuItem[] = [
    { icon: <MessageCircle className="w-5 h-5 dark:text-white" />, label: t('sidebar.newChat'), active: true, onClick: handleNewChatClick },
    { icon: <FileText className="w-5 h-5 dark:text-white" />, label: t('sidebar.reports'), active: false, onClick: () => {} }
  ];


  return (
    <div className="flex flex-col h-full w-full bg-atos-blue-dark dark:bg-[#1a1a1a]">
      {/* Logo */}
      <div className="p-4 flex justify-center">
        {!collapsed ? (
          <>
            <img src="/logo-atos-dark2.png" alt="Atos Capital" className="h-10 w-auto max-h-full dark:hidden" />
            <img src="/logo-atos-dark2.png" alt="Atos Capital" className="h-10 w-auto max-h-full hidden dark:block" />
          </>
        ) : (
          <>
            <img src="/logo-atos-darkCut.png" alt="Atos Capital" className="h-10 w-auto max-h-full dark:hidden" />
            <img src="/logo-atos-darkCut.png" alt="Atos Capital" className="h-10 w-auto max-h-full hidden dark:block" />
          </>
        )}
      </div>


      {/* Cabeçalho */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold text-white dark:text-white">{t('sidebar.menu')}</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white dark:text-white dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700">
          <Menu className="w-5 h-5 dark:text-white" />
        </Button>
      </div>


      {/* Menu */}
      <nav className="p-4 flex-shrink-0">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant={item.active ? "default" : "ghost"}
                onClick={item.onClick}
                className={`w-full justify-center ${collapsed ? 'px-0' : 'px-4 justify-start'} py-3 h-auto
                  ${item.active
                    ? 'bg-[#5E120F] text-white dark:bg-[#5E120F] dark:text-white dark:hover:bg-[#5E120F]/90'
                    : 'text-white dark:text-white hover:bg-gray-700 dark:hover:bg-gray-700'
                  }`}
                style={{ border: 'none', boxShadow: 'none' }}
              >
                <div className={`flex items-center ${!collapsed ? 'w-5 h-5 mr-4' : 'w-6 h-6'}`}>
                  {item.icon}
                </div>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>


      {/* Lista de chats */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-400 dark:text-gray-400">{t('sidebar.chatHistory')}</h3>
          {chats.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400 dark:text-gray-400">{t('sidebar.noChats')}</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  onContextMenu={(e) => handleContextMenu(e, chat.id, chat.name)}
                  className={`rounded-md p-2 cursor-pointer group relative ${
                    activeChat && activeChat.id === chat.id
                      ? 'bg-gray-700 text-white dark:bg-gray-700 dark:text-white'
                      : 'bg-gray-800 text-white dark:bg-gray-800 dark:text-white'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm truncate pr-2">{chat.name}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-opacity"
                      onClick={(e) => toggleMenu(e, chat.id)}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    </button>


                    {openMenuId === chat.id && (
                      <div className="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-md bg-gray-100 dark:bg-[#1a1a1a] shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                        <div className="py-1">
                          <button
                            onClick={() => { handleDeleteChat(chat.id); setOpenMenuId(null); }}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}


      {/* Área do usuário */}
      <div className="relative p-4 bg-gray-700 text-white dark:bg-[#181818] dark:text-white mt-auto">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} cursor-pointer`} onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-atos-red dark:bg-atos-red rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!collapsed && <div className="min-w-0 ml-3"><p className="font-medium text-white dark:text-white truncate">{t('sidebar.user')}</p></div>}
          </div>
          {!collapsed && <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'transform rotate-180' : ''}`} />}
        </div>


        {showUserMenu && (
          <div className={`absolute bottom-full mb-2 bg-white dark:bg-[#1a1a1a] rounded-md shadow-lg z-50 overflow-hidden whitespace-nowrap ${collapsed ? 'left-0' : 'left-0 right-0 mx-4'}`}>
            <a href="https://site.atoscapital.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ArrowUpRight className="w-4 h-4 mr-4" />
              Fazer Upgrade
            </a>
            <button onClick={() => { setShowSettings(true); setShowUserMenu(false); }} className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-4" />
              Configurações
            </button>
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <LogOutIcon className="w-4 h-4 mr-4" />
              Sair da Conta
            </button>
          </div>
        )}
      </div>


      {/* Context Menu */}
      {contextMenu.isOpen && (
        <div className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-50" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
          <button onClick={() => { if (contextMenu.chatId !== null) handleDeleteChat(contextMenu.chatId); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            {t('sidebar.deleteChat')}
          </button>
        </div>
      )}


      <DeleteConfirmation isOpen={deleteConfirmation.isOpen} onClose={closeDeleteConfirmation} onConfirm={confirmDelete} chatName={deleteConfirmation.chatName} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};


export default Sidebar;