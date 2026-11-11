import { api, resolveMediaUrl } from '../api/core.js';

/**
 * Realiza o upload multipart de imagem para o endpoint POST /postagens/upload
 * utilizando a URL da API configurada e o token JWT ativo.
 */
export const UploadFile = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/postagens/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;
    return {
      ...data,
      file_url: data.file_url,
      full_url: resolveMediaUrl(data.file_url),
    };
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    const msg = error.response?.data?.error || 'Falha ao enviar arquivo para o servidor.';
    throw new Error(msg);
  }
};
