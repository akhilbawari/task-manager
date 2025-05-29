import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import TaskCreation from './pages/TaskCreation';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<TaskCreation />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
