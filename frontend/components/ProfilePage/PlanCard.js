import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ProfileScreen.styles';

export default function PlanCard({ plan, isActive, onPress, theme }) {
  const bg = theme === 'dark' ? plan.darkBg : plan.bg;

  return (
    <Pressable
      style={[
        styles.planCard,
        { backgroundColor: bg, borderColor: isActive ? plan.color : 'transparent' },
      ]}
      onPress={onPress}
    >
      {isActive && (
        <View style={[styles.currentBadge, { backgroundColor: plan.color }]}>
          <Text style={styles.currentBadgeText}>Aktiv</Text>
        </View>
      )}

      <View style={styles.planCardHeader}>
        <View style={styles.planCardLeft}>
          <View style={[styles.planIconCircle, { backgroundColor: plan.color + '30' }]}>
            <Ionicons name={plan.icon} size={18} color={plan.color} />
          </View>
          <Text style={[styles.planName, { color: plan.color }]}>{plan.id}</Text>
        </View>

        <View style={styles.planPriceRow}>
          <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
          <Text style={[styles.planPeriod, { color: plan.color }]}>{plan.period}</Text>
        </View>
      </View>

      <View style={styles.planPerks}>
        {plan.perks.map((perk) => (
          <View key={perk} style={styles.planPerkRow}>
            <Ionicons name="checkmark-circle" size={15} color={plan.color} />
            <Text style={[styles.planPerkText, { color: plan.color }]}>{perk}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}