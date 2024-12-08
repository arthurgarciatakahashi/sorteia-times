import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  Times,
  ListagemDeJogadores,
  DetalheDejogadores,
  SelecaoParaSorteio,
  ListagemDeLogs
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/home',
        label: 'home',
      },
      {
        icon: 'sports_soccer',
        path: '/jogadores',
        label: 'Jogadores',
      },
      {
        icon: 'history',
        path: '/logs',
        label: 'Histórico',
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
      <Route path="/home" element={<Dashboard />} />

      <Route path="/jogadores" element={<ListagemDeJogadores />} />
      <Route path="/jogadores/detalhe/:id" element={<DetalheDejogadores />} />

      <Route path="/sorteio" element={<SelecaoParaSorteio />} />
      <Route path="/logs" element={<ListagemDeLogs />} />
      <Route path="/times" element={<Times />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
