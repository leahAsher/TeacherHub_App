import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  LogOut,
  MapPin,
  Trash2,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width > 700 ? 600 : "100%";

const mockApplication = [
  {
    id: 1,
    job: " Mathematics Teacher",
    school: "Echosys Academy",
    status: "Scheduled",
    date: "2 days ago",
  },
  {
    id: 2,
    job: "Mathematics Teacher",
    school: "Innovators Int.l Academy",
    status: "Pending",
    date: "1 week ago",
  },
  {
    id: 3,
    job: "Mathematics Teacher",
    school: "Midshire Academy",
    status: "Rejected",
    date: "2 months ago",
  },
];

const jobListings = [
  {
    id: 1,
    title: "Mathematics Teacher",
    school: "Eschosys International Academy",
    location: "Acacia Yaounde, CMR",
    type: ["Full-time", "Part-time"],
    requirements: "Teaching credential/licence",
    startDate: "September 2026",
    salary: "XAF 35,000 - 45,000/month",
  },
  {
    id: 2,
    title: "English Teacher",
    school: "Eschosys International Academy",
    location: "Acacia Yaounde, CMR",
    type: ["Part-time"],
    requirements: "Teaching credential/licence",
    startDate: "January 2026",
    salary: "XAF 50,000 - 70,000/month",
  },
  {
    id: 3,
    title: "Database and SQL",
    school: "Midshire International Academy",
    location: "Simbock Yaounde, CMR",
    type: ["Full-time"],
    requirements: "Teaching credential/licence",
    startDate: "January 2026",
    salary: "XAF 40,000 - 55,000/month",
  },
];

// Side Navigation Menu Component
const SideNavigationMenu = ({
  visible,
  onClose,
  setCurrentPage,
}: {
  visible: boolean;
  onClose: () => void;
  setCurrentPage: (page: string) => void;
}) => {
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    onClose();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deleted",
              "Your account has been successfully deleted.",
            );
            onClose();
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          Alert.alert("Logged Out", "You have been successfully logged out.");
          handleNavigation("./index.jsx");
        },
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sideNavContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header with Logo and Back Arrow */}
            <View style={styles.sideNavHeader}>
              <TouchableOpacity onPress={onClose} style={styles.backArrow}>
                <ArrowLeft color="#1E3A8A" size={24} />
              </TouchableOpacity>
              <Text style={styles.sideNavLogo}>TeacherHub</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              {/* Circular Profile Photo Placeholder */}
              <View style={styles.profilePhotoContainer}>
                <View style={styles.profilePhoto}>
                  <User color="#2563EB" size={48} />
                </View>
              </View>

              {/* Upload Photo Option */}
              <TouchableOpacity style={styles.uploadPhotoButton}>
                <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              </TouchableOpacity>

              {/* User Name */}
              <Text style={styles.userName}>Miss Lindsey Lohan</Text>
              <Text style={styles.userEmail}>lindsey.lohan@email.com</Text>
            </View>

            {/* Navigation Menu Items */}
            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("Applications")}
              >
                <View style={styles.menuItemIcon}>
                  <Briefcase color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Applications</Text>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("Interviews")}
              >
                <View style={styles.menuItemIcon}>
                  <Calendar color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Interviews</Text>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("SavedSchools")}
              >
                <View style={styles.menuItemIcon}>
                  <BookOpen color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Schools</Text>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDeleteAccount}
              >
                <View style={styles.menuItemIconDanger}>
                  <Trash2 color="#DC2626" size={22} />
                </View>
                <Text style={styles.menuItemTextDanger}>Delete Account</Text>
                <ChevronRight color="#DC2626" size={20} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Logout at Bottom */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#FFFFFF" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Button Component
type PrimaryButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success";
  style?: any;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  style,
}) => {
  const variantStyles = {
    primary: styles.btnPrimary,
    secondary: styles.btnSecondary,
    success: styles.btnSuccess,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, variantStyles[variant], style]}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "green" | "indigo" | "yellow" | "pink" | "gray";
}) => {
  const colorMap: Record<string, string> = {
    green: "#10b981",
    indigo: "#4f46e5",
    yellow: "#f59e0b",
    pink: "#ec4899",
    gray: "#9ca3af",
  };

  const accent = colorMap[color] || colorMap.gray;
  const borderStyle = { borderBottomColor: accent };

  return (
    <View style={[styles.statCard, borderStyle]}>
      <View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={[styles.iconPlaceholder, { color: accent }]}>★</Text>
    </View>
  );
};

