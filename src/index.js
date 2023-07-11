import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './contexts/authContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ToastContainer
              position='top-right'
              autoClose={3000}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover={false}
              draggable
              theme='light'
              style={{ width: 'fit-content' }}
              toastStyle={{
                padding: 0,
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              }}
            />
            <App />
          </QueryClientProvider>
        </Provider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
