import * as React from 'react';
import { observer } from 'mobx-react';
const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');
import Store from './Store';
import Controls from './Controls';
import NRKeyHandler from './NRKeyHandler';
import ErrorMsg from './ErrorMsg';
import { navButtonStyles } from './Styles';

import './NavFrame.css';

function em(s: number) {
  return `${s}em`;
}

export interface NavButton {
  action: () => void;
  label: string;
  icon: string;
}

const NavFrame = observer(function NavFrame(
  props: {
    store: Store,
    next?: NavButton,
    back?: NavButton,
    mover?: () => void,
    chooser?: () => void,
    children: React.ReactNode
  }) {
  const store = props.store;
  const mover = props.mover || (props.next && props.next.action);
  const chooser = props.chooser || (props.back && props.back.action);

  function mybutton(bstyle: {}, nb: NavButton) {
    return (
      <button
        className="NavFrame_Button"
        style={bstyle}
        onClick={nb.action}
      >
        <img src={nb.icon} alt="" />
        {nb.label}
      </button>
    );
  }
  let bstyle = navButtonStyles[store.pageTurnSize];

  return (
    <div className="NavFrame">
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
      /> }
      { chooser && <NRKeyHandler
        keyValue={'ArrowLeft'}
        onKeyHandle={chooser}
      /> }
    </div>
  );

});

export default NavFrame;
