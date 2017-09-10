import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Menu from './Menu';
import Controls from './Controls';

import './Login.css';

@observer
class Login extends React.Component<{store: Store}, {}> {
  form: HTMLFormElement;
  log: HTMLInputElement;
  pwd: HTMLInputElement;

  doLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('doLogin', this.log.value, this.pwd.value);
    fetch('/THR/api/login/', {
      method: 'post',
      body: new FormData(this.form),
      credentials: 'include'
      }).then((resp) => {
        console.log('login got', resp);
      });
  }
  render() {
    const store = this.props.store;
    const M = store.ms.M;
    return (
      <div className="Login">
        <Menu store={this.props.store} modifiers="centered" />
        <h1>{M.loginMessage}</h1>
        <form id="loginform" onSubmit={this.doLogin} ref={(f) => { if (f) { this.form = f; } }} >
          <label>
            {M.username}
            <input type="text" name="log" ref={(input) => { if (input) { this.log = input; }}} />
          </label>
          <label>
            {M.password}
            <input type="password" name="pwd" ref={(input) => { if (input) { this.pwd = input; }}} />
          </label>
          <label>
            {M.remember}
            <input type="checkbox" name="rememberme" />
          </label>
          <input type="hidden" name="ajax" value="1" />
          <input type="submit" value={M.login} />
        </form>
        <Controls store={store} />
      </div>
    );
  }
}

export default Login;
