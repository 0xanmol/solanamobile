import TabLayoutWrapper from "@/components/TabLayoutWrapper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "@/apis/auth";
import { useAuthorization, useTheme } from "@/components/providers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/theme";

interface UserData {
  id: string;
  name: string;
  phone: string;
  pubkey?: string;
}

export default function AccountScreen() {
  const { colorScheme, themeMode, setThemeMode, isDark } = useTheme();
  const { authorization, deauthorizeSession } = useAuthorization();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get user data from AsyncStorage
      const userJson = await AsyncStorage.getItem('user_data');
      if (userJson) {
        setUserData(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to disconnect your wallet and logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Deauthorize wallet session
            await deauthorizeSession();

            // Logout from backend and clear all local data
            await logout();

            // Navigate to login screen
            router.replace("/login");
          } catch (error) {
            console.error("Logout error:", error);
            // Still navigate to login even if there's an error
            router.replace("/login");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <TabLayoutWrapper>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
          </View>
        </SafeAreaView>
      </TabLayoutWrapper>
    );
  }

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cardBackground }]} edges={["top"]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Account</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={24} color={colors.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Name</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{userData?.name || 'N/A'}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={24} color={colors.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Phone Number</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{userData?.phone || 'N/A'}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <MaterialIcons name="account-balance-wallet" size={24} color={colors.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Wallet Address</Text>
                <Text style={[styles.pubkeyValue, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {authorization?.selectedAccount?.address || 'Not connected'}
                </Text>
              </View>
            </View>
          </View>

          {/* Theme Settings Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
            <View style={styles.infoRow}>
              <MaterialIcons name="dark-mode" size={24} color={colors.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Appearance</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {themeMode === 'system' ? 'System Default' : themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor={isDark ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>
        </ScrollView>

        {/* Logout Button */}
        <View style={[styles.logoutContainer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Montserrat_600SemiBold",
  },
  content: {
    flex: 1,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Montserrat_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  pubkeyValue: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  divider: {
    height: 1,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#EF4444",
  },
});
