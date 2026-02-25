import React, {useState, ReactNode} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet, View, Image, Button, Dimensions, TextInput, Text, TouchableOpacity, Alert, ScrollView, ViewStyle, Switch, Modal } from 'react-native';
import SignupScreen from './registerTwo';
import LoginTwoScreen from "./loginTwo";
import { Link } from 'expo-router';
import { PanelLeft, School, User, Users, Briefcase, GraduationCap, Menu, X, ChevronRight,
    MapPin, Star, Settings, CheckCircle, Clock, Mail, ArrowLeft, LogOut, Trash2, Calendar, BookOpen, UserCheck} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CONTENT_WIDTH = width > 700 ? 600 : '100%';

const mockSchool = [{
    id: 1, position: 'High school Math Teacher', name: 'Mr. Eric k.',
    status: 'Pending', date: '2 days ago'},
    {
    id: 2, position: 'High school History Teacher', name: 'Mrs. Estelle Hans',
    status: 'Pending', date: '1 week ago'},
    {
    id: 3, position: 'High school Geography Teacher', name: 'Miss Lindsey Lohan',
    status: 'Occupied', date: '2 months ago'}, 
];

const mockTeachers = [
    {
        id: 1,
        name: 'Mr. Eric k.',
        subject: 'Mathematics Teacher',
        experience: '8 years',
        education: 'M.Ed in Mathematics Education',
        availability: 'Full-time | Part-time',
        location: 'Yaoundé, Centre',
        email: 'eric.k@email.com',
        phone: '+237 600 000 000',
        bio: 'Passionate mathematics educator with 8 years of experience teaching high school students. Specialized in calculus, algebra, and geometry. Strong track record of improving student performance and making math engaging and accessible.',
        certifications: ['Teaching License', 'Advanced Mathematics Certificate'],
        rating: 4.8
    },
    {
        id: 2,
        name: 'Miss Lindsey Lohan',
        subject: 'Geography Teacher',
        experience: '5 years',
        education: 'B.A. in Geography',
        availability: 'Full-time | Part-time',
        location: 'Yaoundé, Centre',
        email: 'lindsey.l@email.com',
        phone: '+237 600 000 000',
        bio: 'Enthusiastic geography teacher with expertise in physical and human geography. Uses innovative teaching methods including field trips and digital mapping tools to engage students.',
        certifications: ['Teaching License', 'GIS Certification'],
        rating: 4.6
    },
    {
        id: 3,
        name: 'Mrs. Estelle Hans',
        subject: 'History Teacher',
        experience: '12 years',
        education: 'M.A. in History',
        availability: 'Full-time | Part-time',
        location: 'Yaoundé, Centre',
        email: 'estelle.h@email.com',
        phone: '+237 600 000 000',
        bio: 'Experienced history teacher with a passion for making historical events come alive for students. Specializes in African history and world civilizations. Known for creating engaging lesson plans and fostering critical thinking.',
        certifications: ['Teaching License', 'History Education Specialist'],
        rating: 4.9
    }
];

// Side Nav 
const SchoolSideNavigationMenu = ({ visible, onClose, setCurrentPage }: { visible: boolean; onClose: () => void; setCurrentPage: (page: string) => void }) => {
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    onClose();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your school account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your school account has been successfully deleted.');
            onClose();
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            Alert.alert('Logged Out', 'You have been successfully logged out.');
            handleNavigation('Home');
          }
        }
      ]
    );
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
            
            <View style={styles.sideNavHeader}>
              <TouchableOpacity onPress={onClose} style={styles.backArrow}>
                <ArrowLeft color="#1E3A8A" size={24} />
              </TouchableOpacity>
              <Text style={styles.sideNavLogo}>TeacherHub</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              
              <View style={styles.profilePhotoContainer}>
                <View style={styles.profilePhoto}>
                  <School color="#2563EB" size={48} />
                </View>
              </View>

              {/* Upload Photo Option */}
              <TouchableOpacity style={styles.uploadPhotoButton}>
                <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              </TouchableOpacity>

              <Text style={styles.userName}>Eschosys Academy</Text>
              <Text style={styles.userEmail}>eschosys@school.edu.cm</Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Interviews')}
              >
                <View style={styles.menuItemIcon}>
                  <Calendar color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Interviews</Text>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('SavedTeachers')}
              >
                <View style={styles.menuItemIcon}>
                  <BookOpen color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Teachers</Text>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Waitlist')}
              >
                <View style={styles.menuItemIcon}>
                  <UserCheck color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Waitlist</Text>
                <ChevronRight color="#64748B" size={20} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleNavigation('Vacancies')}
              >
                <View style={styles.menuItemIcon}>
                  <Briefcase color="#2563EB" size={22} />
                </View>
                <Text style={styles.menuItemText}>Vacancies</Text>
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
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut color="#FFFFFF" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

