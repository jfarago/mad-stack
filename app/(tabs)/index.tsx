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
    name: 'Campfire',
    file: require('../../assets/sounds/sound_jay/campfire-1.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'wind-gust-02',
    name: 'Wind Gust',
    file: require('../../assets/sounds/sound_jay/wind-gust-02.mp3'),
    defaultVolume: 0.5,
  },
  {
    id: 'windy-forest-ambience-01',
    name: 'Windy Forest',
    file: require('../../assets/sounds/sound_jay/windy-forest-ambience-01.mp3'),
    defaultVolume: 0.5,
  },
];

// Group all rain sounds for the menu
const rainSounds = [
  {
    id: 'rain-01',
    name: 'Rain 1',
    file: require('../../assets/sounds/sound_jay/rain-01.mp3'),
  },
  {
    id: 'rain-02',
    name: 'Rain 2',
    file: require('../../assets/sounds/sound_jay/rain-02.mp3'),
  },
  {
    id: 'rain-03',
    name: 'Rain 3',
    file: require('../../assets/sounds/sound_jay/rain-03.mp3'),
  },
  {
    id: 'rain-06',
    name: 'Rain 4',
    file: require('../../assets/sounds/sound_jay/rain-06.mp3'),
  },
];

// Group all ocean wave sounds for the menu
const oceanSounds = [
  {
    id: 'ocean-wave-1',
    name: 'Ocean 1',
    file: require('../../assets/sounds/sound_jay/ocean-wave-1.mp3'),
  },
  {
    id: 'ocean-wave-2',
    name: 'Ocean 2',
    file: require('../../assets/sounds/sound_jay/ocean-wave-2.mp3'),
  },
  {
    id: 'ocean-waves-1',
    name: 'Ocean 3',
    file: require('../../assets/sounds/sound_jay/ocean-waves-1.mp3'),
  },
];

