import axios, { AxiosError } from 'axios';
import { type AppError, ERROR_TRANSLATIONS } from '@/types/error.types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey && config.headers) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = 'Ocorreu um erro inesperado. Tente novamente.';

    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        message = 'Não foi possível conectar ao servidor. Verifique sua internet.';
      }
    } else {
      const data = error.response.data as any;
      let rawMessage = data?.message || data?.error || (typeof data === 'string' ? data : null);
      if (!rawMessage && data?.errors) {
        const firstErrorKey = Object.keys(data.errors)[0]
        const firstError = data.errors[firstErrorKey]
        rawMessage = Array.isArray(firstError) ? firstError[0] : firstError
      }
      const backendMessage = typeof rawMessage === 'string' ? rawMessage.trim() : null
      const translatedMessage = backendMessage && ERROR_TRANSLATIONS[backendMessage] ? ERROR_TRANSLATIONS[backendMessage] : backendMessage

      const defaultMessages: Record<number, string> = {
        400: 'Dados inválidos. Verifique as informações enviadas.',
        401: 'Sessão expirada. Por favor, recarregue a página.',
        403: 'Você não tem permissão para realizar esta ação.',
        404: 'A informação solicitada não foi encontrada.',
        409: 'Este registro já existe no sistema.',
        413: 'O arquivo é grande demais para ser enviado.',
        422: 'Não foi possível completar a ação. Verifique os dados enviados.',
        500: 'O servidor está instável. Tente novamente em alguns instantes.',
        504: 'O servidor está instável. Tente novamente mais tarde.',
      }

      message = translatedMessage || defaultMessages[error.response.status] || 'Ocorreu um erro inesperado. Tente novamente.';
    }

    const appError = error as AppError;
    appError.friendlyMessage = message;
    return Promise.reject(appError);
  }
);
