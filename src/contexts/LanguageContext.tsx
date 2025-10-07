import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Tipos de idioma suportados
export type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES';
export type Language = LanguageCode | 'auto';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultLanguage: Language = 'pt-BR';

// Traduções
const translations: Record<string, Record<LanguageCode, string>> = {
  'settings.title': {
    'pt-BR': 'Configurações',
    'en-US': 'Settings',
    'es-ES': 'Configuración'
  },
  'settings.general': {
    'pt-BR': 'Geral',
    'en-US': 'General',
    'es-ES': 'General'
  },
  'settings.account': {
    'pt-BR': 'Conta',
    'en-US': 'Account',
    'es-ES': 'Cuenta'
  },
  'settings.notifications': {
    'pt-BR': 'Notificações',
    'en-US': 'Notifications',
    'es-ES': 'Notificaciones'
  },
  'settings.language': {
    'pt-BR': 'Idioma',
    'en-US': 'Language',
    'es-ES': 'Idioma'
  },
  'settings.detectLanguage': {
    'pt-BR': 'Detectar automaticamente',
    'en-US': 'Detect automatically',
    'es-ES': 'Detectar automáticamente'
  },
  'settings.theme': {
    'pt-BR': 'Tema',
    'en-US': 'Theme',
    'es-ES': 'Tema'
  },
  'settings.light': {
    'pt-BR': 'Claro',
    'en-US': 'Light',
    'es-ES': 'Claro'
  },
  'settings.dark': {
    'pt-BR': 'Escuro',
    'en-US': 'Dark',
    'es-ES': 'Oscuro'
  },
  'settings.systemTheme': {
    'pt-BR': 'Usar configuração do sistema',
    'en-US': 'Use system settings',
    'es-ES': 'Usar configuración del sistema'
  },
  'settings.close': {
    'pt-BR': 'Fechar',
    'en-US': 'Close',
    'es-ES': 'Cerrar'
  },
  'account.name': {
    'pt-BR': 'Nome',
    'en-US': 'Name',
    'es-ES': 'Nombre'
  },
  'account.email': {
    'pt-BR': 'E-mail',
    'en-US': 'Email',
    'es-ES': 'Correo electrónico'
  },
  'account.phone': {
    'pt-BR': 'Telefone',
    'en-US': 'Phone',
    'es-ES': 'Teléfono'
  },
  'account.logoutAll': {
    'pt-BR': 'Sair de todos os dispositivos',
    'en-US': 'Log out of all devices',
    'es-ES': 'Cerrar sesión en todos los dispositivos'
  },
  'account.delete': {
    'pt-BR': 'Excluir conta',
    'en-US': 'Delete account',
    'es-ES': 'Eliminar cuenta'
  },
  'account.deleteConfirm': {
    'pt-BR': 'Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    'en-US': 'Are you sure you want to delete your account? This action cannot be undone.',
    'es-ES': '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
  },
  'sidebar.chatHistory': {
    'pt-BR': 'Chats',
    'en-US': 'Chats',
    'es-ES': 'Chats'
  },
  'sidebar.noChats': {
    'pt-BR': 'Nenhuma conversa',
    'en-US': 'No conversations',
    'es-ES': 'Sin conversaciones'
  },
  'sidebar.user': {
    'pt-BR': 'Usuário',
    'en-US': 'User',
    'es-ES': 'Usuario'
  },
  'sidebar.online': {
    'pt-BR': 'Online',
    'en-US': 'Online',
    'es-ES': 'En línea'
  },
  'sidebar.deleteChat': {
    'pt-BR': 'Excluir conversa',
    'en-US': 'Delete chat',
    'es-ES': 'Eliminar chat'
  },
  'sidebar.newChat': {
    'pt-BR': 'Novo Chat',
    'en-US': 'New Chat',
    'es-ES': 'Nuevo Chat'
  },
  'sidebar.reports': {
    'pt-BR': 'Relatórios',
    'en-US': 'Reports',
    'es-ES': 'Informes'
  },
  'sidebar.logout': {
    'pt-BR': 'Sair',
    'en-US': 'Logout',
    'es-ES': 'Cerrar sesión'
  },
  'sidebar.menu': {
    'pt-BR': 'Menu',
    'en-US': 'Menu',
    'es-ES': 'Menú'
  },
  'chat.placeholder': {
    'pt-BR': 'O que posso fazer por você hoje?',
    'en-US': 'How can I help you today?',
    'es-ES': '¿En qué puedo ayudarte hoy?'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Verifica se estamos no navegador (após a montagem do componente)
const isBrowser = typeof window !== 'undefined';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isMounted, setIsMounted] = React.useState(false);

  // Efeito para carregar o idioma apenas no cliente
  React.useEffect(() => {
    setIsMounted(true);
    
    // Tenta carregar o idioma salvo, senão usa o do navegador
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    } else {
      const browserLanguage = navigator.language.split('-')[0] === 'pt' ? 'pt-BR' : 
                            navigator.language.split('-')[0] === 'es' ? 'es-ES' : 'en-US';
      setLanguageState(browserLanguage as Language);
    }
  }, []);

  // Função para definir o idioma e salvar no localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isBrowser) {
      localStorage.setItem('language', lang);
      // Dispara um evento personalizado para notificar outras partes do app
      window.dispatchEvent(new Event('languageChanged'));
    }
  };

  // Função de tradução
  const t = (key: string): string => {
    // Se a chave não existir, retorna a própria chave
    if (!translations[key]) return key;
    
    // Se não estiver montado ainda, retorna a versão padrão (evita inconsistência no SSR)
    if (!isMounted) {
      return translations[key][defaultLanguage] || key;
    }
    
    // Se o idioma for 'auto', usa o idioma do navegador
    const langToUse = language === 'auto' 
      ? (navigator.language.split('-')[0] === 'pt' ? 'pt-BR' : 
         navigator.language.split('-')[0] === 'es' ? 'es-ES' : 'en-US')
      : language as LanguageCode;
      
    // Retorna a tradução para o idioma atual ou a chave se não existir
    return translations[key][langToUse] || key;
  };

  // Efeito para atualizar o atributo lang do HTML quando o idioma mudar
  useEffect(() => {
    if (isMounted && isBrowser) {
      if (language !== 'auto') {
        document.documentElement.lang = language;
      } else {
        const browserLanguage = navigator.language;
        document.documentElement.lang = browserLanguage;
      }
    }
  }, [language, isMounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
};
