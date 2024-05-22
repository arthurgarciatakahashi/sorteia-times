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


  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      JogadoresService.getAllSelected('true')
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log('disponiveis para serem selecionados');
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data);
          }
        });
    });
  }, []);


  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 70 },
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
              rows.find((item) => item.id === selectedId));

            navigate('/times', { state: { jogadores: jogadores } });
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
        // <div style={{ height: 400, width: '100%', margin: 8 }}>
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
    </LayoutBaseDePagina >
  );
};
