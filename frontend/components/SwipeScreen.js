import React, {
  useState,
  useRef,
  useEffect,
  memo,
} from 'react';

import {
  Text,
  View,
  Image,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, styles } from './styles/SwipeScreen.styles';

const { width } = Dimensions.get('window');

const SwipeScreen = ({
  items,
  onLike,
  onDislike,
  onSelectDetail,
  darkMode = false,
}) => {
  const theme = darkMode ? COLORS.dark : COLORS.light;

  const [currentIndex, setCurrentIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const currentItem = items[currentIndex];
  const nextItem = currentIndex + 1 < items.length ? items[currentIndex + 1] : null;

  useEffect(() => {
    if (nextItem?.image) Image.prefetch(nextItem.image);
    if (items[currentIndex + 2]?.image) Image.prefetch(items[currentIndex + 2].image);
  }, [currentIndex]);

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.965, 1],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.75, 1],
    extrapolate: 'clamp',
  });

  const nextCard = () => {
    cardOpacity.setValue(0);
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
    requestAnimationFrame(() => cardOpacity.setValue(1));
  };

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? width + 120 : -width - 120;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      direction === 'right' ? onLike(currentItem) : onDislike(currentItem);
      nextCard();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.1 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120 || gesture.vx > 1.25) {
          forceSwipe('right');
        } else if (gesture.dx < -120 || gesture.vx < -1.25) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  if (currentIndex >= items.length) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="flame-outline" size={70} color="#888" />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>Keine neuen Items</Text>
        <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
          Versuche es später erneut.
        </Text>
        <Pressable
          style={[styles.reloadButton, { backgroundColor: theme.accent }]}
          onPress={() => setCurrentIndex(0)}
        >
          <Text style={styles.reloadText}>Neustarten</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.cardArea}>
        {nextItem && (
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: nextCardOpacity,
                transform: [{ scale: nextCardScale }],
              },
            ]}
          >
            <Image source={{ uri: nextItem.image }} style={styles.cardImage} fadeDuration={0} />
          </Animated.View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: cardOpacity,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={() => onSelectDetail(currentItem)}>
            <Image source={{ uri: currentItem.image }} style={styles.cardImage} fadeDuration={0} />

            <Animated.View style={[styles.likeBadge, { opacity: likeOpacity }]}>
              <Text style={styles.likeBadgeText}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.nopeBadge, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeBadgeText}>NOPE</Text>
            </Animated.View>

            <View style={styles.infoContainer}>
              <Text style={styles.title}>{currentItem.title}</Text>
              <Text style={styles.details}>
                {currentItem.brand} • Größe {currentItem.size}
              </Text>
              <View style={styles.ownerRow}>
                {currentItem.ownerImage ? (
                  <Image source={{ uri: currentItem.ownerImage }} style={[styles.avatar, { overflow: 'hidden' }]} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: currentItem.avatarColor }]}>
                    <Text style={styles.avatarText}>{(currentItem.owner || '?')[0]}</Text>
                  </View>
                )}
                <Text style={styles.ownerName}>{currentItem.owner}</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.bottomActions}>
        <Pressable style={styles.smallButton} onPress={() => forceSwipe('left')}>
          <Ionicons name="close" size={24} color="#ff7a59" />
        </Pressable>
        <Pressable style={styles.bigButton} onPress={() => forceSwipe('right')}>
          <Ionicons name="heart" size={26} color="#ff9a76" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default memo(SwipeScreen);