import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface CircularProgressProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
}

export function CircularProgress({
  progress,
  size = 64,
  strokeWidth = 5,
  color = '#22E1A2',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const center = size / 2

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

