import TabLayoutWrapper from "@/components/TabLayoutWrapper";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout, getStoredWalletAuth } from "@/apis/auth";
import { disconnectWallet } from "@/services/wallet";

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const iconColor = "#374151";

  const user = {
    name: "Sai Kumar",
    email: "Hellosir999@gmail.com",
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload a photo."
      );
      return;
    }

    Alert.alert(
      "Select Photo",
      "Choose how you want to add your profile photo",
      [
        { text: "Camera", onPress: () => openCamera() },
        { text: "Photo Library", onPress: () => openImageLibrary() },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
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
            // Get stored wallet auth to disconnect
            const cachedAuth = await getStoredWalletAuth();
            if (cachedAuth) {
              // Disconnect wallet (deauthorize)
              await disconnectWallet(cachedAuth.authToken);
            }

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

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          nestedScrollEnabled={true}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileLeft}>
              <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/android-icon-foreground.png")}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.cameraIconBadge}>
                  <MaterialIcons
                    name="photo-camera"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/account-settings")}
            >
              <MaterialIcons name="edit" size={22} color={iconColor} />
            </TouchableOpacity>
          </View>

          {/* Scan Code */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="qr-code-2" size={24} color={iconColor} />
              <Text style={styles.menuItemText}>Scan code</Text>
            </View>
          </TouchableOpacity>

          {/* Splitwise Pro */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons
                name="diamond-stone"
                size={24}
                color="#8B5CF6"
              />
              <Text style={styles.menuItemText}>Splitwise Pro</Text>
            </View>
          </TouchableOpacity>

          {/* Preferences Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Preferences</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/email-settings")}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="mail-outline" size={24} color={iconColor} />
              <Text style={styles.menuItemText}>Email settings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons
                name="notifications-none"
                size={24}
                color={iconColor}
              />
              <Text style={styles.menuItemText}>
                Device and push notification settings
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/security")}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="lock-outline" size={24} color={iconColor} />
              <Text style={styles.menuItemText}>Security</Text>
            </View>
          </TouchableOpacity>

          {/* Feedback Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Feedback</Text>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="star-outline" size={24} color={iconColor} />
              <Text style={styles.menuItemText}>Rate Splitwise</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="help-outline" size={24} color={iconColor} />
              <Text style={styles.menuItemText}>Contact Splitwise support</Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 28,
    color: "#1F2937",
    fontFamily: "Montserrat_600SemiBold",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    position: "relative",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  avatarTopHalf: {
    width: 80,
    height: 40,
    backgroundColor: "#1CC29F",
  },
  avatarBottomHalf: {
    width: 80,
    height: 40,
    backgroundColor: "#0F766E",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6B7280",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: "Poppins_600SemiBold",
  },
  profileEmail: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "Montserrat_400Regular",
  },
  editButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sectionHeaderText: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "capitalize",
    fontFamily: "Montserrat_600SemiBold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
    fontFamily: "Poppins_400Regular",
  },
  proIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  proIconText: {
    fontSize: 20,
    color: "#8B5CF6",
  },
  bottomSpacer: {
    height: 20,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
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
