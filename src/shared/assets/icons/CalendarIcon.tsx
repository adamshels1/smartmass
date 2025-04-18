import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface CalendarIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  width = 25,
  height = 24,
  color = '#667085',
}) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
    <Path
      d="M7.25 3V5.25M17.75 3V5.25M3.5 18.75V7.5C3.5 6.90326 3.73705 6.33097 4.15901 5.90901C4.58097 5.48705 5.15326 5.25 5.75 5.25H19.25C19.8467 5.25 20.419 5.48705 20.841 5.90901C21.2629 6.33097 21.5 6.90326 21.5 7.5V18.75M3.5 18.75C3.5 19.3467 3.73705 19.919 4.15901 20.341C4.58097 20.7629 5.15326 21 5.75 21H19.25C19.8467 21 20.419 20.7629 20.841 20.341C21.2629 19.919 21.5 19.3467 21.5 18.75M3.5 18.75V11.25C3.5 10.6533 3.73705 10.081 4.15901 9.65901C4.58097 9.23705 5.15326 9 5.75 9H19.25C19.8467 9 20.419 9.23705 20.841 9.65901C21.2629 10.081 21.5 10.6533 21.5 11.25V18.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
