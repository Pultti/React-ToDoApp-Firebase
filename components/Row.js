import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

const Row = ({ item, selectedId, onSelect }) => {
  const backgroundColor = item.id === selectedId ? 'gray' : 'lightgray'; // Highlight selected row

  return (
    <Pressable onPress={() => onSelect(item.id)} style={[styles.row, { backgroundColor }]}>
      <Text style={styles.text}>{`${item.lastName}, ${item.firstName}`}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    borderRadius: 5,
    padding: 10,
    margin: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default Row;