import * as React from 'react';
import { observer } from 'mobx-react';
import Store from './Store';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

import './Menu.css';

const OldWell = require('./icons/Well.png');

@observer
class SiteMenu extends React.Component<{store: Store}, {}> {
  render() {
    return (
      <Wrapper
        className="AriaMenuButton"
        onSelection={(v, e) => this.props.store.setCurrentView({view: v})}
      >
        <Button className="AriaMenuButton-trigger">
          <img src={OldWell} alt="Menu" />
        </Button>
        <Menu>
          <ul className="AriaMenuButton-menu">
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="home" className="AriaMenuButton-item">Home</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="find" className="AriaMenuButton-item">Find</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="choose" className="AriaMenuButton-item">Choose</MenuItem>
            </li>
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="settings" className="AriaMenuButton-item">Settings</MenuItem>
            </li>
          </ul>
        </Menu>
      </Wrapper>
    );
  }
}

export default SiteMenu;
