import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('data') as File;
    const jsonData = formData.get('json');
    const transcricao = formData.get('transcricao') || 'Aguardando transcrição...';

    if (!audioFile || !jsonData) {
      return NextResponse.json(
        { error: 'Arquivo de áudio e dados JSON são obrigatórios' },
        { status: 400 }
      );
    }

    // Converte o JSON string para objeto
    const webhookData = JSON.parse(jsonData as string);

    // Aqui você pode processar o arquivo de áudio e os dados como necessário
    console.log('Dados recebidos:', webhookData);
    console.log('Arquivo de áudio:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    });

    // Retorna uma resposta de sucesso com uma URL de redirecionamento
    return NextResponse.json({
      success: true,
      message: 'Áudio recebido com sucesso',
      redirectUrl: '/formatos',
      audioInfo: {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size
      },
      transcricao,
      webhookData
    });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
} 