import { Box, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useEffect, useMemo, useState } from 'react';
import { IListagemJogador, JogadoresService } from '../../shared/services/api/jogadores/JogadoresService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../shared/hooks';
import { resourceLimits } from 'worker_threads';


export const Times: React.FC = () => {
  const [rows, setRows] = useState<IListagemJogador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [timeAmarelo, setTimeAmarelo] = useState<IListagemJogador[]>([]);
  const [timeAzul, setTimeAzul] = useState<IListagemJogador[]>([]);
  const [timeAzulATA, setTimeAzulATA] = useState(0);
  const [timeAzulMEI, setTimeAzulMEI] = useState(0);
  const [timeAzulDEF, setTimeAzulDEF] = useState(0);
  const [timeAzulGOL, setTimeAzulGOL] = useState(0);
  const [timeAmareloATA, setTimeAmareloATA] = useState(0);
  const [timeAmareloMEI, setTimeAmareloMEI] = useState(0);
  const [timeAmareloDEF, setTimeAmareloDEF] = useState(0);
  const [timeAmareloGOL, setTimeAmareloGOL] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      JogadoresService.getAllSelected('S')
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data);

            result.data.sort((a, b) => 
              a.nota - b.nota
            ).forEach(jogador => {

              switch (jogador.posicao) { case 'ATA':
                if (timeAzulATA > timeAmareloATA) {
                  timeAmarelo.push(jogador);
                  setTimeAmareloATA(timeAmareloATA + 1);
                } else {
                  timeAzul.push(jogador);
                  setTimeAzulATA(timeAzulATA + 1);
                }
                break;
              case 'MEI':
                if (timeAzulMEI < timeAmareloMEI) {
                  timeAzul.push(jogador);
                  setTimeAzulMEI(timeAzulMEI + 1);
                } else {
                  timeAmarelo.push(jogador);
                  setTimeAmareloMEI(timeAmareloMEI + 1);
                }
                break;
              case 'DEF':
                if (timeAzulDEF > timeAmareloDEF) {
                  timeAmarelo.push(jogador);
                  setTimeAmareloDEF(timeAmareloDEF + 1);
                } else {
                  timeAzul.push(jogador);
                  setTimeAzulDEF(timeAzulDEF + 1);
                }
                break;
              case 'GOL':
                if (timeAzulGOL < timeAmareloGOL) {
                  timeAmarelo.push(jogador);
                  setTimeAmareloGOL(timeAmareloGOL + 1);
                } else {
                  timeAzul.push(jogador);
                  setTimeAzulGOL(timeAzulGOL + 1);
                }
                break;

              }

            });
          }
        });
    });
  }, []);



  return (
    <LayoutBaseDePagina
      titulo='Times'
      barraDeFerramentas={<FerramentasDeDetalhe
        mostrarBotaoNovo
        textoBotaoNovo='Compartilhar'
        mostrarBotaoVoltar={true}
        mostrarBotaoApagar={false}
        mostrarBotaoSalvar={false}
        aoClicarEmVoltar={() => navigate('/sorteio')}


      />}
    >
      <Box width='100%' display='flex'>
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
                    </Table>
                  </TableContainer>

                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
