import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/Config'; // Adjust the path as necessary

export default function Settings({ navigation }) {
  const handleDeleteUser = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.delete();
        Alert.alert("Account Deleted", "Your account has been successfully deleted.");
        navigation.navigate('Login'); // Navigate back to the login screen or wherever makes sense for your app
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete the user account.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Logged Out", "You have been successfully logged out.");
      navigation.replace('Login'); // Use replace to prevent going back to the settings screen after logout
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.button}>
      <Button title="Delete Account" onPress={handleDeleteUser} />
    </View>
    <View style={styles.button}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', // Adjust to position buttons at the bottom
      alignItems: 'center',
      marginTop: 50, // Add some bottom margin
    },
    button: {
      minWidth: 200, // Ensure buttons have a minimum width
      marginVertical: 10, // Add vertical margin between buttons
    },
  });