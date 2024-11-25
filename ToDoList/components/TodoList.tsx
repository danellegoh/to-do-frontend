import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Task from './Task';
import { api } from '../services/api';

interface TodoListProps {
    id: number;
    title: string;
    onUpdateTitle: (newTitle: string) => void;
    onDeleteList: () => void;
}

const TodoList = ({ id, title, onUpdateTitle, onDeleteList }: TodoListProps) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTask, setNewTask] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const listTodos = await api.getTodos(id);
            setTasks(listTodos);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (newTask.trim()) {
            try {
                const newTodo = await api.createTodo(id, newTask.trim());
                setTasks([...tasks, newTodo]);
                setNewTask('');
            } catch (error) {
                console.error('Failed to create task:', error);
            }
        }
    };

    const toggleTaskCompletion = async (taskId: number, currentStatus: boolean) => {
        try {
            setIsUpdating(taskId);
            await api.updateTodo(taskId, { is_done: !currentStatus });
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, is_done: !currentStatus } : task
            ));
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <View style={styles.listContainer}>
            <View style={styles.headerContainer}>
                {isEditingTitle ? (
                    <View style={styles.titleEditContainer}>
                        <TextInput
                            style={styles.titleInput}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            onBlur={() => {
                                if (editedTitle.trim() && editedTitle !== title) {
                                    onUpdateTitle(editedTitle);
                                }
                                setIsEditingTitle(false);
                            }}
                            autoFocus
                        />
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                        <Text style={styles.title}>{title || 'Untitled List'}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onDeleteList} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tasksContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#3498db" />
                ) : (
                    tasks.map((task) => (
                        <View 
                            key={task.id} 
                            style={styles.taskTouchable}
                        >
                            <View style={styles.taskWrapper}>
                                <Task 
                                    text={task.description} 
                                    completed={task.is_done} 
                                    onToggle={() => toggleTaskCompletion(task.id, task.is_done)}
                                />
                                {isUpdating === task.id && (
                                    <ActivityIndicator 
                                        size="small" 
                                        color="#3498db" 
                                        style={styles.updateIndicator}
                                    />
                                )}
                            </View>
                        </View>
                    ))
                )}
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    value={newTask}
                    onChangeText={setNewTask}
                    placeholder="Add a task"
                    placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={handleAddTask}>
                    <View style={styles.addButton}>
                        <Text style={styles.addButtonText}>+</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    titleEditContainer: {
        flex: 1,
        marginRight: 10,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        borderBottomWidth: 1,
        borderBottomColor: '#3498db',
        paddingVertical: 5,
    },
    deleteButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        borderRadius: 15,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    tasksContainer: {
        marginBottom: 20,
    },
    taskTouchable: {
        width: '100%',
        marginBottom: 12,
    },
    taskWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    updateIndicator: {
        position: 'absolute',
        right: -25,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
        borderRadius: 10,
        padding: 5,
    },
    input: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        color: '#2c3e50',
    },
    addButton: {
        width: 40,
        height: 40,
        backgroundColor: '#3498db',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default TodoList;
