import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import App from './App';
import { nanoid } from 'nanoid';

window.onhashchange = () => {
  window.location.reload()
}

if (!window.location.hash) {
  window.location.hash = nanoid(5)
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
