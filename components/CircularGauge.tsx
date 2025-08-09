import React from "react";
import { View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularGauge({
                                        percentage,
                                        size = 80,
                                        strokeWidth = 8,
                                      }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (percentage / 100);
  return (
    <View style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 8,
      backgroundColor: 'transparent',
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Svg width={size} height={size}>
        {/* 흰색 배경 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#fff"
        />
        {/* 배경 원 */}
        <Circle
          stroke="#eee"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* 진행 원 (그라데이션) */}
        <Circle
          stroke="url(#gaugeGradient)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth * 1.5} // 더 굵게
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2={size} y2={size}>
            <stop offset="0%" stopColor="#ff7676" />
            <stop offset="100%" stopColor="#ff3b30" />
          </linearGradient>
        </defs>
        {/* 중앙 텍스트 */}
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={size / 2.5}
          fontWeight="bold"
          fill="#222"
        >
          {percentage}
        </SvgText>
      </Svg>
    </View>
  );
}