import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { tileProps } from './shared/propTypes';

type Args = {
  activeStartDate: Date;
  date: Date;
  view: string;
};
type TileClassNameFunc = (args: Args) => string;
type TileContentFunc = (args: Args) => React.ReactNode;
type TileDisabledFunc = (args: Args) => boolean;

type TileProps = {
  activeStartDate: Date;
  children: React.ReactNode;
  classes?: string[];
  date: Date;
  formatAbbr?: (locale: string | undefined, date: Date) => string;
  locale?: string;
  maxDate?: Date;
  maxDateTransform: (date: Date) => Date;
  minDate?: Date;
  minDateTransform: (date: Date) => Date;
  onClick: (date: Date, event: React.MouseEvent) => void;
  onMouseOver: (date: Date) => void;
  style?: React.CSSProperties;
  tileClassName?: string | TileClassNameFunc;
  tileContent?: React.ReactNode | TileContentFunc;
  tileDisabled?: TileDisabledFunc;
  view: string;
};

type TileState = {
  activeStartDateProps?: TileProps['activeStartDate'];
  tileClassName?: string;
  tileClassNameProps?: TileProps['tileClassName'];
  tileContent?: React.ReactNode;
  tileContentProps?: TileProps['tileContent'];
};

function datesAreDifferent(date1?: Date, date2?: Date) {
  return (
    (date1 && !date2) ||
    (!date1 && date2) ||
    (date1 && date2 && date1.getTime() !== date2.getTime())
  );
}

function getValue(
  nextProps: TileProps,
  prop: TileProps['tileClassName' | 'tileContent' | 'tileDisabled'],
): typeof prop extends TileClassNameFunc
  ? string
  : typeof prop extends TileContentFunc
  ? React.ReactNode
  : typeof prop extends TileDisabledFunc
  ? boolean
  : typeof prop {
  const { activeStartDate, date, view } = nextProps;

  return typeof prop === 'function' ? prop({ activeStartDate, date, view }) : prop;
}

export default class Tile extends Component<TileProps, TileState> {
  static propTypes = {
    ...tileProps,
    children: PropTypes.node.isRequired,
    formatAbbr: PropTypes.func,
    maxDateTransform: PropTypes.func.isRequired,
    minDateTransform: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
  };

  static state = {};

  static getDerivedStateFromProps(nextProps: TileProps, prevState: TileState) {
    const { activeStartDate, date, tileClassName, tileContent, view } = nextProps;

    const nextState: TileState = {};

    const args: Args = { activeStartDate, date, view };

    if (
      tileClassName !== prevState.tileClassNameProps ||
      datesAreDifferent(activeStartDate, prevState.activeStartDateProps)
    ) {
      nextState.tileClassName =
        typeof tileClassName === 'function' ? tileClassName(args) : tileClassName;
      nextState.tileClassNameProps = tileClassName;
    }

    if (
      tileContent !== prevState.tileContentProps ||
      datesAreDifferent(activeStartDate, prevState.activeStartDateProps)
    ) {
      nextState.tileContent = typeof tileContent === 'function' ? tileContent(args) : tileContent;
      nextState.tileContentProps = tileContent;
    }

    nextState.activeStartDateProps = activeStartDate;

    return nextState;
  }

  render() {
    const {
      activeStartDate,
      children,
      classes,
      date,
      formatAbbr,
      locale,
      maxDate,
      maxDateTransform,
      minDate,
      minDateTransform,
      onClick,
      onMouseOver,
      style,
      tileDisabled,
      view,
    } = this.props;
    const { tileClassName, tileContent } = this.state;

    return (
      <button
        className={clsx(classes, tileClassName)}
        disabled={
          (minDate && minDateTransform(minDate) > date) ||
          (maxDate && maxDateTransform(maxDate) < date) ||
          (tileDisabled && tileDisabled({ activeStartDate, date, view }))
        }
        onClick={onClick && ((event) => onClick(date, event))}
        onFocus={onMouseOver && (() => onMouseOver(date))}
        onMouseOver={onMouseOver && (() => onMouseOver(date))}
        style={style}
        type="button"
      >
        {formatAbbr ? <abbr aria-label={formatAbbr(locale, date)}>{children}</abbr> : children}
        {tileContent}
      </button>
    );
  }
}
