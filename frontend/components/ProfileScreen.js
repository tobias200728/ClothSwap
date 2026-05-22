import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  Platform,
  Switch,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { BlurView } from 'expo-blur';

const { width } =
  Dimensions.get('window');

const COLORS = {
  light: {
    background: '#fff7f2',
    card: '#ffffff',
    text: '#1a1a1a',
    subtext: '#777',
    accent: '#ff7a59',
    softAccent: '#fff1ea',
    border: '#f2d9cf',
    input: '#fffaf7',
  },

  dark: {
    background: '#121212',
    card: '#1e1e1f',
    text: '#ffffff',
    subtext: '#aaaaaa',
    accent: '#ff8c69',
    softAccent: '#2c201c',
    border: '#2f2f32',
    input: '#2a2a2d',
  },
};

export default function ProfileScreen({
  userItems,
  onAddItem,
  userProfile,
  onUpdateProfile,
  darkMode,
  setDarkMode,
}) {
  const theme = darkMode
    ? COLORS.dark
    : COLORS.light;

  const [
    addModalVisible,
    setAddModalVisible,
  ] = useState(false);

  const [
    settingsModalVisible,
    setSettingsModalVisible,
  ] = useState(false);

  const [newTitle, setNewTitle] =
    useState('');

  const [newSize, setNewSize] =
    useState('M');

  const [
    uploadedImage,
    setUploadedImage,
  ] = useState(null);

  const [editName, setEditName] =
    useState(userProfile.name);

  const [
    editLocation,
    setEditLocation,
  ] = useState(
    userProfile.location
  );

  const [selectedPlan, setSelectedPlan] =
    useState('FREE');

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted)
      return;

    const result =
      await ImagePicker.launchImageLibraryAsync(
        {
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,

          allowsEditing: true,

          aspect: [4, 5],

          quality: 1,
        }
      );

    if (!result.canceled) {
      setUploadedImage(
        result.assets[0].uri
      );
    }
  };

  const handleCreateItem = () => {
    if (!newTitle.trim())
      return;

    onAddItem({
      id: `item_${Date.now()}`,

      title: newTitle,

      size: newSize,

      status: 'Verfügbar',

      image:
        uploadedImage ||
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    });

    setAddModalVisible(false);

    setNewTitle('');

    setUploadedImage(null);
  };

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
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View
          style={[
            styles.header,
            {
              backgroundColor:
                theme.accent,
            },
          ]}
        >
          <Pressable
            style={[
              styles.settingsBtn,
              {
                backgroundColor:
                  'rgba(255,255,255,0.22)',
              },
            ]}
            onPress={() =>
              setSettingsModalVisible(
                true
              )
            }
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color="#fff"
            />
          </Pressable>

          <View
            style={styles.avatar}
          >
            <Text
              style={
                styles.avatarText
              }
            >
              {userProfile.name[0]}
            </Text>
          </View>

          <Text style={styles.name}>
            {userProfile.name}
          </Text>

          <Text
            style={
              styles.location
            }
          >
            {userProfile.location}
          </Text>
        </View>

        {/* CLOTHES */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  theme.text,
              },
            ]}
          >
            Meine Kleidung
          </Text>

          <Pressable
            style={[
              styles.addBtn,
              {
                backgroundColor:
                  theme.accent,
              },
            ]}
            onPress={() =>
              setAddModalVisible(
                true
              )
            }
          >
            <Ionicons
              name="add"
              size={18}
              color="#fff"
            />

            <Text
              style={
                styles.addBtnText
              }
            >
              Hinzufügen
            </Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {userItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor:
                    theme.card,

                  borderColor:
                    theme.border,
                },
              ]}
            >
              <Image
                source={{
                  uri: item.image,
                }}
                style={
                  styles.cardImage
                }
              />

              <View
                style={
                  styles.cardInfo
                }
              >
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardSize,
                    {
                      color:
                        theme.subtext,
                    },
                  ]}
                >
                  Größe {item.size}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ADD MODAL */}

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
      >
        <BlurView
          intensity={45}
          tint={
            darkMode
              ? 'dark'
              : 'light'
          }
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  theme.card,

                borderColor:
                  theme.border,
              },
            ]}
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Kleidung hinzufügen
              </Text>

              <Pressable
                onPress={() =>
                  setAddModalVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.text}
                />
              </Pressable>
            </View>

            <TextInput
              placeholder="Titel"
              placeholderTextColor={
                theme.subtext
              }
              value={newTitle}
              onChangeText={
                setNewTitle
              }
              style={[
                styles.input,
                {
                  backgroundColor:
                    theme.input,

                  color:
                    theme.text,

                  borderColor:
                    theme.border,
                },
              ]}
            />

            <Pressable
              style={[
                styles.uploadButton,
                {
                  backgroundColor:
                    theme.softAccent,
                },
              ]}
              onPress={pickImage}
            >
              <Ionicons
                name="image-outline"
                size={22}
                color={
                  theme.accent
                }
              />

              <Text
                style={{
                  color:
                    theme.accent,

                  marginLeft: 8,

                  fontWeight:
                    '700',
                }}
              >
                Bild hochladen
              </Text>
            </Pressable>

            {uploadedImage && (
              <Image
                source={{
                  uri:
                    uploadedImage,
                }}
                style={
                  styles.previewImage
                }
              />
            )}

            <View
              style={
                styles.selectorRow
              }
            >
              {[
                'XS',
                'S',
                'M',
                'L',
                'XL',
              ].map((size) => (
                <Pressable
                  key={size}
                  style={[
                    styles.selectorBtn,

                    newSize ===
                      size && {
                      backgroundColor:
                        theme.accent,
                    },
                  ]}
                  onPress={() =>
                    setNewSize(
                      size
                    )
                  }
                >
                  <Text
                    style={{
                      color:
                        newSize ===
                        size
                          ? '#fff'
                          : theme.text,
                    }}
                  >
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[
                styles.submitBtn,
                {
                  backgroundColor:
                    theme.accent,
                },
              ]}
              onPress={
                handleCreateItem
              }
            >
              <Text
                style={
                  styles.submitBtnText
                }
              >
                Hinzufügen
              </Text>
            </Pressable>
          </View>
        </BlurView>
      </Modal>

      {/* SETTINGS */}

      <Modal
        visible={
          settingsModalVisible
        }
        transparent
        animationType="fade"
      >
        <BlurView
          intensity={45}
          tint={
            darkMode
              ? 'dark'
              : 'light'
          }
          style={
            styles.modalOverlay
          }
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.settingsScrollContainer
            }
          >
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor:
                    theme.card,

                  borderColor:
                    theme.border,
                },
              ]}
            >
              <View
                style={
                  styles.modalHeader
                }
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Einstellungen
                </Text>

                <Pressable
                  onPress={() =>
                    setSettingsModalVisible(
                      false
                    )
                  }
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={
                      theme.text
                    }
                  />
                </Pressable>
              </View>

              <View
                style={
                  styles.darkModeRow
                }
              >
                <View>
                  <Text
                    style={[
                      styles.darkModeTitle,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    Dark Mode
                  </Text>

                  <Text
                    style={[
                      styles.darkModeSub,
                      {
                        color:
                          theme.subtext,
                      },
                    ]}
                  >
                    Dunkles Design
                  </Text>
                </View>

                <Switch
                  value={
                    darkMode
                  }
                  onValueChange={(
                    v
                  ) =>
                    setDarkMode(v)
                  }
                  trackColor={{
                    true:
                      theme.accent,
                  }}
                />
              </View>

              <Text
                style={[
                  styles.subTitle,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Premium Abos
              </Text>

              {[
                {
                  id: 'GOLD',
                  color:
                    '#f7b731',
                },

                {
                  id: 'DIAMANT',
                  color:
                    '#45aaf2',
                },

                {
                  id: 'PLATIN',
                  color:
                    '#a5b1c2',
                },
              ].map((plan) => (
                <Pressable
                  key={plan.id}
                  style={[
                    styles.planCard,
                    {
                      borderColor:
                        selectedPlan ===
                        plan.id
                          ? plan.color
                          : theme.border,
                    },
                  ]}
                  onPress={() =>
                    setSelectedPlan(
                      plan.id
                    )
                  }
                >
                  <Text
                    style={{
                      color:
                        theme.text,

                      fontWeight:
                        '700',
                    }}
                  >
                    {plan.id}
                  </Text>

                  <Ionicons
                    name={
                      selectedPlan ===
                      plan.id
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={24}
                    color={
                      plan.color
                    }
                  />
                </Pressable>
              ))}

              <Pressable
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor:
                      theme.accent,
                  },
                ]}
                onPress={() => {
                  onUpdateProfile(
                    {
                      name: editName,

                      location:
                        editLocation,
                    }
                  );

                  setSettingsModalVisible(
                    false
                  );
                }}
              >
                <Text
                  style={
                    styles.submitBtnText
                  }
                >
                  Speichern
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    header: {
      alignItems: 'center',
      paddingTop:
        Platform.OS === 'ios'
          ? 18
          : 28,
      paddingBottom: 34,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
    },

    settingsScrollContainer: {
    flexGrow: 1,

    justifyContent: 'center',

    paddingVertical: 40,

    width: '100%',
    },

    settingsBtn: {
      position: 'absolute',
      right: 20,
      top:
        Platform.OS === 'ios'
          ? 20
          : 24,
      width: 42,
      height: 42,
      borderRadius: 21,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#fff',
      justifyContent:
        'center',
      alignItems: 'center',
      marginTop: 20,
    },

    avatarText: {
      color: '#ff7a59',
      fontSize: 42,
      fontWeight: '800',
    },

    name: {
      fontSize: 28,
      fontWeight: '800',
      marginTop: 18,
      color: '#fff',
    },

    location: {
      marginTop: 6,
      fontSize: 15,
      color: '#fff',
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 26,
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
    },

    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 18,
    },

    addBtnText: {
      color: '#fff',
      marginLeft: 6,
      fontWeight: '700',
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
      padding: 18,
    },

    card: {
      width:
        (width - 48) / 2,
      borderRadius: 24,
      overflow: 'hidden',
      marginBottom: 18,
      borderWidth: 1,
    },

    cardImage: {
      width: '100%',
      height: 180,
    },

    cardInfo: {
      padding: 14,
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
    },

    cardSize: {
      marginTop: 4,
    },

    modalOverlay: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    modalContent: {
      width: width * 0.88,

      maxHeight: '88%',

      alignSelf: 'center',

      borderRadius: 32,

      padding: 24,

      borderWidth: 1,
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 24,
      fontWeight: '800',
    },

    input: {
      height: 54,
      borderRadius: 18,
      borderWidth: 1,
      paddingHorizontal: 18,
      fontSize: 16,
      marginBottom: 10,
    },

    uploadButton: {
      height: 54,
      borderRadius: 18,
      justifyContent:
        'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 18,
    },

    previewImage: {
      width: '100%',
      height: 220,
      borderRadius: 22,
      marginBottom: 18,
    },

    selectorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },

    selectorBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor:
        'rgba(255,122,89,0.12)',
      marginRight: 10,
      marginBottom: 10,
    },

    submitBtn: {
      height: 56,
      borderRadius: 20,
      justifyContent:
        'center',
      alignItems: 'center',
      marginTop: 28,
    },

    submitBtnText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 16,
    },

    darkModeRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginTop: 24,
      padding: 18,
      borderRadius: 20,
      backgroundColor:
        'rgba(255,122,89,0.08)',
    },

    darkModeTitle: {
      fontSize: 16,
      fontWeight: '700',
    },

    darkModeSub: {
      fontSize: 13,
      marginTop: 4,
    },

    subTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginTop: 28,
      marginBottom: 14,
    },

    planCard: {
      height: 62,
      borderRadius: 20,
      borderWidth: 2,
      paddingHorizontal: 18,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
  });