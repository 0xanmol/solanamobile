import { Colors } from "@/constants/colors";
import { BorderRadius, Spacing } from "@/constants/spacing";
import { FontFamily, FontSize } from "@/constants/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContactItem {
  id: string;
  name: string;
  phone: string;
  avatarUri?: string;
  alreadyFriend?: boolean;
}

export default function AddFriendsScreen() {
  const router = useRouter();

  const contacts: ContactItem[] = useMemo(
    () => [
      { id: "c1", name: "1", phone: "+919606933222", alreadyFriend: true },
      { id: "c2", name: "2", phone: "+919606933222" },
      { id: "c3", name: "AJAY Fmcg VERMA", phone: "+918619282800" },
      { id: "c4", name: "AJAY SINGH HADA", phone: "+917891672343" },
      { id: "c5", name: "ARVIND KU.MEHRA", phone: "+917737423537" },
      { id: "c6", name: "Aakash Kashyap", phone: "+919911079670" },
      { id: "c7", name: "Aarav", phone: "", alreadyFriend: true },
      { id: "c8", name: "Aashir sheikh", phone: "+918107017913" },
      { id: "c9", name: "Aashish", phone: "+917878148667" },
      { id: "c10", name: "Abczyz", phone: "+917317157597" },
    ],
    []
  );

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
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder="Enter name, email, or phone #"
            placeholderTextColor={Colors.textTertiary}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <MaterialIcons name="check" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addSomeoneRow}>
        <MaterialCommunityIcons
          name="account-plus-outline"
          size={24}
          color={Colors.textPrimary}
        />
        <Text style={[styles.addSomeoneText, styles.fontSemibold]}>
          Add someone new
        </Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, styles.fontMedium]}>
          From your contacts
        </Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
      >
        {contacts.map((c) => (
          <View key={c.id} style={styles.row}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#6B7280"
              style={{ width: 28 }}
            />
            <View style={styles.avatarBox}>
              {c.avatarUri ? (
                <Image source={{ uri: c.avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.generatedAvatar} />
              )}
            </View>
            <View style={styles.rowText}>
              <Text
                style={[styles.rowTitle, styles.fontMedium]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {c.name}
              </Text>
              <Text
                style={[styles.rowSubtitle, styles.fontRegular]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {c.alreadyFriend ? "Already a friend" : c.phone}
              </Text>
            </View>
            <View style={styles.rowRight}>
              {c.alreadyFriend ? (
                <MaterialIcons name="check" size={22} color={Colors.gray300} />
              ) : (
                <TouchableOpacity style={styles.invitePill}>
                  <Text style={[styles.invitePillText, styles.fontSemibold]}>
                    Invite
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
    alignItems: "stretch",
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppinsRegular,
    color: Colors.textPrimary,
    padding: 0,
    margin: 0,
    minHeight: 0,
    maxHeight: 40,
    paddingVertical: 0,
    textAlignVertical: Platform.select({
      android: "center" as const,
      default: undefined,
    }),
    includeFontPadding: Platform.select({ android: false, default: undefined }),
  },
  addSomeoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  addSomeoneText: { fontSize: FontSize.xl, color: Colors.textPrimary },
  sectionHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  sectionTitle: { color: Colors.textSecondary, fontSize: FontSize.md },
  list: { flex: 1 },
  listContent: { paddingBottom: Spacing["2xl"] },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
    width: "100%",
  },
  avatarBox: { width: 44, height: 44, marginRight: Spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  generatedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: FontSize.lg, color: Colors.textPrimary, flex: 1 },
  rowSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
    flex: 1,
  },
  rowRight: { width: 60, alignItems: "flex-end" },
  invitePill: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius["2xl"],
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
  },
  invitePillText: { color: Colors.textPrimary },
  fontRegular: { fontFamily: FontFamily.poppinsRegular },
  fontMedium: { fontFamily: FontFamily.poppinsMedium },
  fontSemibold: { fontFamily: FontFamily.poppinsSemiBold },
  fontBold: { fontFamily: FontFamily.poppinsBold },
});
