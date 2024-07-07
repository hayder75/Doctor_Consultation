import React from "react";
import 'antd/dist/antd.min.css'
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { AuthContextProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserTypeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthContextProvider>
    <UserProvider>
       <App />
     </UserProvider>
    </AuthContextProvider>
  </Provider>
);


reportWebVitals();
