interface svgGetIfs {
  src: string;
  haveSpan?: boolean;
  classNameSpan?: string;
  style?: Record<string, unknown>;
  isAuto?: boolean;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

import SVGInjector from 'svg-injector';

export default class SvgGet extends React.PureComponent<svgGetIfs> {
  constructor(props: svgGetIfs) {
    super(props);
  }

  componentDidMount(): void {
    const { src } = this.props;
    if (src === '' || src === undefined) {
      return;
    }

    setTimeout(() => {
      const mySVGsToInject = document.querySelectorAll('img.svgInjector');
      SVGInjector(mySVGsToInject); // eslint-disable-line

      const mySVGsToInjectAuto = document.querySelectorAll('img.svgInjectorAuto');
      // Options
      const injectorOptionsAuto = {
        evalScripts: 'once',
        pngFallback: 'assets/png',
        each: (svg) => {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
        },
      };

      SVGInjector(mySVGsToInjectAuto, injectorOptionsAuto); // eslint-disable-line
    }, 100);
  }

  render(): JSX.Element {
    const { src, haveSpan, classNameSpan, style, isAuto, onClick } = this.props;
    if (src === '' || src === undefined) {
      return <></>;
    }
    if (haveSpan || classNameSpan || onClick || style) {
      return (
        <span
          className={classNameSpan}
          onClick={(e) => {
            if (onClick) {
              onClick(e);
            }
          }}
          style={style}
        >
          <img data-src={src} className={`${isAuto ? 'svgInjectorAuto' : 'svgInjector'}`} />
        </span>
      );
    }

    return <img data-src={src} className={`${isAuto ? 'svgInjectorAuto' : 'svgInjector'}`} />;
  }
}
