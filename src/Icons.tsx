import * as React from 'react';

export { Icons } from './SvgIcons';

interface IconProps {
  icon: string;
  size: number;
  color: string;
}

export class Icon extends React.Component<IconProps, {}> {
  render() {
    const styles = {
      svg: {
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      path: {
        fill: this.props.color,
      },
    };

    return (
      <svg
        style={styles.svg}
        width={this.props.size}
        height={this.props.size}
        viewBox="0 0 1024 1024"
      >
        <path
          style={styles.path}
          d={this.props.icon}
        />
      </svg>
    );
  }
}

export default Icon;
