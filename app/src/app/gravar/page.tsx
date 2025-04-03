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

// Interface para erros de usuário
interface RecordingError extends Error {
  name: string;
  message: string;
}

export default function GravarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [webhookData, setWebhookData] = useState<WebhookData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [responseUrl, setResponseUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    // Verificar se o navegador suporta MediaRecorder
    if (typeof window !== 'undefined' && !navigator?.mediaDevices?.getUserMedia) {
      setError('Seu navegador não suporta gravação de áudio. Tente usar um navegador mais recente como Chrome ou Firefox.');
    }
  }, []);

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
      setError(null);
      console.log('Solicitando permissão de microfone...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      }).catch((err: RecordingError) => {
        console.error('Erro ao solicitar microfone:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Permissão para o microfone negada. Por favor, permita o acesso ao microfone nas configurações do seu navegador.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('Nenhum microfone encontrado. Verifique se há um microfone conectado ao seu dispositivo.');
        } else {
          setError(`Erro ao acessar o microfone: ${err.message}`);
        }
        throw err;
      });
      
      console.log('Permissão concedida, criando MediaRecorder...');
      
      // Se chegou aqui, a permissão foi concedida
      let mimeType = 'audio/webm;codecs=opus';
      
      // Verificando suporte ao formato
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn('Formato audio/webm;codecs=opus não suportado, usando padrão');
        mimeType = '';
      }
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('Dados de áudio disponíveis', event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('MediaRecorder parado, processando áudio...');
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

      console.log('Iniciando gravação...');
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioData(null);
      setWebhookData(null);
      setResponseUrl(null);
      toast.success('Gravação iniciada');
      
    } catch (error: unknown) {
      console.error('Erro ao iniciar gravação:', error);
      if (error instanceof Error && !error.message.includes('Permission')) {
        toast.error('Erro ao iniciar gravação. Tente novamente.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Parando gravação...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Gravação finalizada');
    }
  };

  const restartRecording = () => {
    setAudioData(null);
    setWebhookData(null);
    setResponseUrl(null);
    setError(null);
    startRecording();
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

  const sendToWebhook = async () => {
    if (!webhookData) return;
    
    setIsSending(true);
    
    try {
      const webhookUrl = "https://primary-production-c25e.up.railway.app/webhook/0294d352-d534-499d-a2a0-355c8abab879";
      
      console.log('Enviando para webhook:', webhookUrl);
      console.log('Dados:', JSON.stringify([webhookData]));
      
      // Enviando o JSON completo para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([webhookData]),
      });
      
      const responseData = await response.json();
      console.log('Response from webhook:', responseData);
      
      if (response.ok) {
        toast.success('Áudio enviado com sucesso!');
        if (responseData && responseData.redirectUrl) {
          setResponseUrl(responseData.redirectUrl);
        }
      } else {
        toast.error('Erro ao enviar áudio');
      }
    } catch (error) {
      console.error('Erro ao enviar para o webhook:', error);
      toast.error('Falha na comunicação com o servidor');
    } finally {
      setIsSending(false);
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
          {isRecording ? 'Gravando...' : 'Gravação de Áudio'}
        </h1>
        <p className="text-gray-600">
          {isRecording 
            ? 'Fale no microfone e clique em "Parar" quando terminar' 
            : 'Clique no microfone para começar a gravar'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 max-w-md">
          <p className="font-semibold mb-1">Erro de permissão:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {isRecording ? (
        <div className="space-y-8">
          <div className="w-32 h-32 rounded-full bg-red-500 animate-pulse flex items-center justify-center mx-auto">
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
          </div>
          
          <div className="text-lg font-semibold text-red-500 text-center">
            <p>{formatTime(recordingTime)}</p>
          </div>
          
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Parar Gravação
          </button>
        </div>
      ) : audioData ? (
        <div className="mt-4 w-full max-w-md">
          <div className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-medium mb-2">Áudio Gravado</h3>
            <audio className="w-full my-2" controls src={audioData.audioUrl}></audio>
            <div className="text-sm text-gray-500 mb-3">
              Duração: {formatTime(audioData.seconds)}
            </div>
            <div className="flex justify-between gap-2">
              <button 
                onClick={restartRecording}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex-1"
              >
                Regravar
              </button>
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex-1"
              >
                Baixar
              </button>
              <button 
                onClick={sendToWebhook}
                disabled={isSending}
                className={`px-4 py-2 text-white rounded transition flex-1 ${
                  isSending ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isSending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>

          {responseUrl && (
            <div className="mt-4 border rounded-lg p-4 bg-white shadow">
              <h3 className="font-medium mb-2">Resposta Recebida</h3>
              <p className="text-sm">Prossiga para:</p>
              <a 
                href={responseUrl} 
                className="text-blue-500 underline block mt-1 break-words"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {responseUrl}
              </a>
            </div>
          )}

          <div className="mt-4 border rounded-lg p-4 bg-white shadow">
            <h3 className="font-medium mb-2">Formato do Webhook</h3>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
              {JSON.stringify(webhookData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <button
          onClick={startRecording}
          className="w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-500 hover:bg-blue-600"
        >
          <svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V6z"
            />
            <path
              d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V22h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
            />
          </svg>
        </button>
      )}
    </div>
  );
} 