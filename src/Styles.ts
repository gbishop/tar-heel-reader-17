function em(s: number) {
  return `${s}em`;
}

export const navButtonStyles = {
  off: {
    width: em(0),
    fontSize: em(0)
  },
  normal: {
    width: em(4),
    height: em(4),
    fontSize: em(0.75),
    alignSelf: 'flex-end'
  },
  medium: {
    width: em(4),
    height: '100%',
    fontSize: em(1)
  },
  large: {
    width: em(4),
    height: '100%',
    fontSize: em(1.5)
  }
};

export type NavButtonStyle = keyof typeof navButtonStyles;
