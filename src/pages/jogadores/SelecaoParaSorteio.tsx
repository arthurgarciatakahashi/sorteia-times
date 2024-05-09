import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { IDetalheJogador, IListagemJogador, JogadoresService } from '../../shared/services/api/jogadores/JogadoresService';
import { DataGrid, GridColDef, GridRowSelectionModel, selectedGridRowsCountSelector } from '@mui/x-data-grid';
import * as React from 'react';


export const SelecaoParaSorteio: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemJogador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  //const [selection, setSelection] = useState<IListagemJogador[]>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [data, SetData] = useState<IListagemJogador[]>([]);



  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      JogadoresService.getAllForSort()
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
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
      width: 90,
    },
  ];

  return (
    <LayoutBaseDePagina
      titulo='Seleção para sorteio'
      barraDeFerramentas={
        <FerramentasDaListagem
          textoBotaoNovo='Sortear Times'
          aoClicarEmNovo={() => {
            const jogadores = rowSelectionModel.map((selectedId) =>
              rows.find((item) => item.id === selectedId));

            navigate('/times', { state: { jogadores: jogadores } });
          }}
        />
      }
    >
      {/* <Container component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}> */}
      <div style={{ height: 400, width: '100%', margin: 8 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          
          // checkboxSelection
          // onRowSelectionModelChange={(newRowSelectionModel) => {
          //   setRowSelectionModel(newRowSelectionModel);
          // }}
          // rowSelectionModel={rowSelectionModel}
          {...rows}
        />
      </div>
      {/* </Container> */}
      <Box flex={1} display="flex" justifyContent="end">
      </Box>
    </LayoutBaseDePagina >
  );
};
