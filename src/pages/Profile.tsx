import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { User, LogOut, Trash2, MessageSquare, ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatMessage {
  id: string;
  chatbot_name: string;
  role: string;
  content: string;
  created_at: string;
}

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    setUser(session.user);
    fetchChatHistory(session.user.id);
  };

  const fetchChatHistory = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    } else {
      setChatHistory(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDeleteHistory = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat history",
        variant: "destructive"
      });
    } else {
      setChatHistory([]);
      toast({
        title: "Success",
        description: "Chat history deleted successfully"
      });
    }
  };

  const groupedChats = chatHistory.reduce((acc, chat) => {
    if (!acc[chat.chatbot_name]) {
      acc[chat.chatbot_name] = [];
    }
    acc[chat.chatbot_name].push(chat);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-4">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 gap-2 z-10"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
      <div className="max-w-4xl mx-auto py-8 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">My Profile</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.email || 'User'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Chat History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Chat History</CardTitle>
                </div>
                {chatHistory.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat History?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. All your chat history will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteHistory}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : chatHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No chat history yet. Start a conversation to see it here!
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedChats).map(([chatbotName, messages]) => (
                    <div key={chatbotName} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold text-lg mb-3 text-primary">
                        {chatbotName}
                      </h3>
                      <div className="space-y-2">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-primary/10 ml-8'
                                : 'bg-muted mr-8'
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {msg.role === 'user' ? 'You' : 'Bot'}
                            </p>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
