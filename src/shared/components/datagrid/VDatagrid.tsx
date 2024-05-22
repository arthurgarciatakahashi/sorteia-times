import * as React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box, useTheme } from '@mui/material';

const VDataGrid: React.FC<DataGridProps> = (props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
        margin: 1,
        '& .MuiDataGrid-root': {
          backgroundColor: theme.palette.background.paper, // Cor de fundo do DataGrid
        },
        '& .MuiDataGrid-cell': {
          color: theme.palette.text.primary, // Cor do texto das células
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: theme.palette.background.default, // Cor de fundo do cabeçalho das colunas
          color: theme.palette.text.secondary, // Cor do texto do cabeçalho das colunas
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: theme.palette.background.default, // Cor de fundo do rodapé
        },
      }}
    >
      <DataGrid {...props} />
    </Box>
  );
};

export default VDataGrid;