// Job Card Component
type JobCardProps = {
  job: {
    id: number;
    title: string;
    school: string;
    location: string;
    type: string[];
    requirements: string;
    startDate: string;
    salary: string;
  };
  onViewDetails: (jobId: number) => void;
  onApply: () => void;
};

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, onApply }) => (
  <View style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <View style={styles.jobIconContainer}>
        <Briefcase color="#2563EB" size={20} />
      </View>
      <View style={styles.jobHeaderText}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobSchool}>{job.school}</Text>
      </View>
    </View>

    <View style={styles.jobDetails}>
      <View style={styles.jobDetailRow}>
        <MapPin color="#64748B" size={14} />
        <Text style={styles.jobDetailText}>{job.location}</Text>
      </View>
      <View style={styles.jobDetailRow}>
        <Clock color="#64748B" size={14} />
        <Text style={styles.jobDetailText}>{job.type.join(", ")}</Text>
      </View>
    </View>

    <View style={styles.jobTags}>
      <View style={styles.jobTag}>
        <Text style={styles.jobTagText}>{job.requirements}</Text>
      </View>
      <View style={styles.jobTag}>
        <Text style={styles.jobTagText}>Start: {job.startDate}</Text>
      </View>
    </View>

    <Text style={styles.jobSalary}>{job.salary}</Text>

    <View style={styles.jobActions}>
      <PrimaryButton
        onPress={() => onViewDetails(job.id)}
        variant="primary"
        style={styles.jobButton}
      >
        View Details
      </PrimaryButton>
      <PrimaryButton
        onPress={onApply}
        variant="success"
        style={styles.jobButton}
      >
        Apply Now
      </PrimaryButton>
    </View>
  </View>
);

