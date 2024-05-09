
import './App.css';
import Home from './components/Home';
import Header from './components/layouts/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useState } from 'react';
import store from './store';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';

import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';

import axios from 'axios';

function App() {
  useEffect(() => {
    store.dispatch(loadUser)
    
  },[])

  return (
    <Router>
      <div className="App">
        <HelmetProvider>
            <Header/>
                <div className='container container-fluid'>
                  <ToastContainer theme='dark' />
                  <Routes>
                      <Route path='/' element={<Home/>} />
                  
                      <Route path='/login' element={<Login/>} />
                      <Route path='/register' element={<Register/>} />
                     
                      <Route path='/password/forgot' element={<ForgotPassword/> } />
                      <Route path='/password/reset/:token' element={<ResetPassword/> } />

                      <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute> } />
                      <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute> } />
                      <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute> } />
                    
                  </Routes>
                </div>
              
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;