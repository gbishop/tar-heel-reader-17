import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import Menu from './Menu';

@observer
class Home extends React.Component<{store: Store}, {}> {
  render() {
    return (
      <div className="Home">
        <Menu store={this.props.store} />
        <h1>Home page</h1>
      </div>
    );
  }
}

export default Home;
