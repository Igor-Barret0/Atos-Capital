import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { Message } from '../types';
import MockedChart from './charts/MockedChart';

interface ChatAreaProps {
  messages: Message[];
  darkMode: boolean;
}

// Componente de mensagem individual para melhor desempenho
const MessageItem = React.memo(({ 
  message, 
  isUserMessage, 
  isLastMessage,
  darkMode 
}: { 
  message: Message; 
  isUserMessage: boolean; 
  isLastMessage: boolean;
  darkMode: boolean;
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Efeito para rolagem suave apenas para a última mensagem
  useEffect(() => {
    if (isLastMessage && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLastMessage]);

  const renderContent = useCallback((text: string) => {
    if (!text) return null;
    
    if (typeof text === 'string' && text.startsWith('[CHART:') && text.endsWith(']')) {
      return <MockedChart chartType={text.slice(7, -1) as any} />;
    }
    
    return String(text).split('\n').map((line: string, i: number) => (
      <p key={i} className="mb-1 last:mb-0">
        {line}
      </p>
    ));
  }, []);

  return (
    <div 
      ref={isLastMessage ? messageEndRef : null}
      className={`flex items-start mb-4 ${isUserMessage ? 'justify-end' : 'justify-start'}`}
    >
      {!isUserMessage && (
        <div className="flex-shrink-0 mr-3 mt-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
        </div>
      )}
      
      <div className="max-w-[80%] rounded-lg">
        <div className={`rounded-lg px-4 py-2 bg-white border border-gray-200 ${
          isUserMessage 
            ? 'text-gray-800' 
            : 'text-gray-800'
        }`}>
          {renderContent(message.text)}
        </div>
      </div>
      
      {isUserMessage && (
        <div className="flex-shrink-0 ml-2 mt-1">
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const ChatArea: React.FC<ChatAreaProps> = React.memo(({ messages, darkMode }) => {
  console.log('=== ChatArea renderizado ===');
  console.log('Mensagens recebidas:', JSON.parse(JSON.stringify(messages || [])));
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  console.log('ChatArea renderizado com mensagens:', messages);
  
  const isUser = useCallback((sender: string) => {
    const isUser = sender === 'user';
    console.log('Verificando se é usuário:', sender, isUser);
    return isUser;
  }, []);

  // Efeito para garantir que o scroll fique no final quando novas mensagens forem adicionadas
  useEffect(() => {
    console.log('Efeito de mensagens ativado. Total de mensagens:', messages?.length || 0);
    console.log('Conteúdo das mensagens:', messages);
    
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      console.log('Dimensões do container:', { scrollHeight, clientHeight });
      
      // Força um reflow para garantir que o scroll seja aplicado corretamente
      const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          console.log('Scroll ajustado para o final');
        }
      };
      
      // Usa requestAnimationFrame para garantir que o DOM foi atualizado
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages]);

  const renderWelcomeMessage = useCallback(() => (
    <div className="text-center py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
        Bem-vindo ao Chat da Atos Capital
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
        Como posso ajudar você hoje? Estou aqui para responder suas perguntas sobre investimentos e serviços financeiros.
      </p>
    </div>
  ), []);

  const renderMessages = useMemo(() => {
    console.log('Iniciando renderização de mensagens. Total:', messages?.length || 0);
    
    if (!messages || messages.length === 0) {
      console.log('Nenhuma mensagem para exibir, mostrando mensagem de boas-vindas');
      return renderWelcomeMessage();
    }

    console.log(`Renderizando ${messages.length} mensagens:`, messages);
    
    return (
      <div className="space-y-4 py-2">
        {messages.map((message, index) => {
          if (!message) {
            console.warn('Mensagem inválida no índice', index);
            return null;
          }
          
          console.log(`Renderizando mensagem ${index + 1}/${messages.length}:`, {
            id: message.id,
            text: message.text,
            sender: message.sender,
            timestamp: message.timestamp
          });
          
          const isLast = index === messages.length - 1;
          const isUserMsg = message.sender === 'user';
          
          console.log(`Mensagem ${index + 1}/${messages.length}:`, {
            id: message.id,
            text: message.text,
            sender: message.sender,
            isUser: isUserMsg,
            isLast
          });
          
          return (
            <MessageItem
              key={`${message.id}-${index}`}
              message={message}
              isUserMessage={isUserMsg}
              isLastMessage={isLast}
              darkMode={darkMode}
            />
          );
        })}
      </div>
    );
  }, [messages, darkMode, renderWelcomeMessage]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#212121]">
      <div 
        className="h-full overflow-y-auto px-4 py-2 bg-gray-50 dark:bg-[#212121]"
        ref={chatContainerRef}
      >
        <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col justify-end bg-gray-50 dark:bg-[#212121]">
          <div className="mt-auto bg-gray-50 dark:bg-[#212121]">
            {renderMessages}
          </div>
          <div ref={(el) => {
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }} />
        </div>
      </div>
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;
