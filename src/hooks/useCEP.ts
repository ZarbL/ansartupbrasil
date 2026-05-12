import { useState, useCallback } from 'react';
import { buscarCEP, type EnderecoViaCEP } from '../services/cepService';

interface UseCEPReturn {
  endereco: EnderecoViaCEP | null;
  isLoading: boolean;
  erro: string | null;
  buscar: (cep: string) => Promise<EnderecoViaCEP | null>;
}

export function useCEP(): UseCEPReturn {
  const [endereco, setEndereco] = useState<EnderecoViaCEP | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async (cep: string): Promise<EnderecoViaCEP | null> => {
    setIsLoading(true);
    setErro(null);

    const resultado = await buscarCEP(cep);

    if (!resultado) {
      setErro('CEP não encontrado');
      setEndereco(null);
    } else {
      setEndereco(resultado);
    }

    setIsLoading(false);
    return resultado;
  }, []);

  return { endereco, isLoading, erro, buscar };
}
