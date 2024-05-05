import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApodView from './containers/apod';
import RoverView from './containers/rover';
import NotFound from './components/notfound';
import EpicView from './containers/epic';
import DonkiView from './containers/donki';
import DashboardView from './containers/dashboard';
import LoginForm from './containers/auth/login';
function App() {

  const PrivateRoute = ( children ) => {
    <>
    <DashboardView />
    {children}
  </>
  };


  return (
    <Router>
      <Routes>
      <Route path="/dashboard" element={<ApodView/>} />
        <Route path="/epic" element={<EpicView />} />
        <Route path="/rover" element={<RoverView />} />
        <Route path="/donki" element={<DonkiView />} />

        <Route path="/" element={<LoginForm />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
