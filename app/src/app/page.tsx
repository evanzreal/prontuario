'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/formatos');
    return null;
  }

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
                Faça login para começar a gravar e documentar suas sessões de forma segura.
              </p>
            </div>
            
            <Button 
              className="ios-button w-full"
              onClick={() => signIn('google', { callbackUrl: '/formatos' })}
            >
              Entrar com Google
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
