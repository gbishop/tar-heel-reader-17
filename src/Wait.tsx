import * as React from 'react';
import { observer } from 'mobx-react';
import { IPromiseBasedObservable } from 'mobx-utils';
import ErrorMsg from './ErrorMsg';
import Store from './Store';

/*
interface WaitProps {
  promise: IPromiseBasedObservable<any>;
  children: React.ReactNode;
}

@observer
class Wait extends React.Component< WaitProps, {}> {
  render() {
    const promise = this.props.promise;
    if (!promise || promise.state === 'pending') {
      return <p className="loading"/>;
    } else if (promise.state === 'rejected') {
      return <ErrorMsg error={promise.reason} />;
    } else {
      return <div>{this.props.children}</div>;
    }
  }
}
 */

interface WaitProps {
  component: React.ClassicComponentClass<{store: Store}>;
  store: Store;
  promise: IPromiseBasedObservable<any>;
}

function Wait(props: WaitProps) {
    if (!props.promise || props.promise.state === 'pending') {
      return <p className="loading"/>;
    } else if (props.promise.state === 'rejected') {
      return <ErrorMsg error={props.promise.reason} />;
    } else {
      return <props.component store={props.store} />
    }
}

export default Wait;
