import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import './App.css';
import Store from './Store';
import Reader from './Reader';
import Find from './Find';
import ErrorMsg from './ErrorMsg';

@observer
class App extends React.Component<{store: Store}, void> {
  render() {
    const store = this.props.store;
    switch (store.currentView) {
      case 'landing':
        return <h1>Landing Page</h1>;
      case 'book':
        if (store.bookP.state === 'pending') {
          return <h1>Loading</h1>;

        } else if (store.bookP.state === 'rejected') {
          console.log('store', store);
          return (
            <div>
              <ErrorMsg error={store.bookP.reason} />
              <p> /1 is the only functioning url right now</p>
            </div>
          );

        } else {
          return (
            <div className="App">
              <Reader store={store} />
              <DevTools />
            </div>
          );
        }
      case 'find':
        return <Find store={store} />;

      case 'error':
      default:
        return <h1>Bad URL</h1>;
    }
  }
}

export default App;
