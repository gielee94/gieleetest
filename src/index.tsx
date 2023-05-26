import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { useSelector } from 'react-redux';
import { AppState } from './components/redux/types';

import App from './App';
import store from './components/redux/store';

const MsalProvider = () => {
  const tenantId = useSelector((state: AppState) => state.tenantId);

  const pca = new PublicClientApplication({
    auth: {
      clientId: 'a6cc5516-6f85-48f5-b57a-60da9b229ab0',
      authority: `https://login.microsoftonline.com/${tenantId}/`,
      redirectUri: '/',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  });

  return (
    <Router>
      <App msalInstance={pca} />
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MsalProvider />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
