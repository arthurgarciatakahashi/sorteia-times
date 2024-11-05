import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { Box, Container, LinearProgress, Paper } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { IListagemJogador, JogadoresService } from '../../shared/services/api/jogadores/JogadoresService';
import VDataGrid from '../../shared/components/datagrid/VDatagrid';

export const SelecaoParaSorteio: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemJogador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  // 1. Carregar dados e seleção salvos no localStorage ao montar o componente
  useEffect(() => {

    const savedRows = localStorage.getItem('rows');
    const savedSelection = localStorage.getItem('rowSelectionModel');
    //por enquanto para remover o cache de selecao, tem que ir pra home.
    
    if (savedRows) {
      setRows(JSON.parse(savedRows));
      setIsLoading(false); // Evita recarregar dados se já existem salvos
    } else {
      // Caso `rows` não esteja no localStorage, buscamos do servidor
      setIsLoading(true);
      debounce(() => {
        JogadoresService.getAllSelected('true')
          .then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              setTotalCount(result.totalCount);
              setRows(result.data);
              localStorage.setItem('rows', JSON.stringify(result.data)); // Salva rows no localStorage
            }
          });
      });
    }

    // Carrega seleção salva, se disponível
    if (savedSelection) {
      setRowSelectionModel(JSON.parse(savedSelection));
    }
  }, []); // Executa apenas uma vez ao montar o componente

  // 2. Atualizar `rowSelectionModel` no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('rowSelectionModel', JSON.stringify(rowSelectionModel));
  }, [rowSelectionModel]);

  // 3. Atualizar `rows` no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('rows', JSON.stringify(rows));
  }, [rows]);

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', width: 130 },
    { field: 'posicao', headerName: 'Posição', width: 70 },
    {
      field: 'nota',
      headerName: 'Nota',
      type: 'number',
      width: 100,
      align: 'right',
    },
  ];

  return (
    <LayoutBaseDePagina
      titulo='Seleção para sorteio'
      barraDeFerramentas={
        <FerramentasDaListagem
          textoBotaoNovo='Sortear Times'
          iconeBotaoNovo='groups3'
          aoClicarEmNovo={() => {
            const jogadores = rowSelectionModel.map((selectedId) =>
              rows.find((item) => item.id === selectedId)
            );
            console.log('Jogadores selecionados:');
            console.log(jogadores);
            navigate('/times', { state: { jogadores } });
          }}
        />
      }
    >
      {isLoading && (
        <Container component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
          <LinearProgress variant='indeterminate' />
        </Container>
      )}
      {!isLoading && (
        <VDataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[5, 25, { value: 100, label: 'todos' }]}
          checkboxSelection
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          {...rows}
        />
      )}
    </LayoutBaseDePagina>
  );
};
