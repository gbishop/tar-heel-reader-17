import * as React from 'react';

export class Tab extends React.Component<{title: string, index?: number, isSelected?: () => boolean}, {}> {
  render() {
    return (
      <div
        id={`tabpanel_${this.props.index}`}
        data-name={`tabpanel_${this.props.index}`}
        role="tabpanel" 
        aria-labelledby={`tab_${this.props.index}`}
        aria-hidden={!this.props.isSelected!()}
      >
        {this.props.children}
      </div>
    );
  }
}

export class Tabs extends React.Component<{}, {}> {
  tabs = this.props.children as Tab[];
  state: {selected: Tab};
  activeLink: HTMLElement;
  constructor(props: {}) {
    super(props);
    this.state = {selected: this.tabs[0]};
    this.selectTab = this.selectTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.nextTab = this.nextTab.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
  }
  componentDidUpdate() {
    this.activeLink.focus();
  }
  selectTab (tab: Tab) {
    this.setState({selected: tab});
  }
  previousTab (tab: Tab) {
    const index = this.tabs.indexOf(tab);
    if (index > 0) {
      this.selectTab(this.tabs[index - 1]);
    }
  }
  nextTab (tab: Tab) {
    const index = this.tabs.indexOf(tab);
    if (index < this.tabs.length - 1) {
      this.selectTab(this.tabs[index + 1]);
    }
  }
  handleClick (e: React.MouseEvent<HTMLAnchorElement>, tab: Tab) {
    e.preventDefault();
    this.selectTab(tab);
  }
  handleKeyup (e: React.KeyboardEvent<HTMLAnchorElement>, tab: Tab) {
    e.preventDefault();
    if (e.which === 13) {
      this.selectTab(tab);
    } else if (e.which === 37) {
      this.previousTab(tab);
    } else if (e.which === 39) {
      this.nextTab(tab);
    }
  }
  render () {
    return (
      <div>
        <ul role="tablist">
          {this.tabs.map((tab: Tab, i) => (
            <li role="presentation">
              <a
                id={`tab_${i}`}
                href={`#tabpanel_${i}`}
                role="tab"
                aria-controls={`tab_${i}`}
                aria-selected={tab === this.state.selected}
                tabIndex={tab === this.state.selected ? 0 : -1}
                onClick={e => this.handleClick(e, tab)}
                onKeyUp={e => this.handleKeyup(e, tab)}
                ref={link => (link && tab === this.state.selected) ? this.activeLink = link : null}
              >
                {tab.props.title}
              </a>
            </li>
          ))}
        </ul>
      <div>
        {this.tabs.map((tab: Tab, i) => (
          // what is the correct type here?
          // tslint:disable-next-line:no-any
          React.cloneElement(tab as any, {
            index: i,
            isSelected: () => tab === this.state.selected
          })
        ))}
      </div>
    </div>);
  }
}
