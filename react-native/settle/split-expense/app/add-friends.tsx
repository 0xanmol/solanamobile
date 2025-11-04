import { Colors } from "@/constants/colors";
import { BorderRadius, Spacing } from "@/constants/spacing";
import { FontFamily, FontSize } from "@/constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { addFriend } from "@/apis/friends";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AddFriendsScreen() {
  const router = useRouter();
  const [addMethod, setAddMethod] = useState<"pubkey" | "phone">("pubkey");
  const [pubkey, setPubkey] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFriend = async () => {
    if (addMethod === "pubkey") {
      if (!pubkey.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please enter a public key',
        });
        return;
      }

      // Validate Solana public key format
      const trimmedPubkey = pubkey.trim();

      // Check length (Solana addresses are typically 32-44 characters)
      if (trimmedPubkey.length < 32 || trimmedPubkey.length > 44) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Public Key',
          text2: 'Must be 32-44 characters long',
          visibilityTime: 4000,
        });
        return;
      }

      // Check for base58 characters only (no 0, O, I, l)
      if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmedPubkey)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Public Key',
          text2: 'Contains invalid characters (no 0, O, I, or l)',
          visibilityTime: 4000,
        });
        return;
      }

      // Try to validate it's a proper Solana address
      try {
        // This is a basic check - ideally would use @solana/web3.js PublicKey
        const invalidChars = trimmedPubkey.match(/[^1-9A-HJ-NP-Za-km-z]/g);
        if (invalidChars) {
          throw new Error(`Invalid characters: ${invalidChars.join(', ')}`);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Public Key',
          text2: 'Please enter a valid Solana wallet address',
          visibilityTime: 4000,
        });
        return;
      }

      setIsAdding(true);
      try {
        const result = await addFriend({ pubkey: pubkey.trim() });
        if (result.success) {
          Toast.show({
            type: 'success',
            text1: 'Friend Added! 🎉',
            text2: 'Successfully added to your friends list',
          });
          setPubkey("");
          setTimeout(() => router.back(), 500);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: result.message || 'Failed to add friend',
          });
        }
      } catch (error) {
        console.error("Error adding friend:", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add friend. Please try again.',
        });
      } finally {
        setIsAdding(false);
      }
    } else {
      // Phone number method
      if (!phone.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please enter a phone number',
        });
        return;
      }

      setIsAdding(true);
      try {
        const result = await addFriend({
          phone: phone.trim(),
          name: name.trim() || undefined
        });
        if (result.success) {
          Toast.show({
            type: 'success',
            text1: 'Friend Added! 🎉',
            text2: 'Successfully added to your friends list',
          });
          setPhone("");
          setName("");
          setTimeout(() => router.back(), 500);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: result.message || 'Failed to add friend',
          });
        }
      } catch (error) {
        console.error("Error adding friend:", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add friend. Please try again.',
        });
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIcon}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Friend</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Method Selector Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              addMethod === "pubkey" && styles.activeTab,
            ]}
            onPress={() => setAddMethod("pubkey")}
          >
            <MaterialCommunityIcons
              name="wallet-outline"
              size={20}
              color={addMethod === "pubkey" ? "#7C3AED" : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                styles.fontMedium,
                addMethod === "pubkey" && styles.activeTabText,
              ]}
            >
              Public Key
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              addMethod === "phone" && styles.activeTab,
            ]}
            onPress={() => setAddMethod("phone")}
          >
            <MaterialIcons
              name="phone"
              size={20}
              color={addMethod === "phone" ? "#7C3AED" : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                styles.fontMedium,
                addMethod === "phone" && styles.activeTabText,
              ]}
            >
              Phone Number
            </Text>
          </TouchableOpacity>
        </View>

        {addMethod === "pubkey" ? (
          <>
            <View style={styles.instructionContainer}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={48}
                color={Colors.textSecondary}
              />
              <Text style={[styles.instructionTitle, styles.fontSemibold]}>
                Add Friend by Wallet Address
              </Text>
              <Text style={[styles.instructionText, styles.fontRegular]}>
                Enter your friend's Solana public key to add them to your friends list
              </Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, styles.fontMedium]}>
                Solana Public Key
              </Text>
              <TextInput
                style={[styles.pubkeyInput, styles.fontRegular]}
                placeholder="Enter public key (e.g., 7xKXtg2CW87d97TXJ...)"
                placeholderTextColor={Colors.textTertiary}
                value={pubkey}
                onChangeText={setPubkey}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                numberOfLines={2}
              />
              <Text style={[styles.helperText, styles.fontRegular]}>
                Must be a valid Solana address (32-44 characters, base58 encoded). Example: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.instructionContainer}>
              <MaterialIcons
                name="phone"
                size={48}
                color={Colors.textSecondary}
              />
              <Text style={[styles.instructionTitle, styles.fontSemibold]}>
                Add Friend by Phone Number
              </Text>
              <Text style={[styles.instructionText, styles.fontRegular]}>
                Enter your friend's phone number to add them to your friends list
              </Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, styles.fontMedium]}>
                Name (Optional)
              </Text>
              <TextInput
                style={[styles.input, styles.fontRegular]}
                placeholder="Enter friend's name"
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, styles.fontMedium]}>
                Phone Number
              </Text>
              <TextInput
                style={[styles.input, styles.fontRegular]}
                placeholder="Enter phone number (e.g., +1234567890)"
                placeholderTextColor={Colors.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <Text style={[styles.helperText, styles.fontRegular]}>
                Include country code (e.g., +1 for US)
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            ((addMethod === "pubkey" && !pubkey.trim()) ||
              (addMethod === "phone" && !phone.trim()) ||
              isAdding) &&
              styles.addButtonDisabled,
          ]}
          onPress={handleAddFriend}
          disabled={
            (addMethod === "pubkey" && !pubkey.trim()) ||
            (addMethod === "phone" && !phone.trim()) ||
            isAdding
          }
        >
          {isAdding ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color="#FFFFFF"
              />
              <Text style={[styles.addButtonText, styles.fontSemibold]}>
                Add Friend
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.poppinsSemiBold,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: "#7C3AED",
  },
  instructionContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  instructionTitle: {
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  instructionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: Spacing["2xl"],
  },
  inputLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  pubkeyInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    minHeight: 80,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  addButtonDisabled: {
    backgroundColor: Colors.gray300,
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: FontSize.lg,
    color: "#FFFFFF",
  },
  fontRegular: { fontFamily: FontFamily.poppinsRegular },
  fontMedium: { fontFamily: FontFamily.poppinsMedium },
  fontSemibold: { fontFamily: FontFamily.poppinsSemiBold },
  fontBold: { fontFamily: FontFamily.poppinsBold },
});
