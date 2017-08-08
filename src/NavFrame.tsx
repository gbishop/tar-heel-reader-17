import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import NRKeyHandler from './NRKeyHandler';
import { navButtonStyles } from './Styles';
import Swipe from 'react-swipe-component';

import './NavFrame.css';

export interface NavButton {
  action: () => void;
  label: string;
  icon: string;
}

interface NavFrameProps {
  store: Store;
  next?: NavButton;
  back?: NavButton;
  mover?: () => void;
  chooser?: () => void;
  children: React.ReactNode;
}

@observer
class NavFrame extends React.Component<NavFrameProps, {}> {
  render() {
    const props = this.props;
    const store = props.store;
    const mover = props.mover || (props.next && props.next.action);
    const chooser = props.chooser || (props.back && props.back.action);

    function mybutton(style: {}, nb: NavButton) {
      return (
        <button
          className="NavFrame_Button"
          style={style}
          onClick={nb.action}
        >
          <img src={nb.icon} alt="" />
          {nb.label}
        </button>
      );
    }
    let bstyle = navButtonStyles[store.pageTurnSize];

    return (
      <Swipe
        className="NavFrame"
        mouseSwipe={false}
        onSwipedLeft={mover} 
        onSwipedRight={chooser}
        preventDefaultEvent={false}
      >
          <div className="NavFrame_FlexContainer">
            {store.pageTurnSize !== 'off' && props.back && props.back.label &&
            mybutton(bstyle, props.back)}
            <div className="NavFrame_PageContainer">
              {props.children}
            </div>
            {store.pageTurnSize !== 'off' && props.next && props.next.label &&
            mybutton(bstyle, props.next)}
          </div>
          { mover && <NRKeyHandler
            keyValue={'ArrowRight'}
            onKeyHandle={mover}
            store={store}
          /> }
          { chooser && <NRKeyHandler
            keyValue={'ArrowLeft'}
            onKeyHandle={chooser}
            store={store}
          /> }
      </Swipe>
    );
  }
}

export default NavFrame;
