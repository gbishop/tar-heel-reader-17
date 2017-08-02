import * as React from 'react';
import { observer } from 'mobx-react';
import { IPromiseBasedObservable } from 'mobx-utils';
import './Loading.css';

const ErrorMsg = observer((props: { error: Response|Error }) => {
  const error = props.error;
  if (error instanceof Response) {
    return <h1>{'Error: ' + error.status + '/' + error.statusText}</h1>;
  } else if (error instanceof Error) {
    return <h1>{'Error: ' + error.message}</h1>;
  } else {
    return <h1>Unknown Error</h1>;
  }
});

// tslint:disable-next-line
export function loading(promise: IPromiseBasedObservable<any>) {
  if (promise.state === 'rejected') {
    return <ErrorMsg error={promise.value.message} />;
  } else if (promise.state === 'pending') {
    return <p className="loading" >Loading...</p>;
  } else {
    return false;
  }
}

export default loading;
