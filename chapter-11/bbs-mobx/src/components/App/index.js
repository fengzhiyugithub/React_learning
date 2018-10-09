import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";//使用@inject和@observer
import asyncComponent from "../../utils/AsyncComponent";
import ModalDialog from "../../components/ModalDialog";
import Loading from "../../components/Loading";
import connectRoute from "../../utils/connectRoute";

/**
 * 使用高阶组件实现异步加载
 */
const AsyncHome = connectRoute(asyncComponent(() => import("../Home")));
const AsyncLogin = connectRoute(asyncComponent(() => import("../Login")));

@inject("appStore")
@observer// 将App组件转化为一个reaction，自动响应state的变化
class App extends Component {
  //在开发环境下，添加MobX调试工具
  renderDevTool() {
    if (process.env.NODE_ENV !== "production") {
      const DevTools = require("mobx-react-devtools").default;
      return <DevTools />;
    }
  }

  render() {
    const { error, isLoading, removeError } = this.props.appStore;
    // 错误弹窗
    const errorDialog = error && (
      <ModalDialog onClose={removeError}>{error.message || error}</ModalDialog>
    );

    return (
      <div>
        <Router>
          <Switch>
            {/*exact属性限定室友访问根路径时，第一个Route才会破匹配成功*/}
            <Route exact path="/" component={AsyncHome} />
            <Route path="/login" component={AsyncLogin} />
            <Route path="/posts" component={AsyncHome} />
          </Switch>
        </Router>
        {/*调用错误弹窗*/}
        {errorDialog}
        {/*调用加载组件*/}
        {isLoading && <Loading />}
        {/* 添加MobX调试组件 */}
        {this.renderDevTool()}
      </div>
    );
  }
}

export default App;
