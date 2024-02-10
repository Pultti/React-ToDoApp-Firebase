import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TodoItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {expanded && <Text style={styles.text}>{item.text}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  text: {
    paddingTop: 5,
  },
});

export default TodoItem;