import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApodView from './containers/apod';
import RoverView from './containers/rover';
import NotFound from './components/notfound';
import EpicView from './containers/epic';
import DonkiView from './containers/donki';
import DashboardView from './containers/dashboard';
import LoginForm from './containers/auth/login';
import { TOKEN } from './util';
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
      <Route path="/dashboard" element={PrivateRoute(<ApodView/>)} />
        <Route path="/epic" element={PrivateRoute(<EpicView />)} />
        <Route path="/rover" element={PrivateRoute(<RoverView />)} />
        <Route path="/donki" element={PrivateRoute(<DonkiView />)} />

        <Route path="/" element={<LoginForm />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
