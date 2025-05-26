import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import Slider from '@react-native-community/slider';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const soundOptions = [
  {
    id: 'rain',
    name: 'Rain',
    file: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
    defaultVolume: 0.5,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    file: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3',
    defaultVolume: 0.5,
  },
  // Add more sounds here as needed
];

export default function SleepSoundsScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useBottomTabOverflow();

  // One useAudioPlayer per sound
  const rainPlayer = useAudioPlayer(soundOptions[0].file);
  const oceanPlayer = useAudioPlayer(soundOptions[1].file);
  // Add more players as needed

  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [isOceanPlaying, setIsOceanPlaying] = useState(false);
  const [rainVolume, setRainVolume] = useState(soundOptions[0].defaultVolume);
  const [oceanVolume, setOceanVolume] = useState(soundOptions[1].defaultVolume);

  // Sync volume to player
  useEffect(() => {
    rainPlayer.volume = rainVolume;
  }, [rainVolume, rainPlayer]);
  useEffect(() => {
    oceanPlayer.volume = oceanVolume;
  }, [oceanVolume, oceanPlayer]);

  // Play/pause handlers
  const handleRainPlayPause = async () => {
    if (isRainPlaying) {
      await rainPlayer.pause();
      setIsRainPlaying(false);
    } else {
      await rainPlayer.play();
      setIsRainPlaying(true);
    }
  };
  const handleOceanPlayPause = async () => {
    if (isOceanPlaying) {
      await oceanPlayer.pause();
      setIsOceanPlaying(false);
    } else {
      await oceanPlayer.play();
      setIsOceanPlaying(true);
    }
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
        <ThemedText style={styles.title}>Sleep Sounds</ThemedText>
        <ThemedView style={styles.soundRow}>
          <ThemedText style={styles.soundLabel}>{soundOptions[0].name}</ThemedText>
          <Slider
            style={styles.slider}
            value={rainVolume}
            onValueChange={setRainVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
          />
          <TouchableOpacity onPress={handleRainPlayPause} style={styles.button}>
            <ThemedText style={styles.buttonText}>{isRainPlaying ? 'Pause' : 'Play'}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.soundRow}>
          <ThemedText style={styles.soundLabel}>{soundOptions[1].name}</ThemedText>
          <Slider
            style={styles.slider}
            value={oceanVolume}
            onValueChange={setOceanVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
          />
          <TouchableOpacity onPress={handleOceanPlayPause} style={styles.button}>
            <ThemedText style={styles.buttonText}>{isOceanPlaying ? 'Pause' : 'Play'}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
