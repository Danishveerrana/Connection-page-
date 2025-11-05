
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { MessageAuthor } from '../types';
import type { Message } from '../types';
import { ChatIcon, CloseIcon, SendIcon, SparklesIcon } from './icons';

const ThinkingModeSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onChange(!checked)}>
        <SparklesIcon className={`w-5 h-5 transition-colors ${checked ? 'text-purple-400' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${checked ? 'text-white' : 'text-gray-300'}`}>Thinking Mode</span>
        <div className="relative">
            <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
        </div>
    </div>
);

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatInstance, setChatInstance] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const initChat = () => {
            try {
                if (!process.env.API_KEY) {
                    setError("API key not found. Please set the API_KEY environment variable.");
                    return;
                }
                setError(null);
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const model = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
                const config = isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};
                
                const newChat = ai.chats.create({
                    model,
                    config,
                });
                setChatInstance(newChat);
                setMessages([]);

            } catch (e: any) {
                console.error("Failed to initialize chat:", e);
                setError(e.message || "An unexpected error occurred during initialization.");
            }
        };

        initChat();
    }, [isThinkingMode]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !chatInstance) return;

        const userMessage: Message = { id: Date.now().toString(), author: MessageAuthor.USER, text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await chatInstance.sendMessage({ message: userInput });
            
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                author: MessageAuthor.BOT,
                text: response.text,
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (e: any) {
            console.error("Error sending message:", e);
            const errorMessage = e.message || "Sorry, something went wrong.";
            setError(errorMessage);
            const errorBotMessage: Message = {
                id: (Date.now() + 1).toString(),
                author: MessageAuthor.BOT,
                text: `Error: ${errorMessage}`,
            };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-2xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
            >
                {isOpen ? <CloseIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
                    <header className="p-4 border-b border-white/20 flex justify-between items-center">
                        <h3 className="font-bold text-white text-lg">Gemini Chat</h3>
                        <ThinkingModeSwitch checked={isThinkingMode} onChange={setIsThinkingMode} />
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-white ${msg.author === MessageAuthor.USER ? 'bg-purple-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-2xl bg-gray-700 rounded-bl-none">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                             {error && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-2xl bg-red-800/50 border border-red-500 text-white rounded-bl-none">
                                        <p className="text-sm font-semibold">Error</p>
                                        <p className="text-sm mt-1" style={{ whiteSpace: 'pre-wrap' }}>{error}</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/20">
                        <div className="flex items-center space-x-2 bg-gray-900/50 border border-white/10 rounded-full p-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask anything..."
                                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !userInput.trim()}
                                className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
