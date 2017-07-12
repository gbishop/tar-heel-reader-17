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
    next: NavButton,
    back: NavButton,
    children: React.ReactNode
  }) {
  const store = props.store;

  function button(bstyle: {}, nb: NavButton) {
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
        {store.pageTurnSize !== 'off' && props.back.label && button(bstyle, props.back)}
        <div className="NavFrame_PageContainer">
          {props.children}
        </div>
        {store.pageTurnSize !== 'off' && props.next.label && button(bstyle, props.next)}
      </div>
      <NRKeyHandler
        keyValue={'ArrowRight'}
        onKeyHandle={props.next.action}
      />
      <NRKeyHandler
        keyValue={'ArrowLeft'}
        onKeyHandle={props.back.action}
      />
    </div>
  );

});

export default NavFrame;