// Home Dashboard
const HomeDashboard = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Welcome to TeacherHub</Text>
          <Text style={styles.pageSubtitle}>
            Find your next role, hire top talent, or book a private lesson
          </Text>
        </View>

        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for jobs, teachers, or tutoring services..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.searchActions}>
            <PrimaryButton
              onPress={() => {}}
              variant="primary"
              style={styles.searchButton}
            >
              Find Jobs
            </PrimaryButton>
            <PrimaryButton
              onPress={() => setCurrentPage("TeacherDashboard")}
              variant="secondary"
              style={styles.searchButton}
            >
              Dashboard
            </PrimaryButton>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Featured Job Listings</Text>
        {jobListings.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onViewDetails={(jobId) => setCurrentPage(`JobDetails-${jobId}`)}
            onApply={() => Alert.alert("Success", "Application submitted!")}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Teacher Dashboard
const TeacherDashboard = ({
  setCurrentPage,
  onOpenMenu,
}: {
  setCurrentPage: (page: string) => void;
  onOpenMenu: () => void;
}) => (
  <ScrollView
    contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Welcome Teacher</Text>
        <Text style={styles.pageSubtitle}>
          Manage your profile, applications, and service bookings
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Profile Completion" value="85%" color="green" />
        <StatCard title="Active Applications" value="7" color="indigo" />
        <StatCard title="Interview Requests" value="2" color="yellow" />
        <StatCard title="Service Earnings " value="XAF0.0" color="pink" />
      </View>

      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <View style={styles.alertIconContainer}>
            <Text style={styles.alertIcon}>⚠️</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Profile Status: Needs Update</Text>
            <Text style={styles.alertSubtitle}>
              Your certifications need renewal. Update your profile to stay
              visible to top schools.
            </Text>
          </View>
        </View>
        <View style={styles.alertActions}>
          <PrimaryButton
            onPress={() => setCurrentPage("TeacherSettings")}
            variant="primary"
            style={styles.alertButton}
          >
            Edit Profile
          </PrimaryButton>
          <PrimaryButton
            onPress={() => setCurrentPage("Home")}
            variant="secondary"
            style={styles.alertButton}
          >
            Home
          </PrimaryButton>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Job Applications</Text>
        {mockApplication.map((app) => (
          <View key={app.id} style={styles.appRow}>
            <View style={styles.appLeft}>
              <View style={styles.appIconContainer}>
                <Briefcase color="#2563EB" size={16} />
              </View>
              <View>
                <Text style={styles.appJob}>{app.job}</Text>
                <Text style={styles.appSchool}>{app.school}</Text>
              </View>
            </View>
            <View style={styles.appRight}>
              <View
                style={[
                  styles.appStatus,
                  app.status.includes("Interview") ? styles.statusYellow
                  : app.status === "Pending" ? styles.statusBlue
                  : styles.statusRed,
                ]}
              >
                <Text style={styles.appStatusText}>{app.status}</Text>
              </View>
              <Text style={styles.appDate}>{app.date}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.viewAllContainer}>
          <Text style={styles.viewAllText}>View All Applications</Text>
          <ChevronRight color="#2563EB" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

// Job Details Page
const JobDetailsPage = ({
  jobId,
  setCurrentPage,
}: {
  jobId: number;
  setCurrentPage: (page: string) => void;
}) => {
  const job = jobListings.find((j) => j.id === jobId);
  if (!job) return null;

  const jobDetails = {
    description: `We are seeking an experienced ${job.title} to join our dynamic team. You will be responsible for delivering engaging lessons to students and fostering a positive learning environment.`,
    responsibilities: [
      "Develop and deliver curriculum-aligned lessons",
      "Assess student performance and provide feedback",
      "Collaborate with other educators",
      "Maintain a positive learning environment",
    ],
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setCurrentPage("Home")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back to Jobs</Text>
        </TouchableOpacity>

        <View style={styles.jobDetailsHeader}>
          <View style={styles.jobDetailsIcon}>
            <Briefcase color="#2563EB" size={28} />
          </View>
          <Text style={styles.jobDetailsTitle}>{job.title}</Text>
          <Text style={styles.jobDetailsSchool}>{job.school}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{job.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Job Type:</Text>
            <Text style={styles.detailValue}>{job.type.join(", ")}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>{job.startDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salary:</Text>
            <Text style={styles.detailValue}>{job.salary}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Requirements:</Text>
            <Text style={styles.detailValue}>{job.requirements}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About This Position</Text>
          <Text style={styles.description}>{jobDetails.description}</Text>
          <Text style={[styles.cardTitle, styles.mt3]}>
            Key Responsibilities
          </Text>
          {jobDetails.responsibilities.map((resp, index) => (
            <View key={index} style={styles.responsibilityRow}>
              <View style={styles.bullet} />
              <Text style={styles.responsibilityText}>{resp}</Text>
            </View>
          ))}
        </View>

        <View style={styles.jobDetailsActions}>
          <PrimaryButton
            onPress={() => setCurrentPage("Home")}
            variant="secondary"
            style={styles.fullButton}
          >
            Back to Jobs
          </PrimaryButton>
          <PrimaryButton
            onPress={() => Alert.alert("Success", "Application submitted!")}
            variant="success"
            style={[styles.fullButton, styles.mt2]}
          >
            Apply Now
          </PrimaryButton>
        </View>
      </View>
    </ScrollView>
  );
};

// Teacher Settings
const TeacherSettings = ({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [jobSearchVisible, setJobSearchVisible] = useState(true);
  const [serviceVisible, setServiceVisible] = useState(true);

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.settingsSectionTitle}>
            Personal & Contact Information
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.settingsInput}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Job Title/Specialty</Text>
            <TextInput
              style={styles.settingsInput}
              placeholder="e.g., Mathematics Teacher"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.settingsInputDisabled}
              placeholder="teacher@example.com"
              editable={true}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Professional Summary / Bio</Text>
            <TextInput
              style={styles.settingsTextArea}
              multiline
              numberOfLines={4}
              placeholder="Write a brief summary about your teaching experience..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <Text style={[styles.settingsSectionTitle, styles.mt3]}>
            Location & Job Preferences
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Job Type</Text>
            <TextInput
              style={styles.settingsInput}
              placeholder="Full-time, Part-time, Contract"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Salary Range (min)</Text>
            <TextInput
              style={styles.settingsInput}
              placeholder="XAF 35,000"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      );
    } else if (activeTab === "qualifications") {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.settingsSectionTitle}>
            Qualifications & Documents
          </Text>
          <View style={styles.qualificationCard}>
            <View style={styles.qualificationHeader}>
              <Text style={styles.qualificationTitle}>Education</Text>
            </View>
            <View style={styles.qualificationItem}>
              <Text style={styles.qualificationText}>
                Bachelor's Degree, Pure Mathematics (2013)
              </Text>
              <TouchableOpacity>
                <Text style={styles.qualificationRemove}>Remove</Text>
              </TouchableOpacity>
            </View>
            <PrimaryButton
              onPress={() => {}}
              variant="secondary"
              style={styles.addButton}
            >
              Add New Education
            </PrimaryButton>
          </View>
          <View style={styles.qualificationCard}>
            <View style={styles.qualificationHeader}>
              <Text style={styles.qualificationTitle}>
                Teaching Licenses / Certifications
              </Text>
            </View>
            <View style={styles.qualificationItem}>
              <Text style={styles.qualificationText}>
                ENS: Mathematics (Date: 12/2012)
              </Text>
              <TouchableOpacity>
                <Text style={styles.qualificationRenew}>Renew/Upload</Text>
              </TouchableOpacity>
            </View>
            <PrimaryButton
              onPress={() => {}}
              variant="secondary"
              style={styles.addButton}
            >
              Add Certification
            </PrimaryButton>
          </View>
          <Text style={[styles.settingsSectionTitle, styles.mt3]}>
            Resume & Cover Letter
          </Text>
          <View style={styles.uploadBox}>
            <Text style={styles.uploadIcon}>📄</Text>
            <Text style={styles.uploadText}>
              Drag & Drop Resume (PDF) or{" "}
              <Text style={styles.uploadLink}>Browse Files</Text>
            </Text>
          </View>
        </View>
      );
    } else if (activeTab === "visibility") {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.settingsSectionTitle}>
            Profile Visibility & Services
          </Text>
          <View style={styles.toggleCard}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>
                Available for Job Applications
              </Text>
              <Text style={styles.toggleSubtitle}>
                If disabled, your profile will not appear in school search
                results
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
              thumbColor={jobSearchVisible ? "#2563EB" : "#F1F5F9"}
              onValueChange={setJobSearchVisible}
              value={jobSearchVisible}
            />
          </View>
          <View style={styles.toggleCard}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>
                Offer Private Tutoring/Consulting Services
              </Text>
              <Text style={styles.toggleSubtitle}>
                Controls visibility on the Services Marketplace
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
              thumbColor={serviceVisible ? "#2563EB" : "#F1F5F9"}
              onValueChange={setServiceVisible}
              value={serviceVisible}
            />
          </View>
          <PrimaryButton
            onPress={() => {
              Alert.alert("Success", "Profile settings saved!");
              setCurrentPage("TeacherDashboard");
            }}
            variant="primary"
            style={styles.mt3}
          >
            Save Profile Settings
          </PrimaryButton>
        </View>
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Teacher Profile Settings</Text>
          <Text style={styles.pageSubtitle}>
            Update your professional details, qualifications, and platform
            visibility
          </Text>
        </View>
        <View style={styles.card}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "profile" && styles.activeTab]}
              onPress={() => setActiveTab("profile")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "profile" && styles.activeTabText,
                ]}
              >
                Basic Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "qualifications" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("qualifications")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "qualifications" && styles.activeTabText,
                ]}
              >
                Qualifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "visibility" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("visibility")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "visibility" && styles.activeTabText,
                ]}
              >
                Visibility
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContentContainer}>{renderContent()}</View>
        </View>
      </View>
    </ScrollView>
  );
};

