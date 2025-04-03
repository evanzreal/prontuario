import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.transcricao) {
      return NextResponse.json(
        { error: 'Campo transcricao é obrigatório' },
        { status: 400 }
      );
    }

    // Retorna confirmação de recebimento
    return NextResponse.json({
      success: true,
      message: 'Transcrição recebida com sucesso',
      data
    });

  } catch (error) {
    console.error('Erro ao processar transcrição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
} 