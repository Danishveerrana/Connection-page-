// Fix: Add MessageAuthor enum and Message interface for the chatbot
export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}
