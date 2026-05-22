import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ favorites, onRemoveFavorite, onSendMessage }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoriten</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'gespeichertes Item' : 'gespeicherte Items'}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Noch keine Favoriten gespeichert</Text>
          <Text style={styles.emptySubtext}>
            Gehe zum Swipe-Bildschirm und klicke auf das Herz, um Kleidungsstücke hinzuzufügen.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {favorites.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Pressable
                  style={styles.heartButton}
                  onPress={() => onRemoveFavorite(item.id)}
                >
                  <Ionicons name="heart" size={22} color="#f53b75" />
                </Pressable>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.detailsText}>
                  Größe {item.size}  •  {item.brand}
                </Text>

                <View style={styles.ownerRow}>
                  <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                    <Text style={styles.avatarText}>{item.owner[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.ownerName}>{item.owner}</Text>
                    <View style={styles.locationContainer}>
                      <Ionicons name="location-outline" size={12} color="#8e8e93" />
                      <Text style={styles.locationText}>
                        {item.location} • {item.distance}
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  style={styles.messageButton}
                  onPress={() => onSendMessage(item)}
                >
                  <Ionicons name="chatbubble-outline" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.messageButtonText}>Nachricht senden</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f2',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  scrollList: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.02)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffffff',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBlock: {
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  detailsText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f2',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#8e8e93',
    marginLeft: 3,
  },
  messageButton: {
    backgroundColor: '#f53b75',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
    shadowColor: '#f53b75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 6,
  },
  messageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