export default function SleepSoundsScreen() {
  const insets = useSafeAreaInsets();
  const bottom = useBottomTabOverflow();

  // One useAudioPlayer per sound, each called directly as a hook
  const player0 = useAudioPlayer(soundOptions[0].file);
  const player1 = useAudioPlayer(soundOptions[1].file);
  const player2 = useAudioPlayer(soundOptions[2].file);

  const players = React.useMemo(() => [player0, player1, player2], [player0, player1, player2]);

  const [playStates, setPlayStates] = useState(Array(soundOptions.length).fill(false));
  const [volumes, setVolumes] = useState(soundOptions.map((opt) => opt.defaultVolume));

  // Rain player state
  const [selectedRain, setSelectedRain] = useState(rainSounds[0]);
  const rainPlayer = useAudioPlayer(selectedRain.file);
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.5);

  // Ocean player state
  const [selectedOcean, setSelectedOcean] = useState(oceanSounds[0]);
  const oceanPlayer = useAudioPlayer(selectedOcean.file);
  const [isOceanPlaying, setIsOceanPlaying] = useState(false);
  const [oceanVolume, setOceanVolume] = useState(0.5);

  // Sync volume and loop for each player
  useEffect(() => {
    players.forEach((player, i) => {
      player.volume = volumes[i];
      player.loop = true;
    });
  }, [volumes, players]);

  // Sync volume and loop for rain
  useEffect(() => {
    rainPlayer.volume = rainVolume;
    rainPlayer.loop = true;
  }, [rainVolume, rainPlayer]);

  // Sync volume and loop for ocean
  useEffect(() => {
    oceanPlayer.volume = oceanVolume;
    oceanPlayer.loop = true;
  }, [oceanVolume, oceanPlayer]);

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

  // 10 hour auto-stop for rain
  useEffect(() => {
    let timeout: number | undefined = undefined;
    if (isRainPlaying) {
      timeout = setTimeout(
        () => {
          rainPlayer.pause();
          setIsRainPlaying(false);
        },
        10 * 60 * 60 * 1000,
      );
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isRainPlaying, rainPlayer]);

  // 10 hour auto-stop for ocean
  useEffect(() => {
    let timeout: number | undefined = undefined;
    if (isOceanPlaying) {
      timeout = setTimeout(
        () => {
          oceanPlayer.pause();
          setIsOceanPlaying(false);
        },
        10 * 60 * 60 * 1000,
      );
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOceanPlaying, oceanPlayer]);

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

  // Play/pause handler for rain
  const handleRainPlayPause = async () => {
    if (isRainPlaying) {
      await rainPlayer.pause();
      setIsRainPlaying(false);
    } else {
      await rainPlayer.play();
      setIsRainPlaying(true);
    }
  };

  // Play/pause handler for ocean
  const handleOceanPlayPause = async () => {
    if (isOceanPlaying) {
      await oceanPlayer.pause();
      setIsOceanPlaying(false);
    } else {
      await oceanPlayer.play();
      setIsOceanPlaying(true);
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

  // When rain sound changes, keep play state
  useEffect(() => {
    if (isRainPlaying) {
      rainPlayer.play();
    } else {
      rainPlayer.pause();
    }
  }, [selectedRain, rainPlayer, isRainPlaying]);

  // When ocean sound changes, keep play state
  useEffect(() => {
    if (isOceanPlaying) {
      oceanPlayer.play();
    } else {
      oceanPlayer.pause();
    }
  }, [selectedOcean, oceanPlayer, isOceanPlaying]);

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
        {/* Rain player with menu */}
        <ThemedView style={styles.groupedRow}>
          <ThemedText style={styles.soundLabel}>Rain</ThemedText>
          <Slider
            style={styles.slider}
            value={rainVolume}
            onValueChange={setRainVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            minimumTrackTintColor="#4f8cff"
            thumbTintColor="#4f8cff"
          />
          <TouchableOpacity
            onPress={handleRainPlayPause}
            style={[styles.button, isRainPlaying && styles.buttonActive]}
          >
            <ThemedText style={styles.buttonText}>{isRainPlaying ? 'Stop' : 'Play'}</ThemedText>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
            {rainSounds.map((rain) => (
              <TouchableOpacity
                key={rain.id}
                style={[
                  styles.menuButton,
                  selectedRain.id === rain.id && styles.menuButtonSelected,
                ]}
                onPress={() => setSelectedRain(rain)}
                disabled={selectedRain.id === rain.id}
              >
                <ThemedText
                  style={[
                    styles.menuButtonText,
                    selectedRain.id === rain.id && styles.menuButtonTextSelected,
                  ]}
                >
                  {rain.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
        {/* Ocean player with menu */}
        <ThemedView style={styles.groupedRow}>
          <ThemedText style={styles.soundLabel}>Ocean Waves</ThemedText>
          <Slider
            style={styles.slider}
            value={oceanVolume}
            onValueChange={setOceanVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            minimumTrackTintColor="#4f8cff"
            thumbTintColor="#4f8cff"
          />
          <TouchableOpacity
            onPress={handleOceanPlayPause}
            style={[styles.button, isOceanPlaying && styles.buttonActive]}
          >
            <ThemedText style={styles.buttonText}>{isOceanPlaying ? 'Stop' : 'Play'}</ThemedText>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
            {oceanSounds.map((ocean) => (
              <TouchableOpacity
                key={ocean.id}
                style={[
                  styles.menuButton,
                  selectedOcean.id === ocean.id && styles.menuButtonSelected,
                ]}
                onPress={() => setSelectedOcean(ocean)}
                disabled={selectedOcean.id === ocean.id}
              >
                <ThemedText
                  style={[
                    styles.menuButtonText,
                    selectedOcean.id === ocean.id && styles.menuButtonTextSelected,
                  ]}
                >
                  {ocean.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
        <ThemedView>
          {soundOptions.map((opt, i) => (
            <ThemedView style={styles.groupedRow} key={opt.id}>
              <ThemedText style={styles.soundLabel}>{opt.name}</ThemedText>
              <Slider
                style={styles.slider}
                value={volumes[i]}
                onValueChange={(value) => handleVolumeChange(i, value)}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                minimumTrackTintColor="#4f8cff"
                thumbTintColor="#4f8cff"
              />
              <TouchableOpacity
                onPress={() => handlePlayPause(i)}
                style={[styles.button, playStates[i] && styles.buttonActive]}
              >
                <ThemedText style={styles.buttonText}>{playStates[i] ? 'Stop' : 'Play'}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#232b38',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonActive: {
    backgroundColor: '#4f8cff',
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
  menuButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#222',
    marginRight: 8,
  },
  menuButtonSelected: {
    backgroundColor: '#1E90FF',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  menuButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  groupSection: {
    marginBottom: 16,
  },
  groupedRow: {
    backgroundColor: '#1a2636',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  soundLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 2,
  },
  menuScroll: {
    marginTop: 8,
    marginBottom: 0,
  },
});
