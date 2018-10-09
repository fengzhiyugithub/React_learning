import React from "react";
import ReactDOM from "react-dom";
import { useStrict } from 'mobx';///导入useStrict
import { Provider } from "mobx-react";//Provider组件注入合并后的store
import App from "./components/App";
import stores from "./stores";
///在严格模式下，运行MobX
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root")
);
