import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Menu from './Menu';

@observer
class YourBooks extends React.Component<{store: Store}, {}> {
  render() {
    const store = this.props.store;
    const names = store.cs.lists.keys();
    const items = names.map(k => {
      const ids = store.cs.lists.get(k) || [];
      const list = ids.map(i => (<li key={i}>{i}</li>));
      return (
        <div key={k}>
          <h3>{k}</h3>
          <ul>
            {list}
          </ul>
        </div>
      );
    });
    return (
      <div className="YourFavorites">
        <Menu store={store} />
        <h1>Your Favorites</h1>
        {items}
      </div>
    );
  }
}

export default YourBooks;
