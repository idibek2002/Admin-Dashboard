import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import './satoshi.css';
import { store } from './store/store';
import Loader from './common/Loader';
import { ThemeProvider } from "@material-tailwind/react";
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ThemeProvider>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
    </ThemeProvider>
  </Provider>,
);
