import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useState } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
const LOCAL_TIME_ZONE = 'T00:00:00'; // Local time for start dates
const TIMERS = [
  {
    id: '1',
    title: 'Quit Drinking',
    startDate: new Date('2025-03-28' + LOCAL_TIME_ZONE),
    color: COLORS[4],
  },
  {
    id: '2',
    title: 'Married',
    startDate: new Date('2016-7-5' + LOCAL_TIME_ZONE),
    color: COLORS[2],
  },
  {
    id: '3',
    title: 'Taz Born',
    startDate: new Date('2011-3-14' + LOCAL_TIME_ZONE),
    color: COLORS[3],
  },
];

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView>
      <ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.headerRow}>
          <ThemedText type="title" style={styles.headerTitle}>
            Milestone Tracker
          </ThemedText>
        </ThemedView>
        <ThemedView>
          {TIMERS.map((timer) => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

function TimerItem({
  timer,
}: {
  timer: { id: string; title: string; startDate: Date; color: string };
}) {
  const [now] = useState(Date.now());

  // Calculate the difference in ms and convert to duration
  const diffMs = Math.max(0, now - timer.startDate.getTime());
  let remaining = Math.floor(diffMs / 1000);
  const y = Math.floor(remaining / (365 * 24 * 60 * 60));
  remaining %= 365 * 24 * 60 * 60;
  const m = Math.floor(remaining / (30 * 24 * 60 * 60));
  remaining %= 30 * 24 * 60 * 60;
  const d = Math.floor(remaining / (24 * 60 * 60));
  remaining %= 24 * 60 * 60;
  let str = '';
  if (y) str += `${y}y `;
  if (m) str += `${m}m `;
  if (d) str += `${d}d `;

  return (
    <ThemedView style={styles.timerContainer}>
      <Animated.View style={[styles.timerBox, { backgroundColor: timer.color }]}>
        <ThemedText style={styles.title}>{timer.title}</ThemedText>

        <ThemedText type="title" style={styles.date}>
          {timer.startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </ThemedText>
        <ThemedText type="title" style={styles.counter}>
          {str.trim()}
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  timerBox: {
    flexGrow: 1,
    height: 180,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 32,
    lineHeight: 48,

    fontWeight: 'bold',
    textAlign: 'center',
  },
  counter: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