//BUTTON COMPONENTS
const PrimaryButton = ({ children, onPress, color = 'indigo', style }:
    { children: ReactNode; onPress?: () => void; color?: 'indigo' | 'green' | 'pink' | 'gray'; style?: ViewStyle }) => {
    const colorMap = {
        indigo: styles.btnIndigo,
        green: styles.btnGreen,
        pink: styles.btnPink,
        gray: { backgroundColor: '#6b7280' },
    };

    return (
        <TouchableOpacity
      onPress={onPress}
      style={[styles.button, colorMap[color], style]}>
        <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

// Stat Card for Dashboards
const StatCard = ({ title, value, color }:
    { title: string; value: string; color: 'green' | 'indigo' | 'yellow' | 'pink' |'gray' }) => {
  const colorMap: Record<string, string> = {
    green: '#10b981',
    indigo: '#4f46e5',
    yellow: '#f59e0b',
    pink: '#ec4899',
    gray: '#9ca3af',
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
 
// --- Upload Vacancy Screen ---
const UploadVacancy = ({ setCurrentPage }: { setCurrentPage?: (page: string) => void }) => {
    const [formData, setFormData] = useState({
        position: '',
        subject: '',
        employmentType: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        requirements: '',
        responsibilities: '',
        deadline: ''
    });

    const handleSubmit = () => {
        Alert.alert('Success', 'Vacancy posted successfully!');
        setCurrentPage && setCurrentPage('Home');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.modernHeader}>
                    <Text style={styles.modernHeaderTitle}>Post a Vacancy</Text>
                    <Text style={styles.modernHeaderSubtitle}>Fill in the details to attract qualified teachers</Text>
                </View>

                <View style={styles.modernCard}>
                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Position Details</Text>
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Position Title</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="e.g., High School Math Teacher"
                            placeholderTextColor="#9ca3af"
                            value={formData.position}
                            onChangeText={(text) => setFormData({...formData, position: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Subject/Department</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="e.g., Mathematics, Science, English"
                            placeholderTextColor="#9ca3af"
                            value={formData.subject}
                            onChangeText={(text) => setFormData({...formData, subject: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Employment Type</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="Full-time, Part-time, or Contract"
                            placeholderTextColor="#9ca3af"
                            value={formData.employmentType}
                            onChangeText={(text) => setFormData({...formData, employmentType: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Location</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="City, Region"
                            placeholderTextColor="#9ca3af"
                            value={formData.location}
                            onChangeText={(text) => setFormData({...formData, location: text})}
                        />
                    </View>

                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Compensation</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Minimum Salary (XAF)</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="e.g., 150000"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                            value={formData.salaryMin}
                            onChangeText={(text) => setFormData({...formData, salaryMin: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Maximum Salary (XAF)</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="e.g., 300000"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                            value={formData.salaryMax}
                            onChangeText={(text) => setFormData({...formData, salaryMax: text})}
                        />
                    </View>

                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Job Description</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Requirements</Text>
                        <TextInput 
                            style={styles.modernTextArea}
                            multiline
                            numberOfLines={4}
                            placeholder="List required qualifications, certifications, and experience."
                            placeholderTextColor="#9ca3af"
                            value={formData.requirements}
                            onChangeText={(text) => setFormData({...formData, requirements: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Key Responsibilities</Text>
                        <TextInput 
                            style={styles.modernTextArea}
                            multiline
                            numberOfLines={4}
                            placeholder="Describe main duties and responsibilities."
                            placeholderTextColor="#9ca3af"
                            value={formData.responsibilities}
                            onChangeText={(text) => setFormData({...formData, responsibilities: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Application Deadline</Text>
                        <TextInput 
                            style={styles.modernInput} 
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#9ca3af"
                            value={formData.deadline}
                            onChangeText={(text) => setFormData({...formData, deadline: text})}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <PrimaryButton 
                            onPress={handleSubmit}
                            color='indigo'
                            style={styles.flex1}>
                            Post Vacancy
                        </PrimaryButton>
                        <PrimaryButton 
                            onPress={() => setCurrentPage && setCurrentPage('Home')}
                            color='gray'
                            style={styles.flex1}>
                            Cancel
                        </PrimaryButton>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

// --- Teacher Details Screen ---
const TeacherDetails = ({ setCurrentPage, teacherId }: { setCurrentPage?: (page: string) => void, teacherId?: number }) => {
    const teacher = mockTeachers.find(t => t.id === teacherId) || mockTeachers[0];
    const [showScheduleInterview, setShowScheduleInterview] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');

    const handleScheduleInterview = () => {
        if (!interviewDate || !interviewTime) {
            Alert.alert('Error', 'Please select both date and time for the interview');
            return;
        }
        Alert.alert('Success', `Video interview scheduled with ${teacher.name} on ${interviewDate} at ${interviewTime}`);
        setShowScheduleInterview(false);
        setInterviewDate('');
        setInterviewTime('');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={() => setCurrentPage && setCurrentPage('Home')}
                    style={styles.modernBackButton}>
                    <Text style={styles.modernBackButtonText}>← Back to Listings</Text>
                </TouchableOpacity>

                <View style={styles.modernCard}>
                    <View style={styles.teacherHeader}>
                        <View style={styles.modernTeacherAvatar}>
                            <Text style={styles.avatarText}>{teacher.name.charAt(0)}</Text>
                        </View>
                        <View style={styles.teacherHeaderInfo}>
                            <Text style={styles.modernTeacherName}>{teacher.name}</Text>
                            <Text style={styles.modernTeacherSubject}>{teacher.subject}</Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>★ {teacher.rating}</Text>
                                <Text style={styles.ratingLabel}> rating</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>About</Text>
                    </View>
                    <Text style={styles.modernBioText}>{teacher.bio}</Text>

                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Professional Information</Text>
                    </View>
                    <View style={styles.modernInfoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.modernInfoLabel}>Experience:</Text>
                            <Text style={styles.modernInfoValue}>{teacher.experience}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.modernInfoLabel}>Education:</Text>
                            <Text style={styles.modernInfoValue}>{teacher.education}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.modernInfoLabel}>Availability:</Text>
                            <Text style={styles.modernInfoValue}>{teacher.availability}</Text>
                        </View>
                        <View style={styles.infoRowLast}>
                            <Text style={styles.modernInfoLabel}>Location:</Text>
                            <Text style={styles.modernInfoValue}>{teacher.location}</Text>
                        </View>
                    </View>

                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Contact Information</Text>
                    </View>
                    <View style={styles.modernInfoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.modernInfoLabel}>Email:</Text>
                            <Text style={styles.modernInfoValue}>{teacher.email}</Text>
                        </View>
                        <View style={styles.infoRowLast}>
                            <Text style={styles.modernInfoLabel}>Phone:</Text>
                            <Text style={styles.modernInfoValue}>{teacher.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Certifications</Text>
                    </View>
                    <View style={styles.certGrid}>
                        {teacher.certifications.map((cert, index) => (
                            <View key={index} style={styles.modernCertBadge}>
                                <Text style={styles.modernCertText}>✓ {cert}</Text>
                            </View>
                        ))}
                    </View>

                    {!showScheduleInterview ? (
                        <View style={styles.actionButtonsContainer}>
                            <PrimaryButton 
                                onPress={() => setShowScheduleInterview(true)}
                                color='indigo'
                                style={styles.flex1}>
                                Schedule Video Interview
                            </PrimaryButton>
                            <PrimaryButton 
                                onPress={() => Alert.alert('Added', `${teacher.name} added to waitlist`)}
                                color='green'
                                style={styles.flex1}>
                                Add to Waitlist
                            </PrimaryButton>
                        </View>
                    ) : (
                        <View style={styles.modernScheduleCard}>
                            <Text style={styles.modernScheduleTitle}>Schedule Video Interview</Text>
                            
                            <View style={styles.inputGroup}>
                                <Text style={styles.modernLabel}>Interview Date</Text>
                                <TextInput 
                                    style={styles.modernInput} 
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor="#9ca3af"
                                    value={interviewDate}
                                    onChangeText={setInterviewDate}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.modernLabel}>Interview Time</Text>
                                <TextInput 
                                    style={styles.modernInput} 
                                    placeholder="HH:MM (e.g., 14:00)"
                                    placeholderTextColor="#9ca3af"
                                    value={interviewTime}
                                    onChangeText={setInterviewTime}
                                />
                            </View>

                            <View style={styles.scheduleNoteContainer}>
                                <Text style={styles.scheduleNote}>
                                     A video meeting link will be sent to both parties via email
                                </Text>
                            </View>

                            <View style={styles.buttonRow}>
                                <PrimaryButton 
                                    onPress={handleScheduleInterview}
                                    color='indigo'
                                    style={styles.flex1}>
                                    Confirm Schedule
                                </PrimaryButton>
                                <PrimaryButton 
                                    onPress={() => {
                                        setShowScheduleInterview(false);
                                        setInterviewDate('');
                                        setInterviewTime('');
                                    }}
                                    color='gray'
                                    style={styles.flex1}>
                                    Cancel
                                </PrimaryButton>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

// --- School Settings Screen ---
const SchoolSettings = ({ setCurrentPage }: { setCurrentPage?: (page: string) => void }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [positionSearchVisible, setPositionSearchVisible] = useState(true);
    const [serviceVisible, setServiceVisible] = useState(true);

    const renderContent = () => {
        if (activeTab === 'profile') {
            return (
                <View style={styles.tabContent}>
                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>School & Contact Information</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>School Name</Text>
                        <TextInput style={styles.modernInput} placeholder="Enter school name" placeholderTextColor="#9ca3af" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Phone number</Text>
                        <TextInput style={styles.modernInput} placeholder="Enter phone number" placeholderTextColor="#9ca3af" keyboardType="phone-pad" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Email Address</Text>
                        <TextInput style={styles.modernInput} placeholder="Enter email address" placeholderTextColor="#9ca3af" keyboardType="email-address" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>School Summary / Bio</Text>
                        <TextInput
                            style={styles.modernTextArea}
                            multiline
                            numberOfLines={6}
                            placeholder="Tell us about your school..."
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                     <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Location & Preferences</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Hire condition</Text>
                        <TextInput style={styles.modernInput} placeholder="e.g., Immediate, Next semester" placeholderTextColor="#9ca3af" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Location</Text>
                        <TextInput style={styles.modernInput} placeholder="City, Region" placeholderTextColor="#9ca3af" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.modernLabel}>Salary Range (min)</Text>
                        <TextInput style={styles.modernInput} placeholder="Minimum salary in XAF" placeholderTextColor="#9ca3af" keyboardType="numeric" />
                    </View>
                    <PrimaryButton onPress={() => Alert.alert('Success', 'Profile updated successfully!')} color='indigo' style={styles.mt4}>
                        Save Changes
                    </PrimaryButton>
                </View>
            );
         } 
         else if (activeTab === 'qualifications') {
            return (
                <View style={styles.tabContent}>
                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>Required Documents</Text>
                    </View>
                    <View style={styles.modernQualificationCard}>
                        <Text style={styles.modernQualificationTitle}>Registration Number</Text>
                        <View style={styles.qualificationItem}>
                            <TextInput style={styles.modernInput} placeholder="Enter registration number" placeholderTextColor="#9ca3af" />
                        </View>
                        <PrimaryButton color='indigo' style={styles.saveSmallBtn}>Save</PrimaryButton>
                    </View>
                    <View style={styles.modernQualificationCard}>
                        <Text style={styles.modernQualificationTitle}>Licenses/Certifications</Text>
                        <View style={styles.qualificationItem}>
                            <TextInput style={styles.modernInput} placeholder="Upload or enter certification details" placeholderTextColor="#9ca3af" />
                        </View>
                        <TouchableOpacity style={styles.uploadButton}>
                            <Text style={styles.uploadButtonText}>Upload Document</Text>
                        </TouchableOpacity>
                        <PrimaryButton color='indigo' style={styles.saveSmallBtn}>Save</PrimaryButton>
                    </View>
                </View>
            );
        } else if (activeTab === 'visibility') {
            return (
                <View style={styles.tabContent}>
                    <View style={styles.modernSectionHeader}>
                        <View style={styles.sectionHeaderLine} />
                        <Text style={styles.modernSectionTitle}>School Visibility & Services</Text>
                    </View>
                    <View style={styles.modernToggleCard}>
                        <View style={{ flexShrink: 1 }}>
                            <Text style={styles.modernToggleTitle}>Available for Job Applications</Text>
                            <Text style={styles.modernToggleSubtitle}>If disabled, your profile will not appear in job search results.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#d1d5db", true: "#818cf8" }}
                            thumbColor={positionSearchVisible ? "#4f46e5" : "#f3f4f6"}
                            onValueChange={setPositionSearchVisible}
                            value={positionSearchVisible}
                        />
                    </View>
                    <View style={styles.modernToggleCard}>
                        <View style={{ flexShrink: 1 }}>
                            <Text style={styles.modernToggleTitle}>Offer Training/Consulting Services</Text>
                            <Text style={styles.modernToggleSubtitle}>Controls visibility on the Services Marketplace.</Text>
                        </View>
                         <Switch
                            trackColor={{ false: "#d1d5db", true: "#818cf8" }}
                            thumbColor={serviceVisible ? "#4f46e5" : "#f3f4f6"}
                            onValueChange={setServiceVisible}
                            value={serviceVisible}
                        />
                    </View>
                    <PrimaryButton onPress={() => {
                        Alert.alert('Success', 'Visibility settings saved!');
                        setCurrentPage && setCurrentPage('Home');
                    }}
                      color='indigo' 
                      style={styles.mt4}>
                       Save Profile Settings
                    </PrimaryButton>
                </View>
            );
        }
    }
     return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.modernHeader}>
                    <Text style={styles.modernHeaderTitle}>School Profile</Text>
                    <Text style={styles.modernHeaderSubtitle}>Update your school details, requirements and platform visibility.</Text>
                </View>
             <View style={styles.modernCard}>
                    <View style={styles.modernTabsContainer}>
                        <TouchableOpacity
                            style={[styles.modernTabButton, activeTab === 'profile' && styles.modernActiveTab]}
                            onPress={() => setActiveTab('profile')}>
                        <Text style={[styles.modernTabText, activeTab === 'profile' && styles.modernActiveTabText]}>Basic Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modernTabButton, activeTab === 'qualifications' && styles.modernActiveTab]}
                            onPress={() => setActiveTab('qualifications')}>
                        <Text style={[styles.modernTabText, activeTab === 'qualifications' && styles.modernActiveTabText]}>Qualifications</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modernTabButton, activeTab === 'visibility' && styles.modernActiveTab]}
                            onPress={() => setActiveTab('visibility')}>
                            <Text style={[styles.modernTabText, activeTab === 'visibility' && styles.modernActiveTabText]}>Visibility</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tabContentPadding}>
                        {renderContent()}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

// --- School Dashboard ---
const SchoolDashboard = ({ setCurrentPage }: { setCurrentPage?: (page: string) => void }) => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
        <View style={styles.modernHeader}>
            <Text style={styles.modernHeaderTitle}>Welcome to TeacherHub</Text>
            <Text style={styles.modernHeaderSubtitle}>Manage your profile, applications and hiring here.</Text>
        </View>
        <View style={styles.statsGrid}>
            <StatCard title="Profile Completion" value="85%" color="green" />
            <StatCard title="Active Vacancies" value="10" color="indigo" />
            <StatCard title="Interview Requests" value="2" color="yellow" />
            <StatCard title="Teachers hired " value="6" color="pink" />
        </View>
        <View style={styles.modernAlertCard}>
            <Text style={styles.modernAlertTitle}>Profile Status: Needs Update</Text>
            <Text style={styles.modernAlertSubtitle}>Your openings need renewal. Update your profile to stay visible to top Teachers.</Text>
            <View style={styles.buttonRow}>
                <PrimaryButton 
                    onPress={() => setCurrentPage && setCurrentPage('SchoolSettings')}
                    color='indigo'
                    style={styles.flex1}>
                     Edit Profile
                </PrimaryButton>
                <PrimaryButton 
                   onPress={() => setCurrentPage && setCurrentPage('Home')}
                    color='green'
                    style={styles.flex1}>
                    Home
                </PrimaryButton>
            </View>
        </View>
        <View style={styles.modernCard}>
            <Text style={styles.modernCardHeader}>Recent Job Applications</Text>
            {mockSchool.map(app => (
                <View key={app.id} style={styles.modernAppRow}>
                    <View style={styles.appDetails}>
                        <Text style={styles.modernAppJob}>{app.position}</Text>
                        <Text style={styles.modernAppSchool}>{app.name}</Text>
                    </View>
                    <View style={styles.appStatusContainer}>
                        <View style={[styles.modernAppStatus, 
                            app.status.startsWith('Interview') ? styles.statusYellow :
                            app.status.startsWith('Pending') ? styles.statusIndigo :
                            styles.statusRed
                        ]}>
                            <Text style={styles.modernStatusText}>{app.status}</Text>
                        </View>
                        <Text style={styles.modernAppDate}>{app.date}</Text>
                    </View>
                </View>
            ))}
        <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllButtonText}>View All Applications →</Text>
            </TouchableOpacity>
        </View>
    </View>
  </ScrollView>
);

// --- Home Dashboard ---
const HomeDashboard = ({ setCurrentPage, setSelectedTeacherId }: { setCurrentPage?: (page: string) => void, setSelectedTeacherId?: (id: number) => void }) => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            <View style={styles.modernHeader}>
                <Text style={styles.modernHeaderTitle}>Welcome to TeacherHub</Text>
                <Text style={styles.modernHeaderSubtitle}>Find your next teacher, hire top talent.</Text>
            </View>
            <View style={styles.modernSearchCard}>
                <TextInput
                    style={styles.modernSearchInput}
                    placeholder="Search for teachers and tutors..."
                    placeholderTextColor="#9ca3af"
                />
                 <View style={styles.buttonRow}>
                    <PrimaryButton 
                        onPress={() => setCurrentPage && setCurrentPage('UploadVacancy')} 
                        color='indigo'
                        style={styles.flex1}>
                        Upload Vacancies
                    </PrimaryButton>
                    <PrimaryButton 
                        onPress={() => setCurrentPage && setCurrentPage('TeacherDashboard')} 
                        color='green' 
                        style={styles.flex1}>
                        Dashboard
                    </PrimaryButton>
                </View>
             </View>
             <Text style={styles.modernCardHeader}>Top Teacher Listings</Text>
         <View style={styles.featureList}>
                {mockTeachers.map(teacher => (
                    <View key={teacher.id} style={styles.modernFeatureItem}>
                        <View style={styles.featureItemHeader}>
                            <View style={styles.smallAvatar}>
                                <Text style={styles.smallAvatarText}>{teacher.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.featureItemHeaderText}>
                                <Text style={styles.modernFeatureTitle}>{teacher.name}</Text>
                                <Text style={styles.modernFeatureDetail}>{teacher.subject}</Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingBadgeText}>★ {teacher.rating}</Text>
                            </View>
                        </View>
                        <Text style={styles.modernFeatureTag}>📍 {teacher.location}</Text>
                        <Text style={styles.modernFeatureTag}>⏰ {teacher.availability}</Text>
                        <View style={styles.buttonRow}> 
                          <PrimaryButton 
                            onPress={() => {
                                setSelectedTeacherId && setSelectedTeacherId(teacher.id);
                                setCurrentPage && setCurrentPage('TeacherDetails');
                            }} 
                            color='indigo'
                            style={styles.flex1}>
                            Hire Now
                          </PrimaryButton>
                          <PrimaryButton 
                            onPress={() => Alert.alert('Added', `${teacher.name} added to waitlist`)} 
                            color='green'
                            style={styles.flex1}>
                            Wait List
                          </PrimaryButton>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    </ScrollView>
);

// --- Main Application Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedTeacherId, setSelectedTeacherId] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
       return <HomeDashboard setCurrentPage={setCurrentPage} setSelectedTeacherId={setSelectedTeacherId} />;
      case 'TeacherDashboard':
       return <SchoolDashboard setCurrentPage={setCurrentPage} />;
      case 'SchoolSettings':
        return <SchoolSettings setCurrentPage={setCurrentPage} />;
      case 'UploadVacancy':
        return <UploadVacancy setCurrentPage={setCurrentPage} />;
      case 'TeacherDetails':
        return <TeacherDetails setCurrentPage={setCurrentPage} teacherId={selectedTeacherId} />;
      default:
        return <HomeDashboard setCurrentPage={setCurrentPage} setSelectedTeacherId={setSelectedTeacherId} />;
        }    
    }

  return (
    <View style={styles.appContainer}>
      <View style={styles.modernAppHeader}>
        <Text style={styles.modernLogoText}>TeacherHub</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <View style={styles.profileIconContainer}>
            <User color="#2563EB" size={24} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Side Navigation Menu */}
      <SchoolSideNavigationMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)}
        setCurrentPage={setCurrentPage}
      />

      {renderPage()}
    </View>
  );
};

// COMPLETE STYLES INCLUDING SIDE NAVIGATION
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 3,
  },
  
  // Profile Icon Container (NEW)
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Side Navigation Modal (NEW)
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideNavContainer: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Side Nav Header (NEW)
  sideNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#EFF6FF',
  },
  backArrow: {
    marginRight: 12,
  },
  sideNavLogo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  
  // Profile Section (NEW)
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profilePhotoContainer: {
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2563EB',
  },
  uploadPhotoButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  uploadPhotoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  
  // Menu Items (NEW)
  menuItems: {
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemIconDanger: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  menuItemTextDanger: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  menuDivider: {
    height: 8,
    backgroundColor: '#F8FAFC',
    marginVertical: 8,
  },
  
  // Logout Button (NEW)
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // EXISTING STYLES CONTINUE BELOW...
  scrollContainer: {
    paddingBottom: 30,
  },
  container: {
    width: CONTENT_WIDTH,
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modernAppHeader: {
    backgroundColor: '#ffffff',
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modernLogoText: {
     fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  modernNavLink: {
    padding: -8,
  },
  modernNavText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '600',
  },
  modernHeader: {
    marginBottom: 10,
  },
  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernHeaderSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 22,
  },
  modernCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  modernCardHeader: {
   fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  modernSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionHeaderLine: {
    width: 4,
    height: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 2,
    marginRight: 10,
  },
  modernSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  btnIndigo: { 
    backgroundColor: '#2563EB',
  },
  btnGreen: { 
    backgroundColor: '#10b981',
  },
  btnPink: { 
    backgroundColor: '#ec4899',
  },
  buttonRow: { 
    flexDirection: 'row', 
    gap: 12,
    marginTop: 16,
  },
  flex1: { 
    flex: 1 
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    width: '48%',
    marginBottom: 10,
    borderBottomWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: { fontSize: 12, fontWeight: '500', color: '#6b7280' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 3 },
  iconPlaceholder: { fontSize: 30, opacity: 0.7 },
  borderGreen: { borderColor: '#10b981' },
  borderIndigo: { borderColor: '#4f46e5' },
  borderYellow: { borderColor: '#f59e0b' },
  borderPink: { borderColor: '#ec4899'},
  scrollcontainer: { paddingBottom: 20,},
  modernAlertCard: {
    backgroundColor: '#eef2ff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  modernAlertTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1e1b4b', 
    marginBottom: 8,
  },
  modernAlertSubtitle: { 
    fontSize: 14, 
    color: '#4338ca', 
    marginBottom: 16,
    lineHeight: 20,
  },
  modernAppRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  appDetails: { flex: 2 },
  appStatusContainer: { 
    alignItems: 'flex-end', 
    flex: 1,
  },
  modernAppJob: { 
    fontWeight: '700', 
    color: '#111827', 
    fontSize: 15,
    marginBottom: 4,
  },
  modernAppSchool: { 
    fontSize: 13, 
    color: '#6b7280',
  },
  modernAppStatus: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    marginBottom: 4,
  },
  modernStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modernAppDate: { 
    fontSize: 12, 
    color: '#9ca3af',
  },
  statusYellow: { backgroundColor: '#fef3c7' },
  statusIndigo: { backgroundColor: '#e0e7ff' },
  statusRed: { backgroundColor: '#fee2e2' },
  viewAllButton: { 
    marginTop: 16, 
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  viewAllButtonText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#4f46e5',
  },
  modernSearchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    shadowColor: '#000',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modernSearchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e0e7ff',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    marginBottom: 16,
    color: '#111827',
  },
  featureList: { marginTop: 12 },
  modernFeatureItem: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  featureItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  smallAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  featureItemHeaderText: {
    flex: 1,
  },
  modernFeatureTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1E3A8A',
    marginBottom: 2,
  },
  modernFeatureDetail: { 
    fontSize: 14, 
    color: '#4f46e5', 
    fontWeight: '600',
  },
  modernFeatureTag: { 
    fontSize: 13, 
    color: '#6b7280', 
    marginBottom: 6,
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: {
    color: '#b45309',
    fontSize: 13,
    fontWeight: '700',
  },
  modernTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
    marginBottom: 20,
  },
  modernTabButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  modernTabText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9ca3af',
  },
  modernActiveTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4f46e5',
  },
  modernActiveTabText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  tabContentPadding: { paddingTop: 8 },
  tabContent: { flex: 1 },
  inputGroup: { marginBottom: 18 },
  modernLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  modernInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#111827',
  },
  modernTextArea: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    height: 120,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    fontSize: 15,
    color: '#111827',
  },
  mt4: { marginTop: 24 },
  modernQualificationCard: { 
    padding: 18, 
    borderRadius: 14, 
    backgroundColor: '#f9fafb', 
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  modernQualificationTitle: { 
    fontWeight: '700', 
    color: '#1e1b4b', 
    marginBottom: 12,
    fontSize: 16,
  },
  qualificationItem: { 
    marginBottom: 10,
  },
  saveSmallBtn: { 
    marginTop: 12, 
    alignSelf: 'flex-start',
  },
  uploadButton: {
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#4338ca',
    fontWeight: '600',
    fontSize: 14,
  },
  modernToggleCard: { 
    padding: 18, 
    borderRadius: 14, 
    backgroundColor: '#f9fafb', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  modernToggleTitle: { 
    fontWeight: '700', 
    color: '#111827',
    fontSize: 16,
    marginBottom: 4,
  },
  modernToggleSubtitle: { 
    fontSize: 13, 
    color: '#6b7280', 
    marginTop: 4, 
    marginRight: 12,
    lineHeight: 18,
  },
  modernBackButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  modernBackButtonText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '700',
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modernTeacherAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '800',
  },
  teacherHeaderInfo: {
    flex: 1,
  },
  modernTeacherName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  modernTeacherSubject: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingLabel: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 4,
  },
  modernBioText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 8,
  },
  modernInfoCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoRowLast: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  modernInfoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    width: 130,
  },
  modernInfoValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    fontWeight: '500',
  },
  certGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  modernCertBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  modernCertText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 24,
  },
  modernScheduleCard: {
    backgroundColor: '#eef2ff',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#c7d2fe',
  },
  modernScheduleTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: 18,
  },
  scheduleNoteContainer: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  scheduleNote: {
    fontSize: 13,
    color: '#4338ca',
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default App;