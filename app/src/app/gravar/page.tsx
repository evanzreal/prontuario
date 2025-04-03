'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GravarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    // Aqui será implementada a lógica de gravação
  };

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
          <div className="text-sm text-gray-500">
            <p>00:00</p>
          </div>
        </div>
      )}
    </div>
  );
} 