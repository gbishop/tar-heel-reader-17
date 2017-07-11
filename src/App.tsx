import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Reader from './Reader';
import Find from './Find';
import Choose from './Choose';
import ErrorMsg from './ErrorMsg';

@observer
class App extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    switch (store.currentView) {

      case 'landing':
        return <h1><a href="find/">Find a book</a></h1>;
        
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

export default App;
