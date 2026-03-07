import { useRouter } from "expo-router";
import React, { useState } from "react";
import {Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginUser } from "../config/authService";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "" });

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [setLoading] = useState(false);

 //field value
  const validateField = (field, value) => {
    let error = "";
    if (field === "email") {
      if (!value) error = "Email is required.";
      else if (!validateEmail(value)) error = "Enter a valid email address.";
    }
    if (field === "password") {
      if (!value) error = "Password is required.";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // validate n submit
  const validateAll = () => {
    const emailError = !email ? "Email is required." : !validateEmail(email) ? "Enter a valid email address." : "";
    const passwordError = !password ? "Password is required." : "";
    
    setErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleLogin = async () => {
    // Run all validations
    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);

      if (result.success) {
        router.replace("/homepage");
      } else {
        const friendlyError = mapFirebaseError(result.error);
        Alert.alert("Login Failed", friendlyError);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapFirebaseError = (error = "") => {
    if (error.includes("user-not-found")) return "No account found with this email.";
    if (error.includes("wrong-password")) return "Incorrect password. Please try again.";
    if (error.includes("invalid-email")) return "The email address is not valid.";
    if (error.includes("too-many-requests")) return "Too many failed attempts. Please try again later.";
    if (error.includes("user-disabled")) return "This account has been disabled.";
    return error || "Login failed. Please check your credentials.";
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to continue as Teacher</Text>
            </View>

            <View style={styles.formContainer}>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused,
                    errors.email ? styles.inputError : null,
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    validateField("email", val);
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => { setEmailFocused(false); validateField("email", email); }}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    passwordFocused && styles.inputFocused,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    validateField("password", val);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => { setPasswordFocused(false); validateField("password", password); }}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
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
    paddingBottom: 30,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 1,
    marginTop: -50,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
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
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 5,
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
    forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },


  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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

  
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6f7d91ff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: -5,
  },

  
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "500",
  },
  signUpLink: {
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
});

export default LoginScreen;
