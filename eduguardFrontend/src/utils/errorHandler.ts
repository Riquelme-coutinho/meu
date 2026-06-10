import axios from 'axios';
import Toast from 'react-native-toast-message';

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.error;

    switch (status) {
      case 401:
        Toast.show({
          type: 'error',
          text1: 'Acesso Negado',
          text2: backendMessage || 'Credenciais inválidas ou sessão expirada.',
        });
        break;
      case 404:
        Toast.show({
          type: 'error',
          text1: 'Não encontrado',
          text2: backendMessage || 'O recurso solicitado não foi localizado.',
        });
        break;
      case 409:
        Toast.show({
          type: 'error',
          text1: 'Conflito de dados',
          text2: backendMessage || 'Já existe um registro com estes dados no sistema.',
        });
        break;
      case 429:
        Toast.show({
          type: 'info',
          text1: 'Aguarde um momento',
          text2: 'Muitas tentativas. Por favor, aguarde alguns minutos.',
        });
        break;
      case 500:
        Toast.show({
          type: 'error',
          text1: 'Erro interno',
          text2: 'Nossos servidores estão enfrentando problemas. Tente novamente mais tarde.',
        });
        break;
      default:
        Toast.show({
          type: 'error',
          text1: 'Atenção',
          text2: backendMessage || 'Verifique as informações preenchidas e tente novamente.',
        });
    }
  } else {
    Toast.show({
      type: 'error',
      text1: 'Falha de Conexão',
      text2: 'Verifique sua internet ou tente novamente mais tarde.',
    });
  }
};
