import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Views, throwBadView } from './Store';
import Home from './Home';
import Reader from './Reader';
import Find from './Find';
import Choose from './Choose';
import YourFavorites from './YourFavorites';
import { loading } from './Loading';

@observer
class App extends React.Component<{store: Store}, {}> {
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

      case Views.favorites:
        return <YourFavorites store={store} />;

      case Views.error:
        return <h1>Bad URL</h1>;

      case Views.settings:
        return <p>Not here</p>;

      default:
        return throwBadView(store.currentView);
    }
  }
}

export default App;
