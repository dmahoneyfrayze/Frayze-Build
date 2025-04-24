import { useState } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBotProps {
  onHelpMeChoose: () => void;
}

export function ChatBot({ onHelpMeChoose }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-gradient-to-r from-[#0066FF] to-[#00F6A3] hover:from-[#0052CC] hover:to-[#00E69D] shadow-lg hover:shadow-xl p-0 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-[300px] overflow-hidden shadow-xl border-2">
        <div className="p-4 border-b bg-gradient-to-r from-[#0066FF]/10 to-[#00F6A3]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold">Hello, I'm Frayzi</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Tell me about your business and I'll recommend the best tools for you.
          </p>
          
          <Button 
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#00F6A3] hover:from-[#0052CC] hover:to-[#00E69D] text-white"
            onClick={onHelpMeChoose}
          >
            Start Building My Stack
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}