import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabKey = 'equally' | 'unequally' | 'percentages' | 'shares' | 'adjustment';

interface Participant {
  id: string;
  name: string;
}

export default function AdjustSplitScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('equally');

  const participants: Participant[] = useMemo(
    () => [
      { id: 'u1', name: 'Saurav Verma' },
    ],
    []
  );

  // State per method
  const [included, setIncluded] = useState<Record<string, boolean>>({ u1: true });
  const [amounts, setAmounts] = useState<Record<string, string>>({ u1: '0.00' });
  const [percentages, setPercentages] = useState<Record<string, string>>({ u1: '0' });
  const [shares, setShares] = useState<Record<string, string>>({ u1: '0' });
  const [adjustments, setAdjustments] = useState<Record<string, string>>({ u1: '0.00' });

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'equally', label: 'Equally' },
    { key: 'unequally', label: 'Unequally' },
    { key: 'percentages', label: 'By percentages' },
    { key: 'shares', label: 'By shares' },
    { key: 'adjustment', label: 'By adjustment' },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { fontFamily: 'Montserrat_600SemiBold' }]}>Adjust split</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.doneButton}>
        <MaterialIcons name="check" size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {tabs.map((t) => {
          const selected = activeTab === t.key;
          return (
            <TouchableOpacity key={t.key} style={styles.tab} onPress={() => setActiveTab(t.key)}>
              <Text style={[styles.tabLabel, selected && styles.tabLabelActive]} numberOfLines={1}>
                {t.label}
              </Text>
              {selected && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const DescriptionBlock = ({ title, body }: { title: string; body: string }) => (
    <View style={styles.descBlock}>
      <Text style={styles.descTitle}>{title}</Text>
      <Text style={styles.descBody}>{body}</Text>
    </View>
  );

  const PersonRow = ({
    person,
    right,
  }: {
    person: Participant;
    right: React.ReactNode;
  }) => (
    <View style={styles.personRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{person.name.charAt(0)}</Text>
      </View>
      <View style={styles.personInfo}>
        <Text style={styles.personName} numberOfLines={1} ellipsizeMode="tail">{person.name}</Text>
        <Text style={styles.personSub} numberOfLines={1} ellipsizeMode="tail">$0.00</Text>
      </View>
      <View style={styles.personRight}>{right}</View>
    </View>
  );

  const renderArtRow = () => (
    <View style={styles.artRow}>
      <MaterialIcons name="shopping-bag" size={56} color="#22C55E" />
      <MaterialIcons name="smart-toy" size={56} color="#60A5FA" />
      <MaterialIcons name="favorite" size={56} color="#F43F5E" />
      <MaterialIcons name="face" size={56} color="#A78BFA" />
    </View>
  );

  const renderEqually = () => (
    <>
      <DescriptionBlock
        title="Split equally"
        body="Select which people owe an equal share."
      />
      {participants.map((p) => (
        <PersonRow
          key={p.id}
          person={p}
          right={
            <TouchableOpacity
              style={[styles.checkBox, included[p.id] && styles.checkBoxChecked]}
              onPress={() => setIncluded((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
            >
              {included[p.id] && <MaterialIcons name="check" size={18} color="#FFFFFF" />}
            </TouchableOpacity>
          }
        />
      ))}
    </>
  );

  const renderEquallyFooter = () => (
    <View style={styles.bottomBarEqually}>
      <View>
        <Text style={styles.bottomText}>$0.00/person</Text>
        <Text style={styles.bottomSubText}>(1 person)</Text>
      </View>
      <View style={styles.bottomRightRow}>
        <Text style={styles.bottomText}>All</Text>
        <View style={[styles.checkMini, styles.checkMiniChecked]}>
          <MaterialIcons name="check" size={14} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );

  const renderUnequally = () => (
    <>
      <DescriptionBlock
        title="Split by exact amounts"
        body="Specify exactly how much each person owes."
      />
      {participants.map((p) => (
        <PersonRow
          key={p.id}
          person={p}
          right={
            <View style={styles.inlineInputRow}>
              <Text style={styles.inlinePrefix}>$</Text>
              <TextInput
                style={[styles.inlineInput, styles.inlineInputUnderline, styles.inlineRight, { width: 100 }]}
                value={amounts[p.id]}
                onChangeText={(t: string) =>
                  setAmounts((prev) => ({ ...prev, [p.id]: t.replace(/[^0-9.]/g, '') }))
                }
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              />
            </View>
          }
        />
      ))}
    </>
  );

  const renderUnequallyFooter = () => (
    <View style={styles.bottomBarSingleCentered}>
      <Text style={styles.bottomTextMuted}>$0.00 of $0.00</Text>
      <Text style={styles.bottomTextMuted}>$0.00 left</Text>
    </View>
  );

  const renderPercentages = () => (
    <>
      <DescriptionBlock
        title="Split by percentages"
        body="Enter the percentage split that's fair for your situation."
      />
      {participants.map((p) => (
        <PersonRow
          key={p.id}
          person={p}
          right={
            <View style={styles.inlineInputRow}>
              <TextInput
                style={[styles.inlineInput, styles.inlineInputUnderline, styles.inlineRight, { width: 60 }]}
                value={percentages[p.id]}
                onChangeText={(t: string) =>
                  setPercentages((prev) => ({ ...prev, [p.id]: t.replace(/[^0-9.]/g, '') }))
                }
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              />
              <Text style={styles.inlineSuffix}>%</Text>
            </View>
          }
        />
      ))}
    </>
  );

  const renderPercentagesFooter = () => (
    <View style={styles.bottomBarSingleCentered}>
      <Text style={styles.bottomTextMuted}>0% of 100%</Text>
      <Text style={styles.bottomTextMuted}>100% left</Text>
    </View>
  );

  const renderShares = () => (
    <>
      <DescriptionBlock
        title="Split by shares"
        body="Great for time-based splitting and splitting across families."
      />
      {participants.map((p) => (
        <PersonRow
          key={p.id}
          person={p}
          right={
            <View style={styles.inlineInputRow}>
              <TextInput
                style={[styles.inlineInput, styles.inlineInputUnderline, styles.inlineRight, { width: 80 }]}
                value={shares[p.id]}
                onChangeText={(t: string) =>
                  setShares((prev) => ({ ...prev, [p.id]: t.replace(/[^0-9]/g, '') }))
                }
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              />
              <Text style={styles.inlineSuffix}>shares</Text>
            </View>
          }
        />
      ))}
    </>
  );

  const renderSharesFooter = () => (
    <View style={styles.bottomBarSingleCentered}>
      <Text style={styles.bottomTextMuted}>0 total shares</Text>
    </View>
  );

  const renderAdjustment = () => (
    <>
      <DescriptionBlock
        title="Split by adjustment"
        body="Enter adjustments to reflect who owes extra; the remainder is split equally."
      />
      {participants.map((p) => (
        <PersonRow
          key={p.id}
          person={p}
          right={
            <View style={styles.inlineInputRow}>
              <Text style={[styles.inlinePrefix, { color: '#16A34A' }]}>+</Text>
              <TextInput
                style={[styles.inlineInput, styles.inlineInputUnderline, styles.inlineRight, { width: 80 }]}
                value={adjustments[p.id]}
                onChangeText={(t: string) =>
                  setAdjustments((prev) => ({ ...prev, [p.id]: t.replace(/[^0-9.]/g, '') }))
                }
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              />
            </View>
          }
        />
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderTabs()}
      {renderArtRow()}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'equally' && renderEqually()}
        {activeTab === 'unequally' && renderUnequally()}
        {activeTab === 'percentages' && renderPercentages()}
        {activeTab === 'shares' && renderShares()}
        {activeTab === 'adjustment' && renderAdjustment()}
      </ScrollView>
      {activeTab === 'equally' && renderEquallyFooter()}
      {activeTab === 'unequally' && renderUnequallyFooter()}
      {activeTab === 'percentages' && renderPercentagesFooter()}
      {activeTab === 'shares' && renderSharesFooter()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#111827',
    letterSpacing: 0,
    flex: 1,
    textAlign: 'center',
  },
  backButton: { 
    width: 48, 
    height: 48, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: -4,
  },
  doneButton: { 
    width: 48, 
    height: 48, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: -4,
  },

  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  tab: {
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    height: 28,
  },
  tabLabel: { 
    fontSize: 14, 
    color: '#6B7280', 
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0,
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabLabelActive: { 
    color: '#111827', 
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '15%',
    right: '15%',
    height: 2,
    backgroundColor: '#000000',
    borderRadius: 1,
  },

  content: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 100, gap: 0, marginTop: 0 },
  descBlock: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#FFFFFF', marginTop: 0, marginBottom: 8 },
  descTitle: { fontSize: 22, color: '#111827', marginBottom: 6, textAlign: 'center', fontFamily: 'Montserrat_700Bold' },
  descBody: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 20, fontFamily: 'Montserrat_400Regular' },
  artRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 0,
  },

  personRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarInitial: { color: '#FFFFFF', fontWeight: '700', fontSize: 20 },
  personInfo: { flex: 1, flexDirection: 'column', justifyContent: 'center', marginRight: 12 },
  personName: { fontSize: 18, color: '#111827', flexWrap: 'nowrap', fontFamily: 'Poppins_600SemiBold' },
  personSub: { fontSize: 14, color: '#9CA3AF', marginTop: 2, flexWrap: 'nowrap', fontFamily: 'Montserrat_400Regular' },
  personRight: { alignItems: 'flex-end', justifyContent: 'center' },
  underline: { height: 2, backgroundColor: '#CBD5E1', width: '100%', marginTop: 6, borderRadius: 2 },

  checkBox: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: '#10B981', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF' 
  },
  checkBoxChecked: { backgroundColor: '#10B981', borderColor: '#10B981' },

  inlineInputRow: { flexDirection: 'row', alignItems: 'baseline' },
  inlinePrefix: { fontSize: 18, color: '#111827', marginRight: 8 },
  inlineSuffix: { fontSize: 16, color: '#6B7280', marginLeft: 8, fontFamily: 'Montserrat_400Regular' },
  inlineInput: { 
    fontSize: 20, 
    color: '#111827', 
    fontWeight: '400',
    paddingVertical: 0,
    paddingBottom: 4,
  },
  inlineInputUnderline: {
    borderBottomWidth: 2,
    borderBottomColor: '#CBD5E1',
  },
  inlineRight: {
    textAlign: 'right',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  bottomBarEqually: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  bottomBarSingle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyConteGnt: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  bottomBarSingleCentered: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bottomText: { fontSize: 17, color: '#111827', fontWeight: '600' },
  bottomSubText: { fontSize: 14, color: '#6B7280', marginTop: 2, fontFamily: 'Montserrat_400Regular' },
  bottomTextMuted: { fontSize: 15, color: '#6B7280', fontFamily: 'Montserrat_400Regular' },
  bottomDivider: { width: 1, height: 18, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
  bottomRightRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkMini: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    backgroundColor: '#E5E7EB', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  checkMiniChecked: { backgroundColor: '#10B981' },
});


