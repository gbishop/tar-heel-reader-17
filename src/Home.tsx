import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Menu from './Menu';
import Controls from './Controls';

import './Home.css';

const locales = require('./locales.json');

@observer
class Home extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const M = store.ms.M;
    const lockeys = Object.keys(locales).sort();
    return (
      <div className="Home">
        <Menu store={this.props.store} modifiers="centered" />
        <h1>Tar Heel Reader</h1>
        <h2>{M.welcome}</h2>
        <p>{M.welcomeTo}</p>
        <p>
          {M.explanation}
        </p>
        <p>
          <b>{M.usageChanges}</b>&emsp;
          <a href="">{M.rationale}</a>
        </p>
        <p>
          <a href="https://goo.gl/forms/YTHCLvzHNIRVsy653" target="_blank">
            {M.survey}
          </a>
        </p>
        <p>{M.otherLangs}</p>
        <select
          value={store.ms.locale}
          onChange={e => store.ms.setLocale(e.target.value)}
        >
        {lockeys.map(k => <option key={k} value={k} title={M[k]}>{locales[k]}</option>)}
        </select>
        <Controls store={store} />
      </div>
    );
  }
}

export default Home;
