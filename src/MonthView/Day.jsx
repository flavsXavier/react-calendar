import React from 'react';
import PropTypes from 'prop-types';
import { getDayStart, getDayEnd } from '@wojtekmaj/date-utils';

import Tile from '../Tile';

import { isWeekend } from '../shared/dates';
import {
  formatDay as defaultFormatDay,
  formatLongDate as defaultFormatLongDate,
} from '../shared/dateFormatter';
import { tileProps } from '../shared/propTypes';

import type { CalendarType } from '../shared/dates';

const className = 'react-calendar__month-view__days__day';

type DayProps = {
  calendarType?: CalendarType,
  classes?: string[],
  currentMonthIndex: number,
  formatDay?: typeof defaultFormatDay,
  formatLongDate?: typeof defaultFormatLongDate,
} & React.ComponentProps<typeof Tile>;

export default function Day({
  calendarType,
  classes,
  currentMonthIndex,
  formatDay = defaultFormatDay,
  formatLongDate = defaultFormatLongDate,
  ...otherProps
}: DayProps) {
  const { date, locale } = otherProps;

  return (
    <Tile
      {...otherProps}
      classes={[
        ...classes,
        className,
        isWeekend(date, calendarType) ? `${className}--weekend` : null,
        date.getMonth() !== currentMonthIndex ? `${className}--neighboringMonth` : null,
      ]}
      formatAbbr={formatLongDate}
      maxDateTransform={getDayEnd}
      minDateTransform={getDayStart}
      view="month"
    >
      {formatDay(locale, date)}
    </Tile>
  );
}

Day.propTypes = {
  ...tileProps,
  currentMonthIndex: PropTypes.number.isRequired,
  formatDay: PropTypes.func,
  formatLongDate: PropTypes.func,
};
