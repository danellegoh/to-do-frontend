import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import Task from './Task';
import { api, Todo } from '../services/api';

interface TodoListProps {
    id: number;
    title: string;
    onUpdateTitle: (newTitle: string) => void;
    onDeleteList: () => void;
}

const TodoList = ({ id, title, onUpdateTitle, onDeleteList }: TodoListProps) => {
    const [tasks, setTasks] = useState<Todo[]>([]);
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
            const updatedTodo = await api.updateTodo(taskId, { is_done: !currentStatus });
            setTasks(tasks.map(task => 
                task.id === taskId ? updatedTodo : task
            ));
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleUpdateTask = async (taskId: number, newDescription: string) => {
        try {
            setIsUpdating(taskId);
            const updatedTodo = await api.updateTodo(taskId, { description: newDescription });
            setTasks(tasks.map(task => 
                task.id === taskId ? updatedTodo : task
            ));
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            setIsUpdating(taskId);
            await api.deleteTodo(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleTitleSubmit = () => {
        if (editedTitle.trim() && editedTitle !== title) {
            onUpdateTitle(editedTitle.trim());
        } else {
            setEditedTitle(title);
        }
        setIsEditingTitle(false);
    };

    const handleDeleteList = () => {
        Alert.alert(
            "Delete List",
            "Are you sure you want to delete this list? This will also delete all tasks in this list.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: onDeleteList,
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.listContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.titleContainer}>
                    {isEditingTitle ? (
                        <TextInput
                            style={styles.titleInput}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            onBlur={handleTitleSubmit}
                            autoFocus
                            multiline
                        />
                    ) : (
                        <TouchableOpacity 
                            onPress={() => setIsEditingTitle(true)}
                            style={styles.titleTouchable}
                        >
                            <Text style={styles.listTitle}>{title}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={handleDeleteList} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tasksWrapper}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    tasks.map(task => (
                        <Task
                            key={task.id}
                            id={task.id}
                            description={task.description}
                            is_done={task.is_done}
                            onToggle={() => toggleTaskCompletion(task.id, task.is_done)}
                            onEdit={(newDescription) => handleUpdateTask(task.id, newDescription)}
                            onDelete={() => handleDeleteTask(task.id)}
                        />
                    ))
                )}
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.writeTaskWrapper}
            >
                <TextInput 
                    style={styles.input} 
                    placeholder={'Write a task'} 
                    value={newTask}
                    onChangeText={text => setNewTask(text)}
                    onSubmitEditing={handleAddTask}
                />
                <TouchableOpacity onPress={handleAddTask}>
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
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
        borderRadius: 10,
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
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    titleContainer: {
        flex: 1,
        marginRight: 10,
    },
    titleTouchable: {
        flex: 1,
    },
    listTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#55BCF6',
        padding: 0,
        textAlignVertical: 'top',
        minHeight: 30,
    },
    deleteButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FF0000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    tasksWrapper: {
        marginTop: 10,
    },
    writeTaskWrapper: {
        position: 'relative',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        width: '85%',
    },
    addWrapper: {
        width: 40,
        height: 40,
        backgroundColor: '#55BCF6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,
    },
    addText: {
        color: '#FFF',
        fontSize: 20,
    },
});

export default TodoList;
