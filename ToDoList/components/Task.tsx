import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

interface TaskProps {
    id: number;
    description: string;
    is_done: boolean;
    onToggle: () => void;
    onEdit: (newDescription: string) => void;
    onDelete: () => void;
}

const Task = ({ id, description = '', is_done = false, onToggle, onEdit, onDelete }: TaskProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(description || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setEditText(description || '');
    }, [description]);

    const handleSubmitEditing = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        const trimmedText = (editText || '').trim();
        if (trimmedText && trimmedText !== description) {
            onEdit(trimmedText);
        } else {
            setEditText(description || '');
        }
        setIsEditing(false);
        
        setTimeout(() => {
            setIsSubmitting(false);
        }, 100);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: onDelete,
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
                <View style={[styles.square, is_done && styles.squareCompleted]}>
                    {is_done && <Text style={styles.checkmark}>✓</Text>}
                </View>
            </TouchableOpacity>
            
            <View style={styles.itemCenter}>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={editText || ''}
                        onChangeText={(text) => setEditText(text || '')}
                        onBlur={handleSubmitEditing}
                        autoFocus
                        multiline
                        returnKeyType="done"
                    />
                ) : (
                    <TouchableOpacity 
                        onPress={() => setIsEditing(true)}
                        style={styles.textContainer}
                    >
                        <Text style={[styles.itemText, is_done && styles.itemTextCompleted]}>
                            {description || ''}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    itemCenter: {
        flex: 1,
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    checkbox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
    },
    textContainer: {
        flex: 1,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#55BCF6',
        fontSize: 14,
        padding: 0,
        minHeight: 20,
        textAlignVertical: 'center',
    },
    itemText: {
        fontSize: 14,
        lineHeight: 20,
        flexWrap: 'wrap',
    },
    itemTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#808080',
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    squareCompleted: {
        backgroundColor: '#55BCF6',
        opacity: 0.9,
    },
    checkmark: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'center',
    },
    deleteButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FF0000',
        fontSize: 24,
        lineHeight: 24,
        textAlignVertical: 'center',
        includeFontPadding: false,
        marginTop: -2, // Fine-tune vertical alignment
    },
});

export default Task;