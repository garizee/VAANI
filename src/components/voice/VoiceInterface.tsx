import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize media recorder for better audio capture
    const initializeMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        
        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          audioChunks.current = [];
          await processAudioBlob(audioBlob);
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone Access",
          description: "Please allow microphone access for voice features.",
          variant: "destructive",
        });
      }
    };

    initializeMediaRecorder();
  }, []);

  const processAudioBlob = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Send to Supabase edge function for transcription
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      const transcribedText = data.text;
      setTranscript(transcribedText);
      
      if (onTranscript) {
        onTranscript(transcribedText);
      }
      
      await processVoiceCommand(transcribedText);
      
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Voice Processing Error",
        description: "Failed to process voice command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processVoiceCommand = async (text: string) => {
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
  };

  const toggleRecording = () => {
    if (!mediaRecorder.current) {
      toast({
        title: "Microphone Unavailable",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsListening(false);
    } else {
      audioChunks.current = [];
      mediaRecorder.current.start();
      setIsRecording(true);
      setIsListening(true);
      
      toast({
        title: "Voice Recording",
        description: "Recording your voice command...",
      });
    }
  };

  const speak = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: { text, voice: 'alloy' }
      });

      if (error) throw error;

      // Play the audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }
  };

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
            onClick={toggleRecording}
            disabled={isProcessing}
            className="w-24 h-24 rounded-full"
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isListening ? (
              <Mic className="h-8 w-8 animate-pulse" />
            ) : (
              <MicOff className="h-8 w-8" />
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            {isProcessing ? "Processing..." : isListening ? "Recording... Click to stop" : "Click to start voice command"}
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