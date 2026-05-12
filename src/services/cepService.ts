export interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function buscarCEP(cep: string): Promise<EnderecoViaCEP | null> {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) return null;

    const data = await response.json();

    if (data.erro) return null;

    return data as EnderecoViaCEP;
  } catch {
    return null;
  }
}
