import { useRouter } from "expo-router";
import React, { useState } from "react";
import {Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "../config/authService";
import { createDocument } from "../config/databaseService";
import { initializeApp } from 'firebase/app';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string) => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
};

const validateSchoolName = (name: string) => {
  if (name.trim().length < 3) return "School name must be at least 3 characters.";
  if (name.trim().length > 50) return "School name must be at most 50 characters.";
  return null;
};

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const SignupScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ username: "", email: "", password: "" });

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);

  const validateField = (field: "username" | "email" | "password", value: string) => {
    let error = "";
    if (field === "username") {
      if (!value.trim()) error = "School name is required.";
      else error = validateSchoolName(value) || "";
    }
    if (field === "email") {
      if (!value.trim()) error = "Email is required.";
      else error = !validateEmail(value) ? "Enter a valid email address." : "";
    }
    if (field === "password") {
      if (!value) error = "Password is required.";
      else error = validatePassword(value) || "";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const usernameError = !username.trim() ? "School name is required." : (validateSchoolName(username) || "");
    const emailError = !email.trim() ? "Email is required." : (!validateEmail(email) ? "Enter a valid email address." : "");
    const passwordError = !password ? "Password is required." : (validatePassword(password) || "");

    setErrors({ username: usernameError, email: emailError, password: passwordError });

    return !usernameError && !emailError && !passwordError;
  };

  const handleSignUp = async () => {
    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(email, password);
      if (result.success && result.user && result.user.uid) {
        const userData = {
          schoolName: username,
          email,
          userType: "school",
          createdAt: new Date(),
        };
        const dbResult = await createDocument(
          "users",
          userData,
          result.user.uid,
        );
        if (dbResult.success) {
          Alert.alert("Success", "School account created successfully!", [
            { text: "OK", onPress: () => router.replace("/homepageTwo") },
          ]);
        } else {
          Alert.alert(
            "Success",
            "School account created! ",
            [{ text: "OK", onPress: () => router.replace("/homepageTwo") }]
          );
          console.warn("Database save failed:", dbResult.error);
        }
      } else {
        Alert.alert("Error", result.error || "Registration failed");
      }
    } catch (error) {
      console.log("Error signing up: ", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>

            <View style={styles.headerSection}>
              <Image
                source={require("../assets/Teacherhub_logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Create School Account</Text>
              <Text style={styles.subtitle}>
                Register your institution on Teacher Hub
              </Text>
            </View>


            <View style={styles.formContainer}>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>School Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    usernameFocused && styles.inputFocused,
                    errors.username ? styles.inputError : null,
                  ]}
                  placeholder="Enter your school name"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="words"
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val);
                    validateField("username", val);
                  }}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => {
                    setUsernameFocused(false);
                    validateField("username", username);
                  }}
                />
                {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
              </View>


              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Official Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused,
                    errors.email ? styles.inputError : null,
                  ]}
                  placeholder="Enter institutional email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    validateField("email", val);
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => {
                    setEmailFocused(false);
                    validateField("email", email);
                  }}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>


              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    passwordFocused && styles.inputFocused,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="Create a secure password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    validateField("password", val);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => {
                    setPasswordFocused(false);
                    validateField("password", password);
                  }}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/loginTwo")}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },

  formContainer: {
    width: "100%",
  },

  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1E293B",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  termsText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  termsLink: {
    color: "#2563EB",
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "500",
  },
  loginLink: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default SignupScreen;