import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Svg, { Circle, Defs, Stop, LinearGradient, Path } from "react-native-svg";
import { Colors } from '../constants/Colors';

interface CircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularGauge({
  percentage,
  size = 72,
  strokeWidth = 12,
}: CircularGaugeProps) {
  // 게이지의 중심과 반지름 계산
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (circumference * percentage) / 100;

  // 파이(피자) 모양 게이지를 위한 각도 계산
  const startAngle = -90;
  const endAngle = startAngle + (percentage / 100) * 360;
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
  const piePath = describeArc(center, center, radius, startAngle, endAngle);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {/* LinearGradient 제거: 배경 그라데이션은 필요 없음 */}
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#BD0000" />
            <Stop offset="100%" stopColor="#FF8282" />
          </LinearGradient>
        </Defs>
        {/* 파이(피자) 모양 게이지 */}
        <Path
          d={piePath}
          fill="url(#strokeGradient)"
          // 그림자 효과를 파이 조각에 적용
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.22}
          shadowRadius={12}
        />
      </Svg>
      {/* 중앙 흰색 원(항상 위에 뜨도록) */}
      <View style={{
        position: 'absolute',
        width: size * 0.6,
        height: size * 0.6,
        left: size * 0.2,
        top: size * 0.2,
        borderRadius: size * 0.3,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 12,
      }}>
        <Text style={{ fontSize: size * 0.18, fontWeight: 'bold', color: '#222' }}>{percentage}</Text>
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
