import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const CardHeader = ({ children, style }) => {
    return (
        <View style={[styles.header, style]}>
            <Text style={styles.headerText}>{children}</Text>
        </View>
    );
};

const CardContent = ({ children, style }) => {
    return (
        <View style={[styles.content, style]}>
            <Text>{children}</Text>
        </View>
    );
};

const CardFooter = ({ children, style }) => {
    return (
        <View style={[styles.footer, style]}>
            <Text>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        elevation: 2,
        padding: 16,
        backgroundColor: '#fff',
        margin: 10,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    content: {
        paddingVertical: 10,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 8,
    },
});

export { Card, CardHeader, CardContent, CardFooter };
