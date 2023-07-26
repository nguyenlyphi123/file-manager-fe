import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
import CustomRouter from './utils/CustomRouter';
import history from './utils/lib/history';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CustomRouter history={history}>
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
      </CustomRouter>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
