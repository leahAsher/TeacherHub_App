import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link } from 'expo-router';
import { registerUser } from '../config/authService';
import { createDocument } from '../config/databaseService';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc} from 'firebase/firestore';
import {auth, db} from '../config/firebase.config';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      console.log('Attempting to register user with email:', email);
      const result = await registerUser(email, password);
      console.log('Registration result:', result);
      if (result.success && result.user && result.user.uid) {
        console.log('User created successfully with UID:', result.user.uid);
        // Save additional user data to Firestore
        const userData = {
          username,
          email,
          createdAt: new Date()
        };
        console.log('Saving user data to Firestore:', userData);
        const dbResult = await createDocument('users', userData, result.user.uid);
        console.log('Database save result:', dbResult);
        if (dbResult.success) {
          Alert.alert('Success', 'Account created successfully!');
        } else {
          // Still show success for auth, but warn about database
          Alert.alert('Success', 'Account created! Note: User data could not be saved to database.');
          console.warn('Database save failed:', dbResult.error);
        }
        // Navigate to login or next screen
      } else {
        console.error('Registration failed:', result.error);
        Alert.alert('Error', result.error || 'Registration failed');
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={require('../assets/Teacherhub_logo.png')}
              style={styles.logo} />
            <Text style={styles.title}>Create Teacher Account</Text>
            <Text style={styles.subtitle}>Join our community of educators</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={[styles.input, usernameFocused && styles.inputFocused]}
                placeholder="Choose a username"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused]}
                placeholder="Create a strong password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>

            {/* Sign Up Button */}
            <Link href="/homepage" asChild>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignUp}
                activeOpacity={0.8}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>

            {/* Terms Text */}
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Form Container
  formContainer: {
    width: '100%',
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Button
  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Terms Text
  termsText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
  
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Login Section
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
  loginLink: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SignupScreen;