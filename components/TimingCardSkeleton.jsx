import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function TimingCardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dateSkeleton, shimmerStyle]} />
      <View style={styles.timingsContainer}>
        <View style={styles.timing}>
          <Animated.View style={[styles.iconSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.labelSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.timeSkeleton, shimmerStyle]} />
        </View>
        <View style={styles.divider} />
        <View style={styles.timing}>
          <Animated.View style={[styles.iconSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.labelSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.timeSkeleton, shimmerStyle]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dateSkeleton: {
    height: 16,
    width: '60%',
    marginBottom: 12,
    alignSelf: 'center',
    backgroundColor: '#475569',
    borderRadius: 4,
  },
  timingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timing: {
    alignItems: 'center',
  },
  iconSkeleton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    marginBottom: 4,
  },
  labelSkeleton: {
    height: 16,
    width: 80,
    borderRadius: 4,
    backgroundColor: '#475569',
    marginVertical: 4,
  },
  timeSkeleton: {
    height: 16,
    width: 100,
    borderRadius: 4,
    marginTop: 6,
    backgroundColor: '#F59E0B',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#475569',
  },
});
