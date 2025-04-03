'use client';

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formatos = [
  {
    id: 'soap',
    nome: 'SOAP',
    descricao: 'Subjetivo, Objetivo, Avaliação, Plano',
    cor: 'bg-blue-500'
  },
  {
    id: 'dap',
    nome: 'DAP',
    descricao: 'Descrição, Avaliação, Plano',
    cor: 'bg-green-500'
  },
  {
    id: 'bap',
    nome: 'BAP',
    descricao: 'Behavioral Assessment Plan',
    cor: 'bg-purple-500'
  },
  {
    id: 'personalizado',
    nome: 'Personalizado',
    descricao: 'Crie seu próprio formato',
    cor: 'bg-orange-500'
  }
];

export default function FormatosPage() {
  const { status } = useSession();
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Escolha o formato do seu prontuário
          </h1>
          <p className="text-gray-600">
            Selecione o formato que melhor se adapta à sua metodologia
          </p>
        </div>

        <div className="space-y-4">
          {formatos.map((formato) => (
            <Card 
              key={formato.id}
              className="ios-card p-4 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => router.push('/gravar')}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${formato.cor} rounded-full flex items-center justify-center text-white font-bold`}>
                  {formato.nome[0]}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{formato.nome}</h3>
                  <p className="text-sm text-gray-600">{formato.descricao}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Você pode alterar o formato a qualquer momento nas configurações</p>
        </div>
      </div>
    </div>
  );
} 