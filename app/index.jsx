import { Link } from "expo-router";
import { Briefcase, School, Users } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={require("../assets/Teacherhub_logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome to TeacherHub</Text>
            <Text style={styles.subtitle}>
              Select a role that best describes you
            </Text>
          </View>

          {/* Role Cards Section */}
          <View style={styles.roleSection}>
            {/* Teachers/Lecturers Card */}
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Briefcase color="#2563EB" size={28} strokeWidth={2.5} />
                  </View>
                  <View style={styles.cardTextWrap}>
                    <Text style={styles.cardTitle}>Teachers / Lecturers</Text>
                    <Text style={styles.cardSubtitle}>
                      Find teaching jobs and tutoring opportunities
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>

            {/* School/University Card */}
            <Link href="/loginTwo" asChild>
              <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <School color="#2563EB" size={28} strokeWidth={2.5} />
                  </View>
                  <View style={styles.cardTextWrap}>
                    <Text style={styles.cardTitle}>School / University</Text>
                    <Text style={styles.cardSubtitle}>
                      Post jobs and find competent tutors for your students
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>

            {/* Others Card */}
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Users color="#2563EB" size={28} strokeWidth={2.5} />
                  </View>
                  <View style={styles.cardTextWrap}>
                    <Text style={styles.cardTitle}>Others</Text>
                    <Text style={styles.cardSubtitle}>
                      Find schools and teachers that suit your needs
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Footer Space */}
          <View style={styles.footerSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1E40AF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header Section
  headerSection: {
    backgroundColor: "#1E40AF",
    alignItems: "center",
    paddingTop: 140,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1E40AF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fcfcfdff",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fcfdfdff",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Role Section
  roleSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  // Card Styles
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#1E40AF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 20,
  },

  // Footer Space
  footerSpace: {
    height: 40,
  },
});
