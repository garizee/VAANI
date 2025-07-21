import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInterfaceProps {
  onTranscript?: (transcript: string) => void;
  onCommand?: (command: string, data?: any) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onTranscript, 
  onCommand 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Speech Recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setRecognitionSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      if (recognition.current) {
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onstart = () => {
          setIsListening(true);
          toast({
            title: "Voice Assistant Active",
            description: "Listening for your command...",
          });
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };

        recognition.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptResult = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptResult;
            } else {
              interimTranscript += transcriptResult;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
          
          if (finalTranscript && onTranscript) {
            onTranscript(finalTranscript);
            processVoiceCommand(finalTranscript);
          }
        };

        recognition.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Please try again or check your microphone settings.",
            variant: "destructive",
          });
        };
      }
    }
  }, [onTranscript, toast]);

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true);
    
    // Simple command processing (in a real app, this would connect to Omnidim.io)
    const command = text.toLowerCase();
    
    if (command.includes('ticket') && command.includes('status')) {
      const ticketMatch = command.match(/ticket\s*(\d+)/);
      if (ticketMatch) {
        onCommand?.('check_ticket_status', { ticketId: ticketMatch[1] });
      }
    } else if (command.includes('complaint') || command.includes('issue') || command.includes('problem')) {
      onCommand?.('create_complaint', { description: text });
    } else if (command.includes('event') && command.includes('suggest')) {
      onCommand?.('suggest_events');
    } else if (command.includes('feedback')) {
      onCommand?.('collect_feedback', { feedback: text });
    }
    
    setTimeout(() => setIsProcessing(false), 1000);
  };

  const toggleListening = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  if (!recognitionSupported) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="h-5 w-5 text-muted-foreground" />
            Voice Assistant Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Voice recognition is not supported in this browser. For full voice functionality, 
            please integrate with Omnidim.io backend service.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Assistant
          </div>
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? "Listening" : "Ready"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Button
            variant={isListening ? "voiceActive" : "voice"}
            size="lg"
            onClick={toggleListening}
            disabled={isProcessing}
            className="w-24 h-24 rounded-full"
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isListening ? (
              <Mic className="h-8 w-8" />
            ) : (
              <MicOff className="h-8 w-8" />
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            {isListening ? "Listening... Speak now" : "Click to start voice command"}
          </p>
        </div>

        {transcript && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Transcript:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
          <p className="font-medium">Try saying:</p>
          <ul className="space-y-1 ml-2">
            <li>• "I have a complaint about my air conditioning"</li>
            <li>• "What's the status of ticket 2035?"</li>
            <li>• "Suggest some community events"</li>
            <li>• "I want to give feedback about the last event"</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => speak("Voice assistant is ready for your commands")}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Test Speech
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};