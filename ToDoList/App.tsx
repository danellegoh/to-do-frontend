import React, { useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TodoList from './components/TodoList';
import { api, TodoList as TodoListType } from './services/api';

function App(): React.JSX.Element {
  const [lists, setLists] = useState<TodoListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const fetchedLists = await api.getTodoLists();
      setLists(fetchedLists);
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewList = async () => {
    try {
      const newList = await api.createTodoList(`List ${lists.length + 1}`);
      setLists([...lists, newList]);
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  const updateListTitle = async (listId: number, newTitle: string) => {
    try {
      const updatedList = await api.updateTodoList(listId, newTitle);
      setLists(lists.map(list =>
        list.id === listId ? updatedList : list
      ));
    } catch (error) {
      console.error('Failed to update list:', error);
    }
  };

  const deleteList = async (listId: number) => {
    try {
      await api.deleteTodoList(listId);
      setLists(lists.filter(list => list.id !== listId));
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todo Lists</Text>
        <TouchableOpacity style={styles.addListButton} onPress={addNewList}>
          <Text style={styles.addListButtonText}>+ New List</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {lists.map(list => (
            <TodoList
              key={list.id}
              id={list.id}
              title={list.name}
              onUpdateTitle={(newTitle) => updateListTitle(list.id, newTitle)}
              onDeleteList={() => deleteList(list.id)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addListButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addListButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
});

export default App;
