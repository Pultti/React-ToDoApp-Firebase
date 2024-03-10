import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoApp from './components/toDoApp'; // Adjust path as necessary
import ManageDay from './components/manageDay'; // Adjust path as necessary
import Login from './components/login';
import Settings from './components/settings';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from './firebase/Config';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
             <Stack.Screen
                name="TodoApp"
                component={TodoApp}
                options={({ navigation }) => ({
                  headerTitle: user ? `You got this: ${
                    user.email.split('@')[0].slice(0, 8)
                  }...` : 'Tasks to do',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                      <Icon name="gear" size={24} color="black" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="manageDay" component={ManageDay} options={{ title: 'Showcasing tasks' }} />
            </>
          ) : (
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {props => <Login {...props} onLoginSuccess={setUser} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default App;