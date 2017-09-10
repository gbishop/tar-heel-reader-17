import * as React from 'react';
import { observer } from 'mobx-react';
import { Store, Views } from './Store';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
import './Menu.css';

const OldWell = require('./icons/Well.png');

interface SiteMenuProps {
  store: Store;
  modifiers?: string;
}

@observer
class SiteMenu extends React.Component<SiteMenuProps, {}> {
  render() {
    const mods = this.props.modifiers && this.props.modifiers.split(' ') || [];
    const classes = mods.map((mod) => 'AriaMenuButton-' + mod).join(' ');
    const store = this.props.store;
    const M = store.ms.M;
    return (
      <Wrapper
        className={'AriaMenuButton ' + classes}
        onSelection={(v, e) => {
          if (v === 'settings') {
            store.toggleControlsVisible();
          } else {
            this.props.store.setCurrentView({view: v});
          }}}
      >
        <Button className="AriaMenuButton-trigger">
          <img src={OldWell} alt="Menu" title="Old Well Menu"/>
        </Button>
        <Menu>
          <ul className="AriaMenuButton-menu">
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value={Views.home} className="AriaMenuButton-menuItem">{M.home}</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value={Views.find} className="AriaMenuButton-menuItem">{M.find}</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value={Views.choose} className="AriaMenuButton-menuItem">{M.choose}</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value={Views.yourbooks} className="AriaMenuButton-menuItem">Your Books</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="settings" className="AriaMenuButton-menuItem">{M.settings}</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="login" className="AriaMenuButton-menuItem">{M.login}</MenuItem>
            </li>
          </ul>
        </Menu>
      </Wrapper>
    );
  }
}

export default SiteMenu;
