import React from 'react';
import Svg, {Path, Mask, ClipPath, Defs, Rect, G} from 'react-native-svg';

interface HomeIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const HomeIcon: React.FC<HomeIconProps> = ({
  width = 25,
  height = 24,
  color = '#667085',
}) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
    <Defs>
      <ClipPath id="clip0_6011_187">
        <Rect width="24" height="24" fill="white" transform="translate(0.5)" />
      </ClipPath>
      <Mask
        id="mask0_6011_187"
        style={{maskType: 'luminance'}}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="25"
        height="24">
        <Path d="M0.5 0L0.5 24H24.5V0H0.5Z" fill="white" />
      </Mask>
    </Defs>
    <G clipPath="url(#clip0_6011_187)">
      <G mask="url(#mask0_6011_187)">
        <Path
          d="M19.0411 22.5H5.9502C4.29335 22.5 2.9502 21.1569 2.9502 19.5V11.6654C2.9502 10.5118 3.44829 9.4143 4.31659 8.65474L10.5204 3.22784C11.6514 2.2385 13.3398 2.23851 14.4708 3.22784L20.6747 8.65474C21.543 9.4143 22.0411 10.5118 22.0411 11.6654V19.5C22.0411 21.1569 20.6979 22.5 19.0411 22.5Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M10.5 16.8636H14.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </G>
    </G>
  </Svg>
);
