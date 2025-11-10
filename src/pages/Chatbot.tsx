import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Camera, Upload, Mic, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Chatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatbotName = 'General Chatbot' } = location.state || {};
  const { language, setLanguage, t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: `Hello! I'm your ${chatbotName}. I can help you identify plant diseases and provide farming advice. How can I assist you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChatMessage = async (message: Message) => {
    if (!user) return;

    await supabase.from('chat_history').insert({
      user_id: user.id,
      chatbot_name: chatbotName,
      role: message.role,
      content: message.content
    });
  };

  const handleScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      stream.getTracks().forEach(track => track.stop());
      const scanMessage: Message = { role: 'user', content: 'Scanned a leaf for analysis' };
      setMessages(prev => [...prev, scanMessage]);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for scanning. Please enable camera permissions.');
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const userMessage: Message = { 
          role: 'user', 
          content: `[Image uploaded: ${file.name}]` 
        };
        setMessages(prev => [...prev, userMessage]);

        if (user) {
          await saveChatMessage(userMessage);
        }

        // Send to AI for analysis
        try {
          const response = await supabase.functions.invoke('chat', {
            body: {
              messages: [
                ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: 'Please analyze this crop leaf image.' },
                    { type: 'image_url', image_url: { url: base64Image } }
                  ]
                }
              ],
              language
            }
          });

          if (response.error) throw response.error;

          const botMessage: Message = {
            role: 'bot',
            content: response.data.choices[0].message.content
          };
          setMessages(prev => [...prev, botMessage]);

          if (user) {
            await saveChatMessage(botMessage);
          }
        } catch (error) {
          console.error('Error analyzing image:', error);
          const errorMessage: Message = {
            role: 'bot',
            content: 'Sorry, I encountered an error analyzing the image. Please try again.'
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    alert('Voice recording feature coming soon!');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (user) {
      await saveChatMessage(userMessage);
    }

    try {
      const response = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
            { role: 'user', content: input }
          ],
          language
        }
      });

      if (response.error) throw response.error;

      const botMessage: Message = {
        role: 'bot',
        content: response.data.choices[0].message.content
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (user) {
        await saveChatMessage(botMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{chatbotName}</h1>
              <p className="text-sm text-white/80">Online</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('hi')}>
                हिंदी {language === 'hi' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('mr')}>
                मराठी {language === 'mr' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Side - Scan & Upload Buttons */}
        <div className="w-48 bg-muted/30 p-4 flex flex-col gap-4 border-r">
          <Button
            onClick={handleScan}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex flex-col h-auto py-6 gap-2"
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm">Scan Leaf</span>
          </Button>

          <Button
            onClick={handleUpload}
            className="bg-highlight text-white hover:bg-highlight/90 flex flex-col h-auto py-6 gap-2"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm">Upload Image</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-card text-foreground border'
                    }`}
                  >
                    {message.role === 'bot' ? (
                      <div className="space-y-3 text-sm md:text-base leading-relaxed">
                        {message.content.split('\n').map((line, i) => {
                          // Detect section headers with emojis
                          if (line.match(/^[🌿🌾🩺💊⚠️🌦️]/)) {
                            const [emoji, ...rest] = line.split(':');
                            return (
                              <div key={i} className="font-semibold text-primary flex items-start gap-2">
                                <span className="text-xl">{emoji}</span>
                                <span className="flex-1">{rest.join(':')}</span>
                              </div>
                            );
                          }
                          // Regular text with bold support
                          if (line.trim()) {
                            return (
                              <p key={i} className="text-foreground/90">
                                {line}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm md:text-base">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area with Microphone */}
          <div className="bg-card border-t p-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={handleMicClick} 
                size="icon"
                variant={isRecording ? "destructive" : "secondary"}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSend}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
