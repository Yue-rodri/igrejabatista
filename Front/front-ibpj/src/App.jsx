import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './Layout.jsx';

import Home from './pages/Home.jsx';
import Eventos from './pages/Eventos.jsx';
import Programacao from './pages/Programacao.jsx';
import Comunidade from './pages/Comunidade.jsx';
import Aniversarios from './pages/Aniversarios.jsx';
import Generosidade from './pages/Generosidade.jsx';
import Principios from './pages/Principios.jsx';
import Contato from './pages/Contato.jsx';
import QuemSomos from './pages/QuemSomos.jsx';
import Mais from './pages/Mais.jsx';

import { createPageUrl } from './utils';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={createPageUrl('Eventos')} element={<Eventos />} />
          <Route path={createPageUrl('Programacao')} element={<Programacao />} />
          <Route path={createPageUrl('Comunidade')} element={<Comunidade />} />
          <Route path={createPageUrl('Aniversariantes')} element={<Aniversarios />} />
          <Route path={createPageUrl('Generosidade')} element={<Generosidade />} />
          <Route path={createPageUrl('Principios')} element={<Principios />} />
          <Route path={createPageUrl('Contato')} element={<Contato />} />
          <Route path={createPageUrl('QuemSomos')} element={<QuemSomos />} />
          <Route path={createPageUrl('Mais')} element={<Mais />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
