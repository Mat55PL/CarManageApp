import { StyleSheet, ScrollView, useColorScheme, Platform, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View, useThemeColor } from '@/components/Themed';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getAllStats } from '../services/API/apiStatsService';

interface DashboardStats {
  totalCars: number;
  totalFuelCost: number;
  totalServiceCost: number;
  totalDistance: number;
  recentActivities: Array<{
    id: number;
    type: 'fuel' | 'service';
    date: string;
    description: string;
  }>;
}

interface ThemeColors {
  background: string;
  text: string;
  subText: string;
  card: string;
  cardHighlight: string;
  error: string;
  errorText: string;
}

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
  const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');


  const theme: ThemeColors = {
    background: backgroundColor,
    text: textColor,
    subText: subTextColor,
    card: useThemeColor({ light: '#ffffff', dark: '#2d2d2d' }, 'background'),
    cardHighlight: useThemeColor({ light: '#f8f9fa', dark: '#363636' }, 'background'),
    error: useThemeColor({ light: '#fee2e2', dark: '#422' }, 'background'),
    errorText: useThemeColor({ light: '#dc2626', dark: '#ff4444' }, 'text'),
  };

  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalFuelCost: 0,
    totalServiceCost: 0,
    totalDistance: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getAllStats();
        setStats(statsData);

        setStats({
          totalCars: statsData.carsCount,
          totalFuelCost: statsData.totalFuelCost,
          totalServiceCost: statsData.totalServiceCost,
          totalDistance: 12500,
          recentActivities: [
            { id: 1, type: 'fuel', date: '2024-02-20', description: 'Tankowanie 45L' },
            { id: 2, type: 'service', date: '2024-02-15', description: 'Wymiana oleju' },
            { id: 3, type: 'fuel', date: '2024-02-10', description: 'Tankowanie 50L' }
          ]
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Nie udało się pobrać danych');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    iconName,
    iconFamily = 'MaterialCommunityIcons',
    color
  }: {
    title: string;
    value: string | number;
    iconName: string;
    iconFamily?: 'MaterialCommunityIcons' | 'FontAwesome5' | 'Ionicons';
    color: string;
  }) => {
    const IconComponent = {
      MaterialCommunityIcons,
      FontAwesome5,
      Ionicons
    }[iconFamily];

    return (
      <View style={[styles.statCard, {
        backgroundColor: theme.card,
        borderLeftColor: color
      }]}>
        <View style={styles.statCardContent}>
          <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
          <Text style={[styles.statTitle, { color: theme.subText }]}>{title}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <IconComponent name={iconName} size={24} color={color} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          padding: 20,
        }
      ]}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <ActivityIndicator
            size="large"
            color={'#007AFF'}
          />
          <Text style={{
            color: theme.text,
            fontSize: 16,
            fontWeight: '500',
            letterSpacing: 0.5,
            opacity: 0.8,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
          }}>
            Ładowanie...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Welcome Section */}
      <View style={[styles.welcomeSection, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>
          Witaj, {user?.displayName?.split(' ')[0] || 'Użytkowniku'}! 👋
        </Text>
        <Text style={[styles.dateText, { color: theme.subText }]}>
          {new Date().toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, { backgroundColor: 'transparent' }]}>
        <StatCard
          title="Pojazdy"
          value={stats.totalCars}
          iconName="car"
          iconFamily="MaterialCommunityIcons"
          color="#2196F3"
        />
        <StatCard
          title="Koszty paliwa"
          value={`${stats.totalFuelCost.toFixed(2)} zł`}
          iconName="gas-station"
          iconFamily="MaterialCommunityIcons"
          color="#4CAF50"
        />
        <StatCard
          title="Koszty serwisu"
          value={`${stats.totalServiceCost.toFixed(2)} zł`}
          iconName="tools"
          iconFamily="FontAwesome5"
          color="#FF9800"
        />
        <StatCard
          title="Łączny przebieg"
          value={`${stats.totalDistance} km`}
          iconName="trending-up"
          iconFamily="Ionicons"
          color="#9C27B0"
        />
      </View>

      {/* Recent Activities */}
      <View style={[styles.activitiesSection, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Ostatnie aktywności
        </Text>
        <View style={styles.activitiesList}>
          {stats.recentActivities?.map((activity) => (
            <View
              key={activity.id}
              style={[styles.activityItem, { backgroundColor: theme.cardHighlight }]}
            >
              <View style={[
                styles.activityIcon,
                { backgroundColor: activity.type === 'fuel' ? '#4CAF5020' : '#FF980020' }
              ]}>
                <MaterialCommunityIcons
                  name={activity.type === 'fuel' ? 'gas-station' : 'tools'}
                  size={20}
                  color={activity.type === 'fuel' ? '#4CAF50' : '#FF9800'}
                />
              </View>
              <View style={[styles.activityContent, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.activityDescription, { color: theme.text }]}>
                  {activity.description}
                </Text>
                <Text style={[styles.activityDate, { color: theme.subText }]}>
                  {activity.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.error }]}>
          <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardContent: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 8,
    borderRadius: 8,
  },
  activitiesSection: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activitiesList: {
    gap: 12,
    backgroundColor: 'transparent'
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  activityIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 12,
    marginTop: 2,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
  },
});