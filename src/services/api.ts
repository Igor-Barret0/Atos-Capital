const API_BASE_URL = 'http://34.204.197.228:8090';

export interface SqlGenerateRequest {
  query: string;
}

export interface SqlGenerateResponse {
  sql?: string;
  explanation?: string;
  data?: any[];
  error?: string;
  message?: string;
}

/**
 * Chama a API de geração de SQL do backend  --perguntar sobre CORS pra Brísio ou Hugo!!!
 * @param prompt A mensagem/pergunta do usuário
 * @returns A resposta da API com o SQL gerado e/ou resultado
 */
export async function generateSql(prompt: string): Promise<SqlGenerateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sql/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Erro na API: ${response.status}`);
    }

    const data = await response.json();
    // Garante que o objeto retornado sempre tenha as chaves esperadas
    return {
      sql: data.sql,
      explanation: data.explanation,
      data: data.data,
      error: data.error,
      message: data.message,
    };
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
