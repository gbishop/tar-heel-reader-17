import * as React from 'react';
import { observer } from 'mobx-react';

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

export default ErrorMsg;
