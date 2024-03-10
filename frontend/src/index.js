import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import {GoogleOAuthProvider} from "@react-oauth/google";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId={"97097151571-5rej5u8kh24uanvm4q72jaqm9sf3v5mf.apps.googleusercontent.com"}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
