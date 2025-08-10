import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Defs, Stop, LinearGradient, Path } from "react-native-svg";
import { Colors } from '@/constants/Colors';

interface CircularGaugeProps {
  value: number; // 0-100 사이의 값
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  title?: string;
}

export default function CircularGauge({
  value,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  title
}: CircularGaugeProps) {
  // 게이지의 중심과 반지름 계산
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const calculatedTextSize = (size * 0.18); // size의 18%로 계산

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
  const endAngle = startAngle + (value / 100) * 360;
  const piePath = describeArc(center, center, radius, startAngle, endAngle);
  const bgPath = describeArc(center, center, radius, endAngle, startAngle + 360);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          {/* 그라데이션 설정 */}
          <LinearGradient id="strokeGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            {['#BD0000', '#FF8282'].map((color, index) => (
              <Stop key={index} offset={`${(index / (2 - 1)) * 100}%`} stopColor={color} />
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
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 12,
      }}>
        {showValue && (
          <Text style={{
            fontSize: calculatedTextSize,
            fontWeight: 'bold',
            color: '#222',
          }}>{value}</Text>
        )}
        {title && (
          <Text style={{
            fontSize: calculatedTextSize * 0.4,
            fontWeight: 'normal',
            color: '#222',
            marginTop: 4,
          }}>{title}</Text>
        )}
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