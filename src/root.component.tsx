import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Draw from './draw.component';

const Root: React.FC = () => (
  <BrowserRouter basename={window.getOpenmrsSpaBase()}>
    <Routes>
      <Route path="draw" element={<Draw />} />
    </Routes>
  </BrowserRouter>
);

export default Root;
