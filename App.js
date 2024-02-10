import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import Row from './components/Row';
import { StatusBar } from 'expo-status-bar';
import AddItemForm from './components/add';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TodoItem from './components/toDoItem';


const STORAGE_KEY = '@persons_key';

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (ex) {
    console.error(ex);
  }
};

export default function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState([]);

 //useEffect(() => {
           //setFilteredData(items); // Use items state instead of DATA
    //AsyncStorage.clear()  // Use this to clear the storage
   // getData()
  //}, []); // items // Add items to the dependency array 

  useEffect(() => {
    const fetchItems = async () => {
      const storedItems = await getData();
      if (storedItems && storedItems.length > 0) {
        setItems(storedItems);
        setFilteredData(storedItems);
      }
    };

    fetchItems();
  }, []);


  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bigBox}>
      
        <AddItemForm items={items} setItems={setItems} />
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={({ item }) => (
            <Row 
              item={item} 
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
          extraData={items} // to trigger re-render when 'items' changes
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  bigBox: {
    marginTop: 50,
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
  },
  // ... any other styles you have
});