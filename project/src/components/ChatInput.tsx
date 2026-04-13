import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function ChatInput({ onSendMessage, disabled, value, onChange }: ChatInputProps) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      setInput(value);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      onChange?.('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-2xl border border-gray-200 bg-white/80 p-2 shadow-sm backdrop-blur transition-all duration-300 focus-within:border-green-300 focus-within:shadow-md">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder="Ask anything..."
        className="flex-1 rounded-xl border border-transparent bg-transparent px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-3 sm:px-4 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={20} />
      </button>
    </form>
  );
}