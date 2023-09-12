import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./features/store"; // Подключите Redux Store

import "./index.css"; // Подключите стили или другие ресурсы, если необходимо
import App from "./App"; // Импортируйте ваш основной компонент (например, App)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
