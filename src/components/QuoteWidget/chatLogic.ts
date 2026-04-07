// TypeScript types shared between QuoteWidget.astro (server) and the inline
// client script. This file is NOT bundled for the browser — it's only used
// for compile-time type checking.

export type ServiceKey =
  | 'spring_repair'
  | 'cable_roller'
  | 'opener_repair'
  | 'opener_replace'
  | 'tuneup';

export type RouteKey = ServiceKey | 'rep';

export type ScreenName =
  | 'home'
  | 'service'
  | 'questions'
  | 'tiers'
  | 'chat'
  | 'rep';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicStreamEvent {
  type: string;
  delta?: {
    type: string;
    text?: string;
  };
}
