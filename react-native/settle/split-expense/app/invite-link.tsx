import TabLayoutWrapper from '@/components/TabLayoutWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InviteLinkScreen() {
  const router = useRouter();

  const inviteLink = "https://www.splitwise.com/join/P8Q4sFjdi5x+1v28fw?v=s";

  const handleCopyLink = () => {
    // Implement copy to clipboard logic here
    console.log("Copy link clicked");
  };

  const handleShareLink = () => {
    // Implement share sheet logic here
    console.log("Share link clicked");
  };

  const handleChangeLink = () => {
    // Implement change link logic here
    console.log("Change link clicked");
  };

  return (
    <TabLayoutWrapper>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invite link</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.instructionText}>
            Anyone can follow this link to join <Text style={styles.groupNameText}>"Jje"</Text>.
          </Text>
          <Text style={styles.instructionText}>
            Only share it with people you trust.
          </Text>

          <View style={styles.linkContainer}>
            <View style={styles.linkIconCircle}>
              <MaterialIcons name="insert-link" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.linkText}>{inviteLink}</Text>
          </View>

          <TouchableOpacity style={styles.optionRow} onPress={handleCopyLink}>
            <MaterialIcons name="content-copy" size={24} color="#6B7280" />
            <Text style={styles.optionText}>Copy link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={handleShareLink}>
            <MaterialIcons name="share" size={24} color="#6B7280" />
            <Text style={styles.optionText}>Share link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={handleChangeLink}>
            <MaterialIcons name="remove-circle-outline" size={24} color="#6B7280" />
            <Text style={styles.optionText}>Change link</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TabLayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 24 + 8, // Icon size + padding
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#374151',
    marginBottom: 4,
  },
  groupNameText: {
    fontFamily: 'Poppins_600SemiBold',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981', // Teal-green color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#4B5563',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#374151',
    marginLeft: 16,
    flex: 1,
  },
});
