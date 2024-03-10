// ManageDay.js
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/Config';

const STORAGE_KEY = '@todo_items';

const getTimeFrame = (timeOfDay) => {
    switch (timeOfDay) {
        case 'Morning':
            return { start: 8, end: 13 }; 
        case 'Mid-day':
            return { start: 13, end: 18 }; 
        case 'Evening':
            return { start: 18, end: 24 }; 
        case 'Day':
            return { start: 9, end: 22 }; 
        default:
            return { start: 9, end: 22 }; // Default to day
    }
};

const formatTime = (hours) => {
    const fullHours = Math.floor(hours);
    const minutes = (hours - fullHours) * 60;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${fullHours}:${paddedMinutes}`;
};

const assignToDosToTimeSlots = (todos, timeFrame) => {
    const assignedTodos = [];
    let currentTime = timeFrame.start;
    let tasksExceedDayTime = false;

    todos.forEach(todo => {
        const taskDuration = parseFloat(todo.duration) || 1; // Default duration to 1 hour if not specified
        const endTime = currentTime + taskDuration;

        // Check if the end time of the current task exceeds the time frame end
        if (endTime > timeFrame.end) {
            tasksExceedDayTime = true; // Set the flag to true if there's not enough time
        } else {
            assignedTodos.push({
                ...todo,
                timeSlot: `${formatTime(currentTime)} - ${formatTime(endTime)}`
            });
            currentTime = endTime; // Move to the end of the current task
        }
    });

    return { assignedTodos, tasksExceedDayTime };
};

const ManageDay = ({ route, navigation }) => {
    const [currentTOD, setCurrentTOD] = useState(route.params.timeOfDay);
    const [sortedItems, setSortedItems] = useState([]);
    const [activitySuggestion, setActivitySuggestion] = useState(null);

    const fetchActivitySuggestion = async () => {
        try {
            const response = await fetch('https://www.boredapi.com/api/activity?type=relaxation&participants=1');
            const activity = await response.json();
            setActivitySuggestion(activity.activity); // set the fetched activity to state
        } catch (error) {
            console.error("Error fetching activity:", error);
            setActivitySuggestion("We couldn't fetch a break activity, please try again later."); // reset the activity suggestion on error
        }
    };

    const handleTaskCompletion = async (taskId) => {
        const user = auth.currentUser;
        if (user) {
          const userSpecificStorageKey = `${STORAGE_KEY}_${user.uid}`;
          const remainingTasks = sortedItems.filter(task => task.id !== taskId);
        
          // Update the local state with the remaining tasks
          setSortedItems(remainingTasks);
        
          // Update user-specific AsyncStorage with the new tasks array
          await AsyncStorage.setItem(userSpecificStorageKey, JSON.stringify(remainingTasks));
        
          // Fetch a new activity suggestion as a reward for completing the task
          fetchActivitySuggestion();
        }
      };

      useEffect(() => {
        const fetchTodos = async () => {
            const user = auth.currentUser;
            if (user) {
                const userSpecificStorageKey = `${STORAGE_KEY}_${user.uid}`;
                try {
                    const storedItems = await AsyncStorage.getItem(userSpecificStorageKey);
                    if (storedItems) {
                        const items = JSON.parse(storedItems);
                        const sortedItems = items.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
                        const timeFrame = getTimeFrame(currentTOD);
                        const { assignedTodos, tasksExceedDayTime } = assignToDosToTimeSlots(sortedItems, timeFrame);
                        setSortedItems(assignedTodos);
                        if (tasksExceedDayTime) {
                            alert('There is too much to do, not everything fits in the selected time frame!');
                        }
                    }
                } catch (error) {
                    console.error("Failed to load items:", error);
                }
            }
        };
    
        fetchTodos();
    }, [currentTOD]);


    return (
        <View style={styles.container}>
            <Button title="Morning" onPress={() => setCurrentTOD('Morning')} />
            <Button title="Mid-day" onPress={() => setCurrentTOD('Mid-day')} />
            <Button title="Evening" onPress={() => setCurrentTOD('Evening')} />
            <Button title="Day" onPress={() => setCurrentTOD('Day')} />
            <ScrollView style={styles.scrollView}>
                {sortedItems.map((item, index) => (
                    <View key={index} style={styles.todoItem}>
                        <Text style={styles.timeSlot}>{item.timeSlot}</Text>
                        <Text style={styles.title}>Title: {item.title}</Text>
                        <Text style={styles.details}>To do: {item.text}</Text>
                        <Text style={styles.priority}>Priority: {item.priority}</Text>
                        <Text style={styles.duration}>Duration: {item.duration || 1}</Text>
                        <Button title="Complete Task" onPress={() => handleTaskCompletion(item.id)} />
                    </View>
                ))}
            </ScrollView>
            {activitySuggestion && (
                <View style={styles.activitySuggestionContainer}>
                    <Text style={styles.activitySuggestionTitle}>Take a break! How about:</Text>
                    <Text style={styles.activitySuggestion}>{activitySuggestion}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#f7f7f7', // Light grey background
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: 10,
        borderRadius: 5,
    },
    scrollView: {
        marginVertical: 20,
    },
    todoItem: {
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    timeSlot: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    details: {
        fontSize: 14,
        color: '#555',
    },
    priorityIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    activitySuggestionContainer: {
        padding: 20,
        marginTop: 20,
        backgroundColor: '#E0F7FA',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#B2EBF2',
        alignItems: 'center',
    },
    activitySuggestionTitle: {
        fontSize: 18,
        color: '#00796B',
        marginBottom: 10,
    },
    activitySuggestion: {
        fontSize: 16,
        color: '#004D40',
    },
});

export default ManageDay;