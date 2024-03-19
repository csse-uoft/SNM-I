import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import {GoogleOAuthProvider} from "@react-oauth/google";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId={"97097151571-4mfu6di9l4qg6baibofrr3d3e46fh354.apps.googleusercontent.com"}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
