import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  Times,
  ListagemDeJogadores,
  DetalheDejogadores,
  SelecaoParaSorteio
} from '../pages';

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

      <Route path="/jogadores" element={<ListagemDeJogadores />} />
      <Route path="/jogadores/detalhe/:id" element={<DetalheDejogadores />} />

      <Route path="/sorteio" element={<SelecaoParaSorteio />} />
      <Route path="/times" element={<Times />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
