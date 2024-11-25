import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TaskProps {
    text: string;
    completed: boolean;
    onToggle: () => void;
}

const Task = ({ text, completed, onToggle }: TaskProps) => {
    return (
        <TouchableOpacity onPress={onToggle}>
            <View style={[styles.item, completed && styles.itemCompleted]}>
                <View style={styles.itemLeft}>
                    <View style={[styles.square, completed && styles.squareCompleted]} />
                    <Text style={[styles.itemText, completed && styles.itemTextCompleted]} numberOfLines={1}>
                        {text}
                    </Text>
                </View>
                <View style={[styles.circular, completed && styles.circularCompleted]} />
            </View>
        </TouchableOpacity>
    )
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    itemCompleted: {
        backgroundColor: '#F5F5F5',
        opacity: 0.8,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#3498db',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
        flexShrink: 0,
    },
    squareCompleted: {
        backgroundColor: '#27ae60',
        opacity: 0.6,
    },
    itemText: {
        flex: 1,
        color: '#2c3e50',
        fontSize: 16,
    },
    itemTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#7f8c8d',
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#3498db',
        borderWidth: 2,
        borderRadius: 5,
        flexShrink: 0,
        marginLeft: 15,
    },
    circularCompleted: {
        backgroundColor: '#27ae60',
        borderColor: '#27ae60',
    },
});

export default Task;