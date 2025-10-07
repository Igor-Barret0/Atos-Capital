'use client';

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';

// Desabilita o Service Worker em desenvolvimento
if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service Workers registrados:', registrations);
    registrations.forEach(registration => {
      console.log('Desregistrando Service Worker:', registration);
      registration.unregister();
    });
  });
}
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import { Message, Chat } from './types';

// Função para criar um novo chat vazio
const createNewChat = (): Chat => ({
  id: Date.now(),
  name: 'Novo Chat',
  messages: []
});

function App(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Inicializa com um chat vazio
  const [chats, setChats] = useState<Chat[]>(() => {
    const initialChat = createNewChat();
    return [initialChat];
  });

  // Inicializa com o ID do primeiro chat
  const [activeChatId, setActiveChatId] = useState<number | null>(() => {
    const initialChat = createNewChat();
    return initialChat.id;
  });
  
  // Monitora mudanças no estado dos chats e garante que sempre haja um chat ativo
  useEffect(() => {
    console.log('Chats atualizados:', chats);
    
    // Se não houver chat ativo e existir pelo menos um chat, define o primeiro como ativo
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);
  
  // Obtém o chat ativo e suas mensagens
  const activeChat = activeChatId ? chats.find(chat => chat.id === activeChatId) || null : null;
  const messages = activeChat ? activeChat.messages : [];
  
  console.log('Chats:', chats);
  console.log('Chat ativo:', activeChat);
  console.log('Mensagens:', messages);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const selectChat = (chatId: number | null): void => {
    setActiveChatId(chatId);
  };

  const createBotMessages = (message: string): Message[] => {
    const lowerCaseMessage = message.toLowerCase();
    if (!lowerCaseMessage.includes('gráfico')) return [];

    let chartType = '';
    let chartTitle = 'Aqui está um gráfico aleatório para você:';

    if (lowerCaseMessage.includes('pizza')) {
      chartType = 'pie';
      chartTitle = 'Exibindo um gráfico de Preferência por Filmes:';
    } else if (lowerCaseMessage.includes('linha')) {
      chartType = 'line';
      chartTitle = 'Exibindo o Faturamento Anual da Empresa:';
    } else if (lowerCaseMessage.includes('barra') || lowerCaseMessage.includes('coluna')) {
      chartType = 'bar';
      chartTitle = 'Exibindo as Vendas por Vendedor:';
    } else if (lowerCaseMessage.includes('dispersão')) {
      chartType = 'scatter';
      chartTitle = 'Exibindo um gráfico de Dispersão com Linha de Regressão:';
    } else {
      return [];
    }

    return [
      {
        id: Date.now() + 1,
        text: chartTitle,
        timestamp: new Date(),
        sender: 'bot',
      },
      {
        id: Date.now() + 2,
        text: `[CHART:${chartType}]`,
        timestamp: new Date(),
        sender: 'bot',
      }
    ];
  };

  const handleSendMessage = (messageText: string): void => {
    console.log('=== handleSendMessage chamado ===');
    console.log('Mensagem recebida:', messageText);
    
    if (!messageText.trim()) {
      console.log('Mensagem vazia, ignorando');
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      timestamp: new Date(),
      sender: 'user',
    };

    console.log('Mensagem do usuário criada:', userMessage);
    console.log('activeChatId atual:', activeChatId);

    // Primeiro, adiciona a mensagem do usuário
    setChats(prevChats => {
      console.log('Chats antes da atualização:', JSON.parse(JSON.stringify(prevChats)));
      
      // Se não houver chat ativo ou não encontrar o chat ativo, cria um novo
      if (!activeChatId || !prevChats.some(chat => chat.id === activeChatId)) {
        console.log('Nenhum chat ativo encontrado, criando novo chat...');
        const newChat: Chat = {
          id: Date.now(),
          name: messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText,
          messages: [userMessage],
        };
        console.log('Novo chat criado:', newChat);
        // Define o novo chat como ativo
        setActiveChatId(newChat.id);
        return [...prevChats, newChat];
      }
      
      // Atualiza o chat ativo com a mensagem do usuário
      const updatedChats = prevChats.map(chat => 
        chat.id === activeChatId
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage],
              // Se for a primeira mensagem do chat, atualiza o nome do chat
              name: chat.messages.length === 0 
                ? (messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText)
                : chat.name
            }
          : chat
      );
      
      console.log('Chats após atualização (chat existente):', updatedChats);
      return updatedChats;
    });

    // Depois de adicionar a mensagem do usuário, adiciona as respostas do bot
    const botMessages = createBotMessages(messageText);
    if (botMessages.length > 0) {
      console.log('Mensagens do bot a serem adicionadas:', botMessages);
      
      setTimeout(() => {
        setChats(prevChats => {
          const chatIdToUpdate = activeChatId || (prevChats.length > 0 ? prevChats[prevChats.length - 1].id : null);
          if (!chatIdToUpdate) {
            console.log('Nenhum chat para atualizar com mensagens do bot');
            return prevChats;
          }
          
          console.log('Atualizando chat', chatIdToUpdate, 'com mensagens do bot');
          const updatedChats = prevChats.map(chat => 
            chat.id === chatIdToUpdate
              ? { ...chat, messages: [...chat.messages, ...botMessages] }
              : chat
          );
          console.log('Chats após adicionar mensagens do bot:', updatedChats);
          return updatedChats;
        });
      }, 500); // Pequeno atraso para simular processamento
    }
  };

  const handleDeleteChat = (chatId: number): void => {
    setChats((prevChats: Chat[]) => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      
      // Se o chat ativo for o que está sendo excluído, limpa o chat ativo
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
      
      return updatedChats;
    });
  };

  const handleAddChat = (newChat: Chat): void => {
    console.log('handleAddChat chamado com:', newChat);
    setChats(prevChats => {
      console.log('Chats antes da adição:', prevChats);
      const updatedChats = [...prevChats, newChat];
      console.log('Chats após a adição:', updatedChats);
      return updatedChats;
    });
    console.log('Definindo chat ativo para:', newChat.id);
    setActiveChatId(newChat.id);
  };

  return (
    <LanguageProvider>
      <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
        {/* Conteúdo Principal */}
        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          <div 
            className={`fixed left-0 top-0 bottom-0 ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out bg-white dark:bg-[#1a1a1a] z-10`}
            style={{ height: '100vh' }}
          >
            <Sidebar 
              darkMode={darkMode}
              collapsed={sidebarCollapsed} 
              toggleSidebar={toggleSidebar}
              chats={chats}
              activeChat={activeChat}
              onSelectChat={selectChat}
              onDeleteChat={handleDeleteChat}
              onAddChat={handleAddChat}
            />
          </div>

          {/* Área de Chat */}
          <div 
            className={`flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-[#212121] ml-0 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'} transition-all duration-300 ease-in-out`}
            style={{ height: '100vh' }}
          >
            {/* Área de mensagens com rolagem */}
            <div className="flex-1 overflow-y-auto w-full bg-gray-50 dark:bg-[#212121]">
              <div className="w-full max-w-4xl mx-auto px-4 py-4">
                <ChatArea 
                  messages={messages} 
                  darkMode={darkMode} 
                />
              </div>
            </div>
            
            {/* Input de mensagem fixo na parte inferior */}
            <div className="w-full bg-gray-50 dark:bg-[#212121]">
              <div className="max-w-4xl mx-auto px-4 py-3">
                <MessageInput 
                  onSendMessage={handleSendMessage} 
                  darkMode={darkMode} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
