import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, Leaf, Battery, Home, Zap, Sparkles, TrendingUp, ShieldCheck, ArrowRight, MessageSquareText } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { HomeEfficiency } from './components/HomeEfficiency';
import { EnergySavings } from './components/EnergySavings';
import { EcoFriendly } from './components/EcoFriendly';
import { SmartUsage } from './components/SmartUsage';
import { Message, ChatState } from './types';

interface ChatApiResponse {
  reply: string;
  suggestions?: string[];
  topic?: string;
  mode?: string;
  fallback?: boolean;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  content: "Hello! I can help with energy-saving advice and general questions too. Ask me about bills, appliances, science, history, or anything you want to explore.",
  sender: 'bot',
  timestamp: new Date(),
};

const SUGGESTED_QUESTIONS = [
  "How can I reduce my heating costs?",
  "What are the most energy-efficient appliances?",
  "Who invented the light bulb?",
  "Explain climate change in simple words",
];

const HERO_INSIGHTS = [
  'Free AI mode is active and always available.',
  'Smart scheduling can cut waste by 10-20% quickly.',
  'LEDs, insulation, and thermostat tuning give the fastest payback.',
  'Small habit changes can reduce bills without new equipment.',
];

type ActiveTab = 'chat' | 'home' | 'savings' | 'eco' | 'smart';

const TAB_ITEMS = [
  { icon: Home, title: 'Home Efficiency', color: 'text-blue-600', tab: 'home' as ActiveTab },
  { icon: Zap, title: 'Energy Savings', color: 'text-yellow-600', tab: 'savings' as ActiveTab },
  { icon: Leaf, title: 'Eco-Friendly', color: 'text-green-600', tab: 'eco' as ActiveTab },
  { icon: Battery, title: 'Smart Usage', color: 'text-purple-600', tab: 'smart' as ActiveTab },
];

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    isTyping: false,
  });
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [chatError, setChatError] = useState<string>('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatState.messages]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_INSIGHTS.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const handleSendMessage = async (content: string) => {
    setChatError('');

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      const history = [...chatState.messages.slice(-8), userMessage].map((message) => ({
        sender: message.sender,
        content: message.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content, history }),
      });

      // Check if response is ok
      if (!response.ok) {
        let errorMsg = 'Server error while generating response.';
        try {
          const errorPayload = await response.json();
          errorMsg = errorPayload.error || errorMsg;
        } catch (e) {
          // If we can't parse error response, use generic message
          errorMsg = `Server returned ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      // Get response text first to check if it's empty
      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Server returned empty response');
      }

      let payload: ChatApiResponse;
      try {
        payload = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
      }

      if (!payload.reply) {
        throw new Error('Server response missing required fields');
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: payload.reply,
        sender: 'bot',
        timestamp: new Date(),
      };

      setFollowUpSuggestions(payload.suggestions ?? []);

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "I apologize, but I'm having trouble processing your request at the moment. Please try again.";

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: message,
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false,
      }));
      setFollowUpSuggestions([]);
      setChatError('Chat API issue detected. Check the backend server.');
    }
  };

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
    handleSendMessage(question);
  };

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeEfficiency />;
      case 'savings':
        return <EnergySavings />;
      case 'eco':
        return <EcoFriendly />;
      case 'smart':
        return <SmartUsage />;
      default:
        return null;
    }
  };

  if (activeTab !== 'chat') {
    return (
      <div className="min-h-screen bg-app-gradient">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-300 hover:translate-x-1"
            >
              Back to Chat
            </button>
          </div>
          {renderTabContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8 pb-24 md:pb-8">
        <section className="relative mb-6 md:mb-8 overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 md:p-6 shadow-xl backdrop-blur-xl hero-panel slide-in-up">
          <div className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-emerald-300/25 blur-3xl floating-orb" />
          <div className="absolute -bottom-14 left-10 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl floating-orb-delayed" />
          <div className="relative grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <div className="space-y-4 slide-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Sparkles size={14} />
                Free AI mode enabled
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-5xl">
                  Make your home smarter, greener, and cheaper to run.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                  Get instant energy advice, explore savings tools, and switch between guided sections with smooth animated transitions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800"
                >
                  Ask the advisor
                  <ArrowRight size={16} />
                </button>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  <ShieldCheck size={16} />
                  No API key required for chat
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:justify-self-end">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  <TrendingUp size={14} />
                  Live insight
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-700 transition-opacity duration-500">
                  {HERO_INSIGHTS[heroIndex]}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { label: 'Fast wins', value: 'LED + thermostat' },
                  { label: 'Savings', value: '10-20%' },
                  { label: 'Mode', value: 'Free AI' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-3 text-center shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">{stat.label}</div>
                    <div className="mt-1 text-xs font-medium text-gray-900">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="mb-8 hidden sm:grid grid-cols-2 gap-4 lg:grid-cols-4 stagger-in">
          {TAB_ITEMS.map(({ icon: Icon, title, color, tab }) => (
            <button
              key={title}
              onClick={() => handleTabClick(tab)}
              className="group rounded-xl bg-white/90 backdrop-blur p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl card-float border border-white/60"
            >
              <div className={`mb-2 w-fit rounded-full bg-opacity-10 p-2 ${color.replace('text', 'bg')}`}>
                <Icon className={`h-6 w-6 ${color} transition-transform duration-300 group-hover:scale-110`} />
              </div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">Click to explore</p>
              <div className="mt-3 text-xs font-medium text-gray-400 transition-all duration-300 group-hover:text-gray-600">
                Open section
              </div>
            </button>
          ))}
        </div>

        <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-2xl border border-white/70 bg-white/90 p-2 shadow-xl backdrop-blur md:hidden mobile-bottom-nav">
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex flex-col items-center rounded-xl px-2 py-2 text-[11px] font-medium text-emerald-700 transition-all active:scale-95"
            >
              <MessageSquareText size={16} />
              Chat
            </button>
            {TAB_ITEMS.map(({ icon: Icon, title, color, tab }) => (
              <button
                key={`mobile-${title}`}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center rounded-xl px-2 py-2 text-[11px] font-medium text-gray-600 transition-all active:scale-95"
              >
                <Icon size={16} className={color} />
                {title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-white/60 slide-in-up border border-white/60">
          <div className="border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 pulse-ping">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Energy Efficiency Advisor</h1>
                  <p className="text-sm text-gray-500">Energy-specialized + general Q&A mode, fully free to use.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:self-auto">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 pulse-dot" />
                Free mode ready
              </div>
            </div>
            {chatError && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {chatError}
              </div>
            )}
          </div>

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="h-[52vh] md:h-[500px] overflow-y-auto px-4 md:px-6 py-4 chat-scroll"
          >
            <div className="flex flex-col gap-4">
              {chatState.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {chatState.isTyping && (
                <div className="flex gap-2 text-gray-500">
                  <div className="typing-dot">●</div>
                  <div className="typing-dot delay-1">●</div>
                  <div className="typing-dot delay-2">●</div>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="border-t border-gray-200 px-4 md:px-6 py-3 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Suggested Questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleQuestionSelect(question)}
                  disabled={chatState.isTyping}
                  className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {followUpSuggestions.length > 0 && (
            <div className="border-t border-gray-200 px-4 md:px-6 py-3 bg-white">
              <p className="text-sm text-gray-600 mb-2">Follow-up Ideas:</p>
              <div className="flex flex-wrap gap-2">
                {followUpSuggestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleQuestionSelect(question)}
                    className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-200 active:scale-95"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 px-4 md:px-6 py-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={chatState.isTyping}
              value={selectedQuestion}
              onChange={setSelectedQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;