import React, { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { MessageInputProps } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, darkMode }) => {
  const [message, setMessage] = useState<string>('');
  const { t } = useLanguage();
  
  console.log('MessageInput renderizado. onSendMessage:', typeof onSendMessage);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Enviando mensagem (submit):', message);
    
    if (message.trim()) {
      console.log('Chamando onSendMessage com:', message.trim());
      try {
        onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  }, [message, onSendMessage]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        try {
          onSendMessage(message.trim());
          setMessage('');
        } catch (error) {
          console.error('Erro ao enviar mensagem (Enter):', error);
        }
      }
    }
  }, [message, onSendMessage]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  return (
    <div className="px-4 py-3 bg-gray-50 dark:bg-[#212121]" style={{marginBottom: '16px'}}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#212121] text-gray-900 dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-gray-400"
              aria-label={t('chat.placeholder')}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className={`absolute right-2 p-2 rounded-full ${
              message.trim() 
                ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-opacity-50`}
            aria-label="Enviar mensagem"
            disabled={!message.trim()}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
