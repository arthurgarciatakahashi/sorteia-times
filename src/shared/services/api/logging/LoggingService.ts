import { Environment } from '../../../environment';
import { Api } from '../axios-config';
import { IListagemJogador } from '../jogadores/JogadoresService';

export interface IListagemLog {
  timestamp?: string;
  ip_address: string;
  response_json: string;
}

type TLogsComTotalCount = {
  data: IListagemLog[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TLogsComTotalCount | Error> => {
  try {
    const urlRelativa = `/logs?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);
    console.log(headers['x-total-count']);
    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const create = async (dados: Omit<IListagemLog, 'timestamp'>): Promise<number | Error> => {
  try {
    //dados.ip_address = JSON.stringify(Api.get('https://api.ipify.org/?format=json'));
    const { data } = await Api.post<IListagemLog>('/logs', dados);

    if (data) {
      console.log('registro ok.');
      return 0;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};


export const LoggingService = {
  getAll,
  create,
};
