type SwipeProps = {
  nodeName?: string,
  className?: string,
  style?: React.CSSProperties,
  delta?: number,
  mouseSwipe?: boolean,
  preventDefaultEvent: boolean,
  onSwipedLeft?: () => void,
  onSwipedRight?: () => void,
  onSwipedDown?: () => void,
  onSwipedUp?: () => void,
  onSwipe?: () => void
};

declare module 'react-swipe-component' {
  class Swipe extends React.Component<SwipeProps, {}> {
  }

  export default Swipe;
}

