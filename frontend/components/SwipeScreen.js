import React, {
  useState,
  useRef,
  useEffect,
  memo,
} from 'react';

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

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

const { width, height } =
  Dimensions.get('window');

const COLORS = {
  light: {
    background: '#fff7f2',
    card: '#ffffff',
    text: '#111111',
    subtext: '#777777',
    accent: '#ff7a59',
    border: '#ededf1',
  },

  dark: {
    background: '#121212',
    card: '#1d1d1f',
    text: '#ffffff',
    subtext: '#aaaaaa',
    accent: '#ff8c69',
    border: '#2f2f32',
  },
};

const SwipeScreen = ({
  items,
  onLike,
  onDislike,
  onSelectDetail,
  darkMode = false,
}) => {
  const theme = darkMode
    ? COLORS.dark
    : COLORS.light;

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const position = useRef(
    new Animated.ValueXY()
  ).current;

  const currentItem =
    items[currentIndex];

  const nextItem =
    currentIndex + 1 <
    items.length
      ? items[currentIndex + 1]
      : null;

  // PREFETCH IMAGES
  useEffect(() => {
    if (nextItem?.image) {
      Image.prefetch(
        nextItem.image
      );
    }

    if (
      items[currentIndex + 2]
        ?.image
    ) {
      Image.prefetch(
        items[currentIndex + 2]
          .image
      );
    }
  }, [currentIndex]);

  const rotate =
    position.x.interpolate({
      inputRange: [
        -width / 2,
        0,
        width / 2,
      ],

      outputRange: [
        '-12deg',
        '0deg',
        '12deg',
      ],

      extrapolate: 'clamp',
    });

  const likeOpacity =
    position.x.interpolate({
      inputRange: [0, width / 4],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const nopeOpacity =
    position.x.interpolate({
      inputRange: [
        -width / 4,
        0,
      ],

      outputRange: [1, 0],

      extrapolate: 'clamp',
    });

  const nextCardScale =
    position.x.interpolate({
      inputRange: [
        -width / 2,
        0,
        width / 2,
      ],

      outputRange: [
        1,
        0.965,
        1,
      ],

      extrapolate: 'clamp',
    });

  const nextCardOpacity =
    position.x.interpolate({
      inputRange: [
        -width / 2,
        0,
        width / 2,
      ],

      outputRange: [
        1,
        0.75,
        1,
      ],

      extrapolate: 'clamp',
    });

  const nextCard = () => {
    position.setValue({
      x: 0,
      y: 0,
    });

    setCurrentIndex(
      (prev) => prev + 1
    );
  };

  const forceSwipe = (
    direction
  ) => {
    const x =
      direction === 'right'
        ? width + 120
        : -width - 120;

    Animated.timing(position, {
      toValue: { x, y: 0 },

      duration: 180,

      useNativeDriver: true,
    }).start(() => {
      direction === 'right'
        ? onLike(currentItem)
        : onDislike(currentItem);

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
      onMoveShouldSetPanResponder:
        (_, gesture) => {
          return (
            Math.abs(
              gesture.dx
            ) > 10
          );
        },

      onPanResponderMove:
        (_, gesture) => {
          position.setValue({
            x: gesture.dx,

            y:
              gesture.dy * 0.1,
          });
        },

      onPanResponderRelease:
        (_, gesture) => {
          if (
            gesture.dx > 120 ||
            gesture.vx > 1.25
          ) {
            forceSwipe(
              'right'
            );
          } else if (
            gesture.dx <
              -120 ||
            gesture.vx < -1.25
          ) {
            forceSwipe('left');
          } else {
            resetPosition();
          }
        },
    })
  ).current;

  if (
    currentIndex >= items.length
  ) {
    return (
      <SafeAreaView
        style={[
          styles.emptyContainer,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <Ionicons
          name="flame-outline"
          size={70}
          color="#888"
        />

        <Text
          style={[
            styles.emptyTitle,
            {
              color: theme.text,
            },
          ]}
        >
          Keine neuen Items
        </Text>

        <Text
          style={[
            styles.emptySubtitle,
            {
              color:
                theme.subtext,
            },
          ]}
        >
          Versuche es später
          erneut.
        </Text>

        <Pressable
          style={[
            styles.reloadButton,
            {
              backgroundColor:
                theme.accent,
            },
          ]}
          onPress={() =>
            setCurrentIndex(0)
          }
        >
          <Text
            style={
              styles.reloadText
            }
          >
            Neustarten
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <View style={styles.cardArea}>
        {nextItem && (
          <Animated.View
            style={[
              styles.card,

              {
                backgroundColor:
                  theme.card,

                borderColor:
                  theme.border,

                opacity:
                  nextCardOpacity,

                transform: [
                  {
                    scale:
                      nextCardScale,
                  },
                ],
              },
            ]}
          >
            <Image
              source={{
                uri: nextItem.image,
              }}
              style={
                styles.cardImage
              }
              fadeDuration={0}
            />
          </Animated.View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,

            {
              backgroundColor:
                theme.card,

              borderColor:
                theme.border,

              transform: [
                {
                  translateX:
                    position.x,
                },

                {
                  translateY:
                    position.y,
                },

                { rotate },
              ],
            },
          ]}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() =>
              onSelectDetail(
                currentItem
              )
            }
          >
            <Image
              source={{
                uri:
                  currentItem.image,
              }}
              style={
                styles.cardImage
              }
              fadeDuration={0}
            />

            {/* LIKE */}

            <Animated.View
              style={[
                styles.likeBadge,

                {
                  opacity:
                    likeOpacity,
                },
              ]}
            >
              <Text
                style={
                  styles.likeBadgeText
                }
              >
                LIKE
              </Text>
            </Animated.View>

            {/* NOPE */}

            <Animated.View
              style={[
                styles.nopeBadge,

                {
                  opacity:
                    nopeOpacity,
                },
              ]}
            >
              <Text
                style={
                  styles.nopeBadgeText
                }
              >
                NOPE
              </Text>
            </Animated.View>

            {/* INFO */}

            <View
              style={
                styles.infoContainer
              }
            >
              <Text
                style={styles.title}
              >
                {
                  currentItem.title
                }
              </Text>

              <Text
                style={
                  styles.details
                }
              >
                {
                  currentItem.brand
                }{' '}
                • Größe{' '}
                {
                  currentItem.size
                }
              </Text>

              <View
                style={
                  styles.ownerRow
                }
              >
                <View
                  style={[
                    styles.avatar,

                    {
                      backgroundColor:
                        currentItem.avatarColor,
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.avatarText
                    }
                  >
                    {
                      currentItem
                        .owner[0]
                    }
                  </Text>
                </View>

                <Text
                  style={
                    styles.ownerName
                  }
                >
                  {
                    currentItem.owner
                  }
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* BUTTONS */}

      <View
        style={
          styles.bottomActions
        }
      >
        <Pressable
          style={
            styles.smallButton
          }
          onPress={() =>
            forceSwipe('left')
          }
        >
          <Ionicons
            name="close"
            size={24}
            color="#ff7a59"
          />
        </Pressable>

        <Pressable
          style={styles.bigButton}
          onPress={() =>
            forceSwipe(
              'right'
            )
          }
        >
          <Ionicons
            name="heart"
            size={26}
            color="#ff9a76"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default memo(
  SwipeScreen
);

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    cardArea: {
      flex: 1,

      justifyContent:
        'center',

      alignItems: 'center',

      paddingTop:
        Platform.OS ===
        'ios'
          ? 42
          : 12,
    },

    card: {
      width: width - 24,

      height: height * 0.74,

      borderRadius: 28,

      overflow: 'hidden',

      position: 'absolute',

      borderWidth: 1,

      renderToHardwareTextureAndroid: true,

      shouldRasterizeIOS: true,
    },

    cardImage: {
      width: '100%',
      height: '100%',
    },

    likeBadge: {
      position: 'absolute',

      top: 115,

      left: 24,

      borderWidth: 5,

      borderColor:
        '#ffb089',

      paddingHorizontal: 16,

      paddingVertical: 10,

      borderRadius: 12,

      transform: [
        {
          rotate: '-14deg',
        },
      ],
    },

    likeBadgeText: {
      color: '#ffb089',

      fontSize: 34,

      fontWeight: '900',
    },

    nopeBadge: {
      position: 'absolute',

      top: 115,

      right: 24,

      borderWidth: 5,

      borderColor:
        '#ff7a59',

      paddingHorizontal: 16,

      paddingVertical: 10,

      borderRadius: 12,

      transform: [
        {
          rotate: '14deg',
        },
      ],
    },

    nopeBadgeText: {
      color: '#ff7a59',

      fontSize: 34,

      fontWeight: '900',
    },

    infoContainer: {
      position: 'absolute',

      bottom: 28,

      left: 24,

      right: 24,
    },

    title: {
      color: '#fff',

      fontSize: 34,

      fontWeight: '800',
    },

    details: {
      marginTop: 6,

      color: '#fff',

      fontSize: 15,

      opacity: 0.9,
    },

    ownerRow: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 18,
    },

    avatar: {
      width: 38,

      height: 38,

      borderRadius: 19,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 10,
    },

    avatarText: {
      color: '#fff',

      fontWeight: '700',
    },

    ownerName: {
      color: '#fff',

      fontSize: 15,

      fontWeight: '600',
    },

    bottomActions: {
      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems: 'center',

      paddingBottom:
        Platform.OS ===
        'ios'
          ? 36
          : 20,

      marginTop: 12,
    },

    smallButton: {
      width: 52,

      height: 52,

      borderRadius: 26,

      backgroundColor:
        '#fff',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginHorizontal: 18,
    },

    bigButton: {
      width: 58,

      height: 58,

      borderRadius: 29,

      backgroundColor:
        '#fff',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginHorizontal: 18,
    },

    emptyContainer: {
      flex: 1,

      justifyContent:
        'center',

      alignItems: 'center',
    },

    emptyTitle: {
      fontSize: 28,

      fontWeight: '800',

      marginTop: 18,
    },

    emptySubtitle: {
      marginTop: 8,

      fontSize: 15,
    },

    reloadButton: {
      marginTop: 26,

      paddingHorizontal: 26,

      paddingVertical: 14,

      borderRadius: 20,
    },

    reloadText: {
      color: '#fff',

      fontWeight: '700',

      fontSize: 15,
    },
  });