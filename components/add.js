import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoItem from './toDoItem';

const STORAGE_KEY = '@todo_items';

const AddItemForm = ({ items, setItems }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const storeData = async (newItems) => {
    try {
      const jsonValue = JSON.stringify(newItems);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (ex) {
      console.log(ex);
    }
  };

  const save = () => {
    if (!title.trim() || !text.trim()) {
      Alert.alert('Invalid Input', 'Title and text cannot be empty.');
      return;
    }

    const newItem = {
      id: String(items.length + 1),
      title: title,
      text: text,
      expanded: false, // Lisätään uusi kenttä hallitsemaan laajennetun näkymän tilaa
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    storeData(newItems);
    setTitle('');
    setText('');
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title..."
      />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="To do..."
      />
      <Button title='Save' onPress={save} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
  },
});

export default AddItemForm;