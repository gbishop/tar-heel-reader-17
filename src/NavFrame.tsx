import * as React from 'react';
import { observer } from 'mobx-react';
const NextArrow = require('./icons/NextArrow.png');
const BackArrow = require('./icons/BackArrow.png');
import Store from './Store';
import Controls from './Controls';
import NRKeyHandler from './NRKeyHandler';
import ErrorMsg from './ErrorMsg';

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

  function button(style: {}, nb: NavButton) {
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
  let bstyle = null;
  switch (store.pageTurnSize) {
    case 'off':
      break;
    case 'normal':
      bstyle = {
        width: em(4),
        height: em(4),
        fontSize: em(0.75),
        alignSelf: 'flex-end'
      };
      break;
    case 'medium':
      bstyle = {
        flexShrink: 0,
        flexBasis: 'auto',
        width: em(4),
        height: '100%',
        fontSize: em(1)
      };
      break;
    case 'large':
      bstyle = {
        flexShrink: 0,
        flexBasis: 'auto',
        width: em(4),
        height: '100%',
        fontSize: em(1.5)
      };
      break;
    default:
      console.log('cannot happen');
      break;
  }

  return (
    <div className="NavFrame">
      <div className="NavFrame_FlexContainer">
        {bstyle && button(bstyle, props.back)}
        <div className="NavFrame_PageContainer">
          {props.children}
        </div>
        {bstyle && button(bstyle, props.next)}
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
