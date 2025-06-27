import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeCard({ recipe, onClose, onSave }) {
  return (
    <Modal visible={!!recipe} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          {onSave && (
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <Ionicons name="bookmark-outline" size={24} color="#FF6B6B" />
              <Text style={styles.saveButtonText}>Save Recipe</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.recipeText}>{recipe}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FF6B6B',
    marginLeft: 5,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
