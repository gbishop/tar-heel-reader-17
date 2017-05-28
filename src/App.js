import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import './App.css';
import Reader from './Reader.js';

class App extends Component {
  render() {
    const {store} = this.props;
    if (store.bookP.state === 'pending') {
      return <h1>Loading</h1>;
    } else if (store.bookP.state === 'rejected') {
      console.log('store', store);
      return (
        <div>
          <Error error={store.bookP.value} />
          <p> /1 is the only functioning url right now</p>
        </div>
      )
    } else {
      return (
        <div className="App">
          <Reader store={store} />
          <DevTools />
        </div>
      );
    }
  }
}

const Error = ({ error }) => {
  console.log('Error', error, typeof(error), Object.keys(error));
  if ('status' in error) {
    return <h1>{"Error: " + error.status + '/' + error.statusText}</h1>;
  } else {
    return <h1>Network Error</h1>
  }
}

export default observer(App);
