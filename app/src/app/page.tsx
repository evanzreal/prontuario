'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Função de login simplificada - apenas redireciona para a página de formatos
  const handleLogin = () => {
    setIsLoggingIn(true);
    
    // Simular um pequeno atraso para mostrar o estado de loading
    setTimeout(() => {
      router.push('/formatos');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prontuário
          </h1>
          <p className="text-gray-600 text-lg">
            Seu assistente para documentação de sessões
          </p>
        </div>

        <Card className="ios-card p-6">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                Entre para começar a gravar e documentar suas sessões de forma segura.
              </p>
            </div>
            
            <Button 
              className="ios-button w-full"
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Desenvolvido com ❤️ para psicólogos</p>
        </div>
      </div>
    </div>
  );
}
