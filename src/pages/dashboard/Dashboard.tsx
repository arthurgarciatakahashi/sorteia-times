import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { JogadoresService } from '../../shared/services/api/jogadores/JogadoresService';


export const Dashboard = () => {
  const [isLoadingJogadores, setIsLoadingJogadores] = useState(true);
  const [totalCountJogadores, setTotalCountJogadores] = useState(0);
  const [isLoadingJogadoresAtivos, setIsLoadingJogadoresAtivos] = useState(true);
  const [totalCountJogadoresAtivos, setTotalCountJogadoresAtivos] = useState(0);

  useEffect(() => {
    setIsLoadingJogadores(true);
    setIsLoadingJogadoresAtivos(true);

    JogadoresService.getAll(1)
      .then((result) => {
        setIsLoadingJogadores(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log('retorno do get all');
          console.log(result);
          setTotalCountJogadores(result.totalCount);
        }
      });
    JogadoresService.getAllSelected()
      .then((result) => {
        setIsLoadingJogadoresAtivos(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log('retorno do select all');
          console.log(result);
          setTotalCountJogadoresAtivos(result.totalCount);
        }
      });
  }, []);

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total de Jogadores
                  </Typography>
                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingJogadores && (<Typography variant='h1' align='center'>
                      {totalCountJogadores}
                    </Typography>
                    )}
                    {isLoadingJogadores && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>

                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Jogadores Ativos
                  </Typography>

                  <Box padding={6} display='flex' justifyContent='center' alignItems='center'>
                    {!isLoadingJogadoresAtivos && (<Typography variant='h1' align='center'>
                      {totalCountJogadoresAtivos}
                    </Typography>
                    )}
                    {isLoadingJogadoresAtivos && (
                      <Typography variant='h6'>
                        Carregando...
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
