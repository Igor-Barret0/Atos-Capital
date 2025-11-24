const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5078';

export interface SqlGenerateRequest {
  prompt: string;
  returnData?: boolean;
}

export interface SqlGenerateResponse {
  sql?: string;
  explanation?: string;
  data?: any[];
  error?: string;
  message?: string;
}

/**
 * Chama a API de geração de SQL do backend.
 * @param prompt A mensagem/pergunta do usuário.
 */
export async function generateSql(prompt: string): Promise<SqlGenerateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sql/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, returnData: true }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || `Erro na API: ${response.status}`);
    }

    const text = await response.text();
    let data: SqlGenerateResponse;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return data;
  } catch (error) {
    console.error('Erro ao chamar API:', error);

    if (error instanceof Error) {
      return {
        error: error.message,
        message: 'Não foi possível conectar com o servidor. Tente novamente.',
      };
    }

    return {
      error: 'Erro desconhecido',
      message: 'Ocorreu um erro inesperado. Tente novamente.',
    };
  }
}
