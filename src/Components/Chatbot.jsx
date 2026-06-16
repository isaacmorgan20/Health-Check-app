import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from "lucide-react";
import useChatStore from "../Context/chatStore";

const Chatbot = () => {
  const { isOpen, setIsOpen, toggleChat } = useChatStore();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm HealthAssist AI, your healthcare appointment booking assistant. I'm here to help you find the right healthcare service based on your needs. What brings you to us today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Book an appointment",
    "What health packages do you offer?",
    "Explain homeopathic remedies",
    "What are your working hours?",
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }

    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Map frontend messages format to API expected format:
      // {"messages": [{"role": "user", "content": "..."}, ...]}
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to my service. Please make sure the backend server is running.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Utility function to format simple markdown-like text (**bold** and \n linebreaks)
  const formatMessage = (text) => {
    if (!text) return "";
    
    // Split by double newlines for paragraphs first
    return text.split("\n").map((paragraph, pIdx) => {
      // Replace **text** with <strong>text</strong>
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={partIdx} className="font-bold text-green-300">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 animate-pulse group-hover:animate-none" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full animate-ping"></span>
          </div>
          <span className="font-semibold text-sm tracking-wide">Ask HealthAssist AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[400px] h-[550px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] bg-slate-900/95 border border-slate-700/50 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/30 rounded-lg text-blue-400 border border-blue-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm tracking-wide">HealthAssist AI</h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">Appointment Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isAssistant
                        ? msg.isError
                          ? "bg-red-950/40 border border-red-500/30 text-red-200"
                          : "bg-slate-800/80 text-gray-100 border border-slate-700/30"
                        : "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-md"
                    }`}
                  >
                    {isAssistant && msg.isError && (
                      <div className="flex items-center gap-1.5 font-semibold text-red-400 mb-1">
                        <AlertCircle className="w-4 h-4" /> Connection Error
                      </div>
                    )}
                    {formatMessage(msg.content)}
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700/30 p-3.5 rounded-2xl text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Panel */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
              <p className="text-[11px] text-gray-400 mb-2 font-medium">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-xs bg-slate-800/50 hover:bg-blue-900/30 border border-slate-700/50 hover:border-blue-500/30 text-gray-300 hover:text-blue-200 px-3 py-1.5 rounded-lg transition-all text-left duration-200 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-950/60 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
