import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import arrayShuffle from 'array-shuffle';
import { usePDF } from 'react-to-pdf';
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableFooter, TableHead, TableRow
} from '@mui/material';

import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { IListagemJogador } from '../../shared/services/api/jogadores/JogadoresService';

interface ILocationState {
  jogadores: IListagemJogador[];
}

export const Times: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jogadores } = location.state as ILocationState;

  const [rows, setRows] = useState<IListagemJogador[]>(jogadores || []);
  const [isLoading, setIsLoading] = useState(true);
  const { toPDF, targetRef } = usePDF({ filename: 'times.pdf' });

  const [timeAmarelo, setTimeAmarelo] = useState<IListagemJogador[]>([]);
  const [timeAzul, setTimeAzul] = useState<IListagemJogador[]>([]);

  useEffect(() => {
    setIsLoading(true);

    console.log('print das rows');
    console.log(rows);

    if (rows.length > 0) {
      const listGOLs = rows.filter((row) => row.posicao === 'GOL');
      const listToTalSemGOL = rows.filter((row) => row.posicao !== 'GOL');

      console.log('lista sem goleiros ' + listToTalSemGOL);
      console.log('lista de goleiros ' + listGOLs);
      console.log('azul Ant: ' + timeAzul.length + ' amarelo Ant: ' + timeAmarelo.length);

      const shuffledJogadores = arrayShuffle(listToTalSemGOL);
      const tempTimeAmarelo: IListagemJogador[] = [];
      const tempTimeAzul: IListagemJogador[] = [];

      shuffledJogadores.forEach((jogadorLinha, index) => {
        // if (timeAzul.length > timeAmarelo.length) {
        //   timeAmarelo.push(jogadorLinha);
        // } else {
        //   timeAzul.push(jogadorLinha);
        // }
        if (index % 2 === 0) {
          tempTimeAmarelo.push(jogadorLinha);
        } else {
          tempTimeAzul.push(jogadorLinha);
        }
      });

      console.log('azul: ' + timeAzul.length + ' amarelo: ' + timeAmarelo.length);
      console.log(timeAzul);
      console.log('comecando com goleiros');

      // listGOLs.sort((a, b) => a.nota - b.nota).forEach((goleiro) => {
      //   if (timeAzul.length > timeAmarelo.length) {
      //     timeAmarelo.push(goleiro);
      //   } else {
      //     timeAzul.push(goleiro);
      //   }
      // });

      listGOLs.sort((a, b) => a.nota - b.nota).forEach((goleiro, index) => {
        if (index % 2 === 0) {
          tempTimeAzul.push(goleiro);
        } else {
          tempTimeAmarelo.push(goleiro);
        }
      });

      tempTimeAzul.sort((a, b) => a.posicao.localeCompare(b.posicao));
      tempTimeAmarelo.sort((a, b) => a.posicao.localeCompare(b.posicao));

      setTimeAmarelo(tempTimeAmarelo);
      setTimeAzul(tempTimeAzul);

      setIsLoading(false);
    }
  }, [rows]);


  return (
    <LayoutBaseDePagina
      titulo='Times'
      barraDeFerramentas={<FerramentasDeDetalhe
        mostrarBotaoPersonalizado={true}
        textoBotaoPersonalizado='Compartilhar'
        iconeBotaoPersonalizado='picture_as_pdf'
        aoClicarEmPersonalizado={() => toPDF()}
        mostrarBotaoNovo={false}
        mostrarBotaoVoltar={true}
        mostrarBotaoApagar={false}
        mostrarBotaoSalvar={false}
        aoClicarEmVoltar={() => navigate('/sorteio')}
      />}
    >

      <Box width='100%' display='flex' ref={targetRef}>
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              <Card>
                <CardContent>
                  <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow style={{ backgroundColor: 'yellow', color: 'white' }}>
                          <TableCell>Amarelo</TableCell>
                          <TableCell></TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {timeAmarelo.map(row => (
                          <TableRow key={row.id}>

                            <TableCell>{row.nome}</TableCell>
                            <TableCell>{row.posicao}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        {isLoading && (
                          <TableRow>
                            <TableCell colSpan={2}>
                              <LinearProgress variant='indeterminate' />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              <Card>
                <CardContent>
                  <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow style={{ backgroundColor: 'cyan', color: 'white' }}>
                          <TableCell> Azul</TableCell>
                          <TableCell></TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {timeAzul.map(row => (
                          <TableRow key={row.id}>

                            <TableCell>{row.nome}</TableCell>
                            <TableCell>{row.posicao}</TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        {isLoading && (
                          <TableRow>
                            <TableCell colSpan={2}>
                              <LinearProgress variant='indeterminate' />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableFooter>
                    </Table>
                  </TableContainer>

                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>

    </LayoutBaseDePagina >
  );
};