// Main App
const App = () => {
  const [currentPage, setCurrentPage] = useState("Home");
  const [menuVisible, setMenuVisible] = useState(false);

  const renderPage = () => {
    if (currentPage.startsWith("JobDetails-")) {
      const jobId = parseInt(currentPage.split("-")[1]);
      return <JobDetailsPage jobId={jobId} setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case "Home":
        return <HomeDashboard setCurrentPage={setCurrentPage} />;
      case "TeacherDashboard":
        return (
          <TeacherDashboard
            setCurrentPage={setCurrentPage}
            onOpenMenu={() => setMenuVisible(true)}
          />
        );
      case "TeacherSettings":
        return <TeacherSettings setCurrentPage={setCurrentPage} />;
      default:
        return <HomeDashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <View style={styles.appHeader}>
          <Text style={styles.appLogo}>TeacherHub</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <View style={styles.profileIconContainer}>
              <User color="#2563EB" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        <SideNavigationMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          setCurrentPage={setCurrentPage}
        />

        {renderPage()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  appHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appLogo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sideNavContainer: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  sideNavHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#EFF6FF",
  },
  backArrow: {
    marginRight: 12,
  },
  sideNavLogo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  profilePhotoContainer: {
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2563EB",
  },
  uploadPhotoButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  uploadPhotoText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  menuItems: {
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemIconDanger: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  menuItemTextDanger: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  menuDivider: {
    height: 8,
    backgroundColor: "#F8FAFC",
    marginVertical: 8,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    width: CONTENT_WIDTH,
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 22,
  },

  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 16,
    fontWeight: "500",
  },
  searchActions: {
    flexDirection: "row",
    gap: 12,
  },
  searchButton: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 16,
  },

  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  jobIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  jobHeaderText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  jobSchool: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  jobDetailText: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
    fontWeight: "500",
  },
  jobTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  jobTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jobTagText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 16,
  },
  jobActions: {
    flexDirection: "row",
    gap: 12,
  },
  jobButton: {
    flex: 1,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnPrimary: {
    backgroundColor: "#2563EB",
  },
  btnSecondary: {
    backgroundColor: "#64748B",
  },
  btnSuccess: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    width: "48%",
    marginBottom: 10,
    borderBottomWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginTop: 3,
  },
  iconPlaceholder: {
    fontSize: 30,
    opacity: 0.7,
  },

  alertCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f5e8b6ff",
  },
  alertHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 14,
    color: "#4f46e5",
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: "row",
    gap: 12,
  },
  alertButton: {
    flex: 1,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 16,
  },

  appRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  appLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  appJob: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  appSchool: {
    fontSize: 13,
    color: "#64748B",
  },
  appRight: {
    alignItems: "flex-end",
  },
  appStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusYellow: {
    backgroundColor: "#FEF3C7",
  },
  statusBlue: {
    backgroundColor: "#DBEAFE",
  },
  statusRed: {
    backgroundColor: "#FEE2E2",
  },
  appStatusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  appDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginRight: 4,
  },

  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
  jobDetailsHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  jobDetailsIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  jobDetailsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 8,
    textAlign: "center",
  },
  jobDetailsSchool: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  description: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 16,
  },
  responsibilityRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
    marginTop: 8,
    marginRight: 12,
  },
  responsibilityText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    flex: 1,
  },
  jobDetailsActions: {
    marginBottom: 24,
  },
  fullButton: {
    width: "100%",
  },
  mt2: {
    marginTop: 12,
  },
  mt3: {
    marginTop: 20,
  },

  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#2563EB",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  activeTabText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  tabContentContainer: {
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },

  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },
  settingsInputDisabled: {
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#94A3B8",
  },
  settingsTextArea: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
    height: 100,
    textAlignVertical: "top",
  },

  qualificationCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  qualificationHeader: {
    marginBottom: 12,
  },
  qualificationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
  },
  qualificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  qualificationText: {
    fontSize: 14,
    color: "#1E3A8A",
    flex: 1,
  },
  qualificationRemove: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  qualificationRenew: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  addButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  uploadBox: {
    borderWidth: 2,
    borderColor: "#DBEAFE",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  uploadLink: {
    color: "#2563EB",
    fontWeight: "700",
  },

  toggleCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: "#2563EB",
    lineHeight: 18,
  },
});

export default App;
