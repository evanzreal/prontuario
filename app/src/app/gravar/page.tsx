'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

interface AudioData {
  ptt: boolean;
  seconds: number;
  audioUrl: string;
  mimeType: string;
  viewOnce: boolean;
}

interface WebhookData {
  isStatusReply: boolean;
  chatLid: string;
  connectedPhone: string;
  waitingMessage: boolean;
  isEdit: boolean;
  isGroup: boolean;
  isNewsletter: boolean;
  instanceId: string;
  messageId: string;
  phone: string;
  fromMe: boolean;
  momment: number;
  status: string;
  chatName: string;
  senderPhoto: null;
  senderName: string;
  photo: string;
  broadcast: boolean;
  participantLid: null;
  forwarded: boolean;
  type: string;
  fromApi: boolean;
  audio: AudioData;
}

export default function GravarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [webhookData, setWebhookData] = useState<WebhookData | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Cria dados de áudio no formato solicitado
        const newAudioData: AudioData = {
          ptt: true,
          seconds: recordingTime,
          audioUrl: audioUrl,
          mimeType: 'audio/ogg; codecs=opus',
          viewOnce: false
        };
        
        setAudioData(newAudioData);

        // Simula dados completos do webhook
        const mockWebhookData: WebhookData = {
          isStatusReply: false,
          chatLid: "9337628024965@lid",
          connectedPhone: "5511967336619",
          waitingMessage: false,
          isEdit: false,
          isGroup: false,
          isNewsletter: false,
          instanceId: "3D89ED3B6FB0E0E25EAF7E4D308AAA6F",
          messageId: `MSG_${Date.now()}`,
          phone: "554898672729",
          fromMe: true,
          momment: Date.now(),
          status: "SENT",
          chatName: "Paciente",
          senderPhoto: null,
          senderName: session?.user?.name || "Usuário",
          photo: session?.user?.image || "",
          broadcast: false,
          participantLid: null,
          forwarded: false,
          type: "ReceivedCallback",
          fromApi: false,
          audio: newAudioData
        };
        
        setWebhookData(mockWebhookData);
        
        // Limpa os tracks do stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioData(null);
      setWebhookData(null);
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast.error('Não foi possível acessar o microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDownload = () => {
    if (audioData) {
      const a = document.createElement('a');
      a.href = audioData.audioUrl;
      a.download = `audio-${Date.now()}.ogg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isRecording ? 'Gravando...' : 'Iniciar Gravação'}
        </h1>
        <p className="text-gray-600">
          {isRecording ? 'Clique para parar a gravação' : 'Clique no microfone para começar'}
        </p>
      </div>

      <button
        onClick={handleRecordClick}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300
          ${isRecording 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      {isRecording && (
        <div className="mt-8 text-center">
          <div className="text-lg font-semibold text-red-500">
            <p>{formatTime(recordingTime)}</p>
          </div>
        </div>
      )}

      {audioData && !isRecording && (
        <div className="mt-8 w-full max-w-md">
          <div className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-medium mb-2">Áudio Gravado</h3>
            <audio className="w-full my-2" controls src={audioData.audioUrl}></audio>
            <div className="text-sm text-gray-500 mb-3">
              Duração: {formatTime(audioData.seconds)}
            </div>
            <div className="flex justify-between">
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Baixar
              </button>
              <button 
                onClick={() => {
                  toast.success('Áudio enviado');
                  console.log('Webhook data:', webhookData);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Enviar
              </button>
            </div>
          </div>

          <div className="mt-4 border rounded-lg p-4 bg-white shadow">
            <h3 className="font-medium mb-2">Formato do Webhook</h3>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
              {JSON.stringify(webhookData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 