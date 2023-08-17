import { hydrateRoot, createRoot } from 'react-dom/client';
import './scss/app.scss';
import init from './init.jsx';

const app = async () => {
  const container = document.getElementById('root');

  if (container.hasChildNodes()) {
    hydrateRoot(container, await init());
  } else {
    const root = createRoot(container);
    root.render(await init());
  }
};

app();
