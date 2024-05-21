import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListagemJogador {
  id: number;
  nome: string;
  posicao: string;
  nota: number;
  ativo: boolean;
}

export interface IDetalheJogador {
  id: number;
  nome: string;
  posicao: string;
  nota: number;
  ativo: boolean;
}

type TJogadoresComTotalCount = {
  data: IListagemJogador[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TJogadoresComTotalCount | Error> => {
  try {
    const urlRelativa = `/jogadores?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

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

const getAllForSort = async (): Promise<TJogadoresComTotalCount | Error> => {
  try {
    const urlRelativa = '/jogadores?_limit=100';

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || 100),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getAllSelected = async (filter = 'true'): Promise<TJogadoresComTotalCount | Error> => {
  try {
    const urlRelativa = `/jogadores?_page=1&_limit=100&ativo_like=${filter}`;
    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || 100),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: number): Promise<IDetalheJogador | Error> => {
  try {
    const { data } = await Api.get(`/jogadores/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheJogador, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheJogador>('/jogadores', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetalheJogador): Promise<void | Error> => {
  try {
    await Api.put(`/jogadores/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/jogadores/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao excluir o registro.');
  }
};


export const JogadoresService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
  getAllForSort,
  getAllSelected,
};
