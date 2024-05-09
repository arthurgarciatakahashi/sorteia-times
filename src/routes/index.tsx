import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  DetalheDeCidades,
  DetalheDePessoas,
  ListagemDeCidades,
  ListagemDePessoas,
  Times,
} from '../pages';
import { ListagemDeJogadores } from '../pages/jogadores/ListagemDeJogadores';
import { DetalheDejogadores } from '../pages/jogadores/DetalheDeJogadores';
import { SelecaoParaSorteio } from '../pages/jogadores/SelecaoParaSorteio';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'location_city',
        path: '/cidades',
        label: 'Cidades',
      },
      {
        icon: 'people',
        path: '/pessoas',
        label: 'Pessoas',
      },
      {
        icon: 'sports_soccer',
        path: '/jogadores',
        label: 'Jogadores',
      },
      {
        icon: 'casino',
        path: '/sorteio',
        label: 'Sortear',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="/pessoas" element={<ListagemDePessoas />} />
      <Route path="/pessoas/detalhe/:id" element={<DetalheDePessoas />} />

      <Route path="/cidades" element={<ListagemDeCidades />} />
      <Route path="/cidades/detalhe/:id" element={<DetalheDeCidades />} />

      <Route path="/jogadores" element={<ListagemDeJogadores />} />
      <Route path="/jogadores/detalhe/:id" element={<DetalheDejogadores />} />

      <Route path="/sorteio" element={<SelecaoParaSorteio />} />
      <Route path="/times" element={<Times />} />



      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
