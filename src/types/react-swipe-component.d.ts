type SwipeProps = {
  className: string,
  mouseSwipe?: boolean,
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

