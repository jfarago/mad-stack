import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import Slider from '@react-native-community/slider';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Statically import all sounds from assets/sounds/sound_jay
const soundOptions = [
  {
    id: 'campfire-1',
    name: 'Campfire 1',
    file: require('../../assets/sounds/sound_jay/campfire-1.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'ocean-wave-1',
    name: 'Ocean Wave 1',
    file: require('../../assets/sounds/sound_jay/ocean-wave-1.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'ocean-wave-2',
    name: 'Ocean Wave 2',
    file: require('../../assets/sounds/sound_jay/ocean-wave-2.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'ocean-waves-1',
    name: 'Ocean Waves 1',
    file: require('../../assets/sounds/sound_jay/ocean-waves-1.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'rain-01',
    name: 'Rain 01',
    file: require('../../assets/sounds/sound_jay/rain-01.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'rain-02',
    name: 'Rain 02',
    file: require('../../assets/sounds/sound_jay/rain-02.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'rain-03',
    name: 'Rain 03',
    file: require('../../assets/sounds/sound_jay/rain-03.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'rain-06',
    name: 'Rain 06',
    file: require('../../assets/sounds/sound_jay/rain-06.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'wind-gust-02',
    name: 'Wind Gust 02',
    file: require('../../assets/sounds/sound_jay/wind-gust-02.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'windy-forest-ambience-01',
    name: 'Windy Forest Ambience 01',
    file: require('../../assets/sounds/sound_jay/windy-forest-ambience-01.mp3'),
    defaultVolume: 0.5,
  },
];

export default function SleepSoundsScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useBottomTabOverflow();

  // One useAudioPlayer per sound, each called directly as a hook
  const player0 = useAudioPlayer(soundOptions[0].file);
  const player1 = useAudioPlayer(soundOptions[1].file);
  const player2 = useAudioPlayer(soundOptions[2].file);
  const player3 = useAudioPlayer(soundOptions[3].file);
  const player4 = useAudioPlayer(soundOptions[4].file);
  const player5 = useAudioPlayer(soundOptions[5].file);
  const player6 = useAudioPlayer(soundOptions[6].file);
  const player7 = useAudioPlayer(soundOptions[7].file);
  const player8 = useAudioPlayer(soundOptions[8].file);
  const player9 = useAudioPlayer(soundOptions[9].file);

  const players = React.useMemo(
    () => [
      player0,
      player1,
      player2,
      player3,
      player4,
      player5,
      player6,
      player7,
      player8,
      player9,
    ],
    [player0, player1, player2, player3, player4, player5, player6, player7, player8, player9],
  );

  const [playStates, setPlayStates] = useState(Array(soundOptions.length).fill(false));
  const [volumes, setVolumes] = useState(soundOptions.map((opt) => opt.defaultVolume));

  // Sync volume and loop for each player
  useEffect(() => {
    players.forEach((player, i) => {
      player.volume = volumes[i];
      player.loop = true;
    });
  }, [volumes, players]);

  // 10 hour auto-stop for each player
  useEffect(() => {
    const timeouts = players.map((player, i) => {
      if (playStates[i]) {
        return setTimeout(
          () => {
            player.pause();
            setPlayStates((prev) => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
          },
          10 * 60 * 60 * 1000,
        );
      }
      return null;
    });
    return () => timeouts.forEach((t) => t && clearTimeout(t));
  }, [playStates, players]);

  // Play/pause handler for each sound
  const handlePlayPause = async (i: number) => {
    if (playStates[i]) {
      await players[i].pause();
      setPlayStates((prev) => {
        const next = [...prev];
        next[i] = false;
        return next;
      });
    } else {
      await players[i].play();
      setPlayStates((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      });
    }
  };

  // Volume change handler for each sound
  const handleVolumeChange = (i: number, value: number) => {
    setVolumes((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  useEffect(() => {
    setAudioModeAsync({
      interruptionMode: 'doNotMix',
      interruptionModeAndroid: 'doNotMix',
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      shouldRouteThroughEarpiece: false,
    });
  }, []);

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
            Sleep Sounds
          </ThemedText>
        </ThemedView>
        <ThemedView>
          {soundOptions.map((opt, i) => (
            <ThemedView style={styles.soundRow} key={opt.id}>
              <ThemedText style={styles.soundLabel}>{opt.name}</ThemedText>
              <Slider
                style={styles.slider}
                value={volumes[i]}
                onValueChange={(value) => handleVolumeChange(i, value)}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
              />
              <TouchableOpacity onPress={() => handlePlayPause(i)} style={styles.button}>
                <ThemedText style={styles.buttonText}>
                  {playStates[i] ? 'Pause' : 'Play'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
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
  soundRow: {
    marginBottom: 30,
  },
  soundLabel: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
  slider: {
    width: '100%',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
