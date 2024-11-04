import { StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { ICar } from '@/constants/Interfaces/ICar';

export default function TabOneScreen() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://mattu.bieda.it/api/car', {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setCars(data))
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Błąd pobrania danych...');
      });
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<ICar>) => (
    <View style={styles.carItem}>
      <Text>Brand: {item.brand}</Text>
      <Text>Model: {item.model}</Text>
      <Text>Year: {item.year}</Text>
      <Text>Number Plate: {item.numberPlate}</Text>
    </View>
  );

  const listHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );

  const listFooter = () => (
    <View style={styles.footerContainer}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text>Sprawdź swoje połączenie z internetem... 😥</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={cars}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  listContainer: {
    alignItems: 'center',
  },
  carItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#11A3D8',
    borderRadius: 5,
    width: '90%',
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#294230',
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
