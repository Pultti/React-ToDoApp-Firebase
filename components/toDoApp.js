import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { firestore, collection, addDoc, deleteDoc, doc, getDocs } from '../firebase/Config';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../firebase/Config';

const STORAGE_KEY = '@todo_items';

//Component itself starts here
const TodoApp = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [duration, setDuration] = useState('default'); // Default duration
  const [priority, setPriority] = useState('default'); // Default priority

  useEffect(() => {
    const loadData = async () => {
      // Ensure there's a logged-in user
      const user = auth.currentUser;
      if(user) {
        // Modify the storage key to include the user's UID
        const userSpecificStorageKey = `${STORAGE_KEY}_${user.uid}`;
        try {
          const storedItems = await AsyncStorage.getItem(userSpecificStorageKey);
          if (storedItems) setItems(JSON.parse(storedItems));
        } catch (ex) {
          Alert.alert('Error', 'Failed to load the saved items.');
        }
      }
    };
    loadData();
  
    // Add a focus listener to reload data whenever the screen is focused
    const unsubscribe = navigation.addListener('focus', loadData);
  
    // Return the function to unsubscribe from the event listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  // Function to save items to AsyncStorage (local storage)
  const storeData = async (newItems) => {
    const user = auth.currentUser;
    if(user) {
      const userSpecificStorageKey = `${STORAGE_KEY}_${user.uid}`;
      try {
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem(userSpecificStorageKey, jsonValue);
      } catch (ex) {
        Alert.alert('Error', 'Failed to save items.');
      }
    }
  };

  // Function to check is the inputs valid for saving
  const save = () => {
    if (!title.trim()) {
      Alert.alert('Invalid Input', 'Title cannot be empty.');
      return;
    }
  
    const newItem = {
      id: String(new Date().getTime()), // Unique ID using timestamp
      title: title,
      text: text,
      duration: duration, //include the selected duration
      priority: priority, // Include the selected priority
      expanded: false,
    };
  
    const newItems = [...items, newItem];
    setItems(newItems);
    storeData(newItems);
    setTitle('');
    setText('');
    setPriority("0"); // Reset priority to default
    setDuration("0"); // Reset duration to default
  };

  // Function to delete an item from local storage
  const deleteItemLocally = async (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    await storeData(updatedItems); // Update AsyncStorage
  };

  return (
    <View style={styles.appContainer}>
        <Picker
          selectedValue={duration}
          style={styles.pickerStyle}
          onValueChange={(itemValue, itemIndex) => setDuration(itemValue)}
        >
        <Picker.Item label="Duration default" value="default" />
        <Picker.Item label="Duration 0.5h" value="0.5" />
        <Picker.Item label="Duration 1h" value="1" />
        <Picker.Item label="Duration 2h" value="2" />
        <Picker.Item label="Duration 3h" value="3" />
      </Picker>

      <Picker
        selectedValue={priority}
        style={styles.pickerStyle}
        onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
      >
        <Picker.Item label="Priority default" value="default" />
        <Picker.Item label="Priority 1" value="1" />
        <Picker.Item label="Priority 2" value="2" />
        <Picker.Item label="Priority 3" value="3" />
      </Picker>

      <View style={styles.formContainer}>
              <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="To do title..."
          style={styles.input}
        />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="To do list..."
        style={styles.input}
      />
      
       <View style={styles.buttonContainer}>
        <Button title="Save Locally" onPress={save} />
      </View>
 
    </View> 
    <ScrollView style={styles.scrollView}>
    {items.map((item) => (
  <View key={item.id} style={styles.itemContainer}>
    <TouchableOpacity 
      style={styles.itemContent} 
      onPress={() => setItems(items.map(it => 
        it.id === item.id ? { ...it, expanded: !it.expanded } : it
      ))}
    >
      <Text style={styles.title}>{item.title}</Text>
      {item.expanded && (
        <>
          <Text style={styles.text}>{item.text}</Text>

        </> 
      )}
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.deleteButton} 
      onPress={() => deleteItemLocally(item.id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View> 
))}
    <Button title="Proceed" onPress={() => navigation.navigate('manageDay', { manageDay: 'Morning' })} />
    </ScrollView>
  </View>
  
);
};

const styles = StyleSheet.create({
  appContainer: {
    padding: 20,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  itemContent: {
    flex: 1,
    paddingBottom: 20,
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'red',
  },
  title: {
    fontWeight: 'bold',
  },
  text: {
    paddingTop: 5,
  },
  buttonContainer: {
    marginBottom: 5,
  },
  input: {
    marginBottom: 10,
    fontSize: 16,
    padding: 10,
    
    // Define styles for TextInput here
  },
  pickerStyle: {
    height: 50,
    width: 200,
    // Define styles for Picker here
  },

});

export default TodoApp;


  // Tallelokero, älä huomioi tätä arvioinnissa. -Toni Isopoussu

  //Tallessa, jos haluat näyttää duration ja priority
  //<Text style={styles.detailText}>Duration: {item.duration}</Text>
  //<Text style={styles.detailText}>Priority: {item.priority}</Text>

  //Tallessa, jos päätän edetä firebasen kanssa
//   <View style={styles.buttonContainer}>
//   <Button title="Save to Firebase" onPress={saveToFirebase} />
// </View>
// <View style={styles.buttonContainer}>
//   <Button title="Clear All from Firebase" onPress={clearAllItemsFromFirebase} />
// </View>


// Define saveItemToFirebase function directly inside your component file
// const itemsRef = collection(firestore, "todo_items");

// Function to save items to Firebase
// const saveItemToFirebase = async (newItem) => {
//   try {
//     await addDoc(itemsRef, newItem);
//     return true;
//   } catch (ex) {
//     console.error("Error saving item to Firebase:", ex);
//     return false;
//   }
// };


  // Function to save items to Firebase
  // const saveToFirebase = async () => {
  //   if (!title.trim() || !text.trim()) {
  //     Alert.alert('Invalid Input', 'Title and To do cannot be empty.');
  //     return;
  //   }

    // const newItem = {
    //   title: title,
    //   text: text,
    //   expanded: false,
    // };

    // const success = await saveItemToFirebase(newItem); // Imported from your Firebase service file
    // if (success) {
    //   Alert.alert('Success', 'Item saved to Firebase.');
    //   setTitle('');
    //   setText('');
    // } else {
    //   Alert.alert('Error', 'Failed to save item to Firebase.');
    // }
  

  // Function to clear all items from Firebase
  // const clearAllItemsFromFirebase = async () => {
  //   const querySnapshot = await getDocs(itemsRef);
  //   querySnapshot.forEach((document) => {
  //     deleteDoc(doc(firestore, "todo_items", document.id));
  //   });
  // };