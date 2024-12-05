import { Text, View } from "@/components/Themed";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true)
        try {
            if (!email || !password) {
                Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
                return;
            }

            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            router.replace('/(tabs)');
        } catch (error: any) {
            let errorMessage = 'Wystąpił błąd logowania';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Nieprawidłowy format email';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Nie znaleziono użytkownika';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Nieprawidłowe hasło';
                    break;
            }

            Alert.alert('Błąd', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Witaj ponownie</Text>
                    <Text style={styles.subtitle}>Zaloguj się do swojego konta</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name="mail-outline"
                            size={24}
                            color="#888"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Adres email"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={24}
                            color="#888"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Hasło"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.showPasswordButton}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordText}>Zapomniałeś hasła?</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={signIn}
                    >
                        <Text style={styles.loginButtonText}>Zaloguj się</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Nie masz konta? </Text>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.signupLink}>Zarejestruj się</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    titleContainer: {
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#777',
    },
    inputContainer: {
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputIcon: {
        marginLeft: 15,
    },
    input: {
        flex: 1,
        height: 55,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    showPasswordButton: {
        paddingRight: 15,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: 'transparent',
    },
    signupText: {
        color: '#777',
        fontSize: 16,
    },
    signupLink: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16,
    }
});