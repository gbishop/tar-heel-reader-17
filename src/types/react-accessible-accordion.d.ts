type AccordionProps = {
  accordion?: boolean,
  className?: string,
  onChange?: (e: Event) => void,
  children: React.ReactNode
};
type AccordionItemProps = {
  expanded?: boolean,
  className?: string,
  children: React.ReactNode
};
type AccordionItemTitleProps = {
  className?: string,
  children: React.ReactNode
};
type AccordionItemBodyProps = {
  className?: string,
  hideBodyClassName?: string,
  children: React.ReactNode
};

declare module 'react-accessible-accordion' {
  export class Accordion extends React.Component<AccordionProps, {}> {
  }
  export class AccordionItem extends React.Component<AccordionItemProps, {}> {
  }
  export class AccordionItemTitle extends React.Component<AccordionItemTitleProps, {}> {
  }
  export class AccordionItemBody extends React.Component<AccordionItemBodyProps, {}> {
  }
}

