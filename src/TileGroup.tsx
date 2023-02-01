import React from 'react';
import PropTypes from 'prop-types';

import Flex from './Flex';

import { getTileClasses } from './shared/utils';
import { tileGroupProps } from './shared/propTypes';

import type { RangeType } from './shared/dates';

type TileGroupProps<T extends React.ComponentType<any>> = {
  className?: string;
  count?: number;
  dateTransform: (point: number) => Date;
  dateType: RangeType;
  end: number;
  hover?: Date;
  offset?: number;
  start: number;
  step?: number;
  tile: T;
  value?: Date;
  valueType: RangeType;
} & React.ComponentProps<T>;

export default function TileGroup<T extends React.ComponentType<any>>({
  className,
  count = 3,
  dateTransform,
  dateType,
  end,
  hover,
  offset,
  start,
  step = 1,
  tile: Tile,
  value,
  valueType,
  ...tileProps
}: TileGroupProps<T>) {
  const tiles = [];
  for (let point = start; point <= end; point += step) {
    const date = dateTransform(point);

    tiles.push(
      <Tile
        key={date.getTime()}
        classes={getTileClasses({
          value,
          valueType,
          date,
          dateType,
          hover,
        })}
        date={date}
        point={point}
        {...tileProps}
      />,
    );
  }

  return (
    <Flex className={className} count={count} offset={offset} wrap>
      {tiles}
    </Flex>
  );
}

TileGroup.propTypes = {
  ...tileGroupProps,
  activeStartDate: PropTypes.instanceOf(Date),
  count: PropTypes.number,
  dateTransform: PropTypes.func.isRequired,
  dateType: PropTypes.string,
  offset: PropTypes.number,
  step: PropTypes.number,
  tile: PropTypes.func.isRequired,
};
