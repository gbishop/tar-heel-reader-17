import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Views } from './Store';
import Home from './Home';
import Reader from './Reader';
import Find from './Find';
import Choose from './Choose';
import YourBooks from './YourBooks';
import { loading } from './Loading';

@observer
class App extends React.Component<{store: Store}, {}> {
  // this declaration forces every case to appear in the switch
  render(): JSX.Element {
    const store = this.props.store;
    const msg = loading(store.ms.promise);
    if (msg) {
      return msg;
    }
    switch (store.currentView) {
      case Views.home:
        return <Home store={store} />;
        
      case Views.book:
        return <Reader store={store} />;

      case Views.find:
        return <Find store={store} />;

      case Views.choose:
        return <Choose store={store} />;

      case Views.yourbooks:
        return <YourBooks store={store} />;

      case Views.error:
        return <h1>Bad URL</h1>;
    }
  }
}

export default App;
