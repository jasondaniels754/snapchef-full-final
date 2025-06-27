import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

export default function ChatScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Header title="Cooking Assistant" />
      <View style={styles.content}>
        <Text style={styles.text}>AI Cooking Assistant Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
}); 