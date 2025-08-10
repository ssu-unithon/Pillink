import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Defs, Stop, LinearGradient, Path } from "react-native-svg";
import { Colors } from '@/constants/Colors';

interface CircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  pieGradientColors?: string[];
  centerCircleColor?: string;
  percentageTextColor?: string;
  percentageTextSize?: number;
  percentageTextWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

export default function CircularGauge({
  percentage,
  size = 72,
  strokeWidth = 12,
  pieGradientColors = ['#BD0000', '#FF8282'], // Default gradient colors
  centerCircleColor = Colors.background, // Default white
  percentageTextColor = Colors.text, // Default dark text
  percentageTextSize, // 기본값 제거 - 크기에 비례하여 계산
  percentageTextWeight = 'bold', // Default font weight
}: CircularGaugeProps) {
  // 게이지의 중심과 반지름 계산
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const calculatedTextSize = percentageTextSize || (size * 0.18); // size의 18%로 계산

  // 파이 모양 게이지를 위한 각도 계산
  const startAngle = -90;
  const radians = (deg: number) => (deg * Math.PI) / 180;
  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = {
      x: cx + r * Math.cos(radians(startAngle)),
      y: cy + r * Math.sin(radians(startAngle)),
    };
    const end = {
      x: cx + r * Math.cos(radians(endAngle)),
      y: cy + r * Math.sin(radians(endAngle)),
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };
  const endAngle = startAngle + (percentage / 100) * 360;
  const piePath = describeArc(center, center, radius, startAngle, endAngle);
  const bgPath = describeArc(center, center, radius, endAngle, startAngle + 360);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          {/* 그라데이션 설정 */}
          <LinearGradient id="strokeGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            {pieGradientColors.map((color, index) => (
              <Stop key={index} offset={`${(index / (pieGradientColors.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        {/* 회색 부분 */}
        <Path
          d={bgPath}
          fill="#EFEFEF"
        />
        {/* 파이 모양 게이지 */}
        <Path
          d={piePath}
          fill="url(#strokeGradient)"
        />
      </Svg>
      {/* 중앙 흰색 원 */}
      <View style={{
        position: 'absolute',
        width: size * 0.6,
        height: size * 0.6,
        left: size * 0.2,
        top: size * 0.2,
        borderRadius: size * 0.3,
        backgroundColor: centerCircleColor,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 12,
      }}>
        <Text style={{
          fontSize: calculatedTextSize,
          fontWeight: 'bold',
          color: '#222',
        }}>{percentage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Clip content outside the rounded border
  },
});