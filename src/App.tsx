import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, throwBadView } from './Store';
import Home from './Home';
import Reader from './Reader';
import Find from './Find';
import Choose from './Choose';
import YourFavorites from './YourFavorites';
import { loading } from './Loading';

@observer
class App extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const msg = loading(store.ms.promise);
    if (msg) {
      return msg;
    }
    switch (store.currentView) {
      case 'home':
        return <Home store={store} />;
        
      case 'book':
        return <Reader store={store} />;

      case 'find':
        return <Find store={store} />;

      case 'choose':
        return <Choose store={store} />;

      case 'yourFavorites':
        return <YourFavorites store={store} />;

      case 'error':
        return <h1>Bad URL</h1>;

      default:
        return throwBadView(store.currentView);
    }
  }
}

export default App;
