import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Home from './Home';
import Reader from './Reader';
import Find from './Find';
import Choose from './Choose';
import ErrorMsg from './ErrorMsg';

@observer
class App extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    if (!store.ms.promise || store.ms.promise.state === 'pending') {
      return <p className="loading"/>;
    } else if (store.ms.promise.state === 'rejected') {
      return <ErrorMsg error={store.ms.promise.reason} />;
    } else {
      switch (store.currentView) {

        case 'home':
          return <Home store={store} />;
          
        case 'book':
          return <Reader store={store} />;

        case 'find':
          return <Find store={store} />;

        case 'choose':
          return <Choose store={store} />;

        case 'error':
        default:
          return <h1>Bad URL</h1>;
      }
    }
  }
}

export default App;
