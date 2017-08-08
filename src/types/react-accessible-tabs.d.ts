interface TabInfo {
  label: string;
  content: JSX.Element;
}

declare module 'react-accessible-tabs' {
  class Tabs extends React.Component<{data: TabInfo[], initialSelectedIndex: number}, {}> {
  }

  export default Tabs;
}

