import { useState } from 'react';
import Chatbot from './Chatbot';

export default function ChatButton() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-20 right-6 bg-eco-blue-600 hover:bg-eco-blue-700 text-white rounded-full h-14 w-14 flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110 eco-pulse"
        title="Chat with AI Assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
      
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </>
  );
}
