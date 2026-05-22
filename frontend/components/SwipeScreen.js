import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SwipeScreen({ items, onLike, onDislike, onSelectDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const currentItem = items[currentIndex];

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          // Swipe Right (Like)
          Animated.timing(position, {
            toValue: { x: width + 100, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onLike(currentItem);
            nextCard();
          });
        } else if (gestureState.dx < -120) {
          // Swipe Left (Dislike)
          Animated.timing(position, {
            toValue: { x: -width - 100, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onDislike(currentItem);
            nextCard();
          });
        } else {
          // Snap back
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const nextCard = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePressDislike = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      onDislike(currentItem);
      nextCard();
    });
  };

  const handlePressLike = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      onLike(currentItem);
      nextCard();
    });
  };

  const handleReload = () => {
    setCurrentIndex(0);
  };

  if (currentIndex >= items.length) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="shirt-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Keine Kleidung mehr in der Nähe</Text>
        <Text style={styles.emptySubtitle}>
          Passe deine Filter an oder versuche es später noch einmal.
        </Text>
        <Pressable style={styles.reloadButton} onPress={handleReload}>
          <Text style={styles.reloadText}>Erneut starten</Text>
        </Pressable>
      </View>
    );
  }

  const nextItem = currentIndex + 1 < items.length ? items[currentIndex + 1] : null;

  return (
    <View style={styles.container}>
      <View style={styles.cardArea}>
        {/* Next Card (Background card) */}
        {nextItem && (
          <View style={[styles.card, styles.backgroundCard]}>
            <Image source={{ uri: nextItem.image }} style={styles.cardImage} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{nextItem.condition}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.titleText}>{nextItem.title}</Text>
              <Text style={styles.detailsText}>
                Größe: {nextItem.size}  •  {nextItem.brand}
              </Text>
              <View style={styles.ownerRow}>
                <View style={[styles.avatar, { backgroundColor: nextItem.avatarColor }]}>
                  <Text style={styles.avatarText}>{nextItem.owner[0]}</Text>
                </View>
                <Text style={styles.ownerName}>{nextItem.owner}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Current Card (Foreground card) */}
        <Animated.View
          {...(Platform.OS === 'web' ? {} : panResponder.panHandlers)}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotate },
              ],
            },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={() => onSelectDetail(currentItem)}>
            <Image source={{ uri: currentItem.image }} style={styles.cardImage} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{currentItem.condition}</Text>
            </View>

            {/* Like/Dislike indicator badges */}
            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabelText}>GEFÄLLT MIR</Text>
            </Animated.View>
            <Animated.View style={[styles.dislikeLabel, { opacity: dislikeOpacity }]}>
              <Text style={styles.dislikeLabelText}>NÄCHSTE</Text>
            </Animated.View>

            <View style={styles.infoBlock}>
              <Text style={styles.titleText}>{currentItem.title}</Text>
              <Text style={styles.detailsText}>
                Größe: {currentItem.size}  •  {currentItem.brand}
              </Text>
              <View style={styles.ownerRow}>
                <View style={[styles.avatar, { backgroundColor: currentItem.avatarColor }]}>
                  <Text style={styles.avatarText}>{currentItem.owner[0]}</Text>
                </View>
                <Text style={styles.ownerName}>{currentItem.owner}</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Button controls */}
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.actionButton, styles.dislikeButton]} onPress={handlePressDislike}>
          <Ionicons name="close" size={32} color="#ff4a4a" />
        </Pressable>
        <Pressable style={[styles.actionButton, styles.likeButton]} onPress={handlePressLike}>
          <Ionicons name="heart" size={32} color="#f53b75" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7fa',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  cardArea: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    aspectRatio: 0.72,
    position: 'relative',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 12,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  backgroundCard: {
    transform: [{ scale: 0.96 }, { translateY: 10 }],
    opacity: 0.9,
  },
  cardImage: {
    width: '100%',
    height: '68%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  infoBlock: {
    padding: 20,
    justifyContent: 'space-between',
    height: '32%',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
    marginTop: 16,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dislikeButton: {
    borderWidth: 1,
    borderColor: '#ffeaea',
  },
  likeButton: {
    borderWidth: 1,
    borderColor: '#ffe8f0',
  },
  likeLabel: {
    position: 'absolute',
    top: 40,
    left: 40,
    borderWidth: 3,
    borderColor: '#4cd964',
    padding: 8,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
  },
  likeLabelText: {
    color: '#4cd964',
    fontSize: 20,
    fontWeight: '800',
  },
  dislikeLabel: {
    position: 'absolute',
    top: 40,
    right: 40,
    borderWidth: 3,
    borderColor: '#ff3b30',
    padding: 8,
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
  },
  dislikeLabelText: {
    color: '#ff3b30',
    fontSize: 20,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff7fa',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  reloadButton: {
    backgroundColor: '#f53b75',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#f53b75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  reloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
