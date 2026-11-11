import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RADIUS, TYPE } from '../theme/tokens';
import { MEMBER_TYPES, SECTIONS } from '../data/steelData';
import DropdownPicker from '../components/DropdownPicker';

const TYPE_ITEMS = MEMBER_TYPES.map(t => ({ label: t.label, value: t.key }));

export default function SectionScreen({ state, setState }) {
  const { theme } = useTheme();
  const C = theme.colors;
  const styles = makeStyles(C);

  const sections = state.memberType ? SECTIONS[state.memberType] : [];
  const sectionItems = sections.map((s, i) => ({
    label: s.isPlate ? 'Flat Plate (Custom Dims)' : `${s.d}  —  ${s.m} kg/m`,
    value: i,
  }));

  const selected = state.sectionIndex !== null && sections[state.sectionIndex];

  const onTypeChange = (val) => {
    setState(prev => ({ ...prev, memberType: val, sectionIndex: null }));
  };

  const onSectionChange = (idx) => {
    setState(prev => ({ ...prev, sectionIndex: idx }));
  };

  const isAngle = state.memberType === 'isea' || state.memberType === 'isua';
  const isPlate = state.memberType === 'plate';

  const renderProps = () => {
    if (!selected || selected.isPlate) return null;
    const props = [];
    if (selected.D !== undefined) props.push({ k: 'Depth  D', v: `${selected.D} mm` });
    if (selected.B !== undefined && selected.A === undefined) props.push({ k: 'Flange  B', v: `${selected.B} mm` });
    if (selected.A !== undefined) props.push({ k: 'Long Leg  A', v: `${selected.A} mm` });
    if (selected.B !== undefined && selected.A !== undefined) props.push({ k: 'Short Leg  B', v: `${selected.B} mm` });
    if (selected.t !== undefined) props.push({ k: isAngle ? 'Thickness  t' : 'Web  t', v: `${selected.t} mm` });
    if (selected.T !== undefined) props.push({ k: 'Flange  T', v: `${selected.T} mm` });

    return (
      <View style={styles.propsCard}>
        <Text style={styles.sectionLabel}>SECTION PROPERTIES  —  IS 808 : 1989</Text>
        <View style={styles.propsGrid}>
          {props.map((p, i) => (
            <View key={i} style={styles.propItem}>
              <Text style={styles.propKey}>{p.k}</Text>
              <Text style={styles.propVal}>{p.v}</Text>
            </View>
          ))}
          <View style={styles.propItem}>
            <Text style={styles.propKey}>Unit Mass  M</Text>
            <Text style={[styles.propVal, { color: C.accent }]}>{selected.m} kg/m</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>STEP 1  —  Select Member Type</Text>
        <DropdownPicker
          label="Member Type (IS 808)"
          placeholder="Select structural member..."
          items={TYPE_ITEMS}
          value={state.memberType}
          onSelect={onTypeChange}
        />

        <DropdownPicker
          label="Section Designation"
          placeholder={state.memberType ? 'Select section size...' : 'Select member type first'}
          items={sectionItems}
          value={state.sectionIndex}
          onSelect={onSectionChange}
          disabled={!state.memberType}
        />

        {selected && !isPlate && (
          <View style={styles.massRow}>
            <View style={styles.massIcon}>
              <Text style={{ fontSize: 18 }}>⚖️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.massLabel}>Unit Mass per Metre (IS 808)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.massValue}>{selected.m}</Text>
                <Text style={styles.massUnit}>  kg/m</Text>
              </View>
            </View>
          </View>
        )}

        {isPlate && selected && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Flat plate weight is calculated using actual width, thickness and material density in Step 2.
            </Text>
          </View>
        )}
      </View>

      {renderProps()}

      {!state.memberType && (
        <View style={styles.hintCard}>
          <Text style={styles.hintIcon}>🏗️</Text>
          <Text style={styles.hintTitle}>For Educational Purposes Only</Text>
        {/*   <Text style={styles.hintText}>
            Indian Standard for Hot Rolled Steel Beam, Column, Channel and Angle Sections
          </Text> */}
          <Text style={styles.hintSub}>SteelMate is provided for educational, learning, and reference purposes only. While every effort has been made to ensure the accuracy of the calculations, the results should not be used as the sole basis for engineering design, fabrication, construction, or safety-critical decisions.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  card: {
    margin: 16, backgroundColor: C.surface, borderRadius: RADIUS.md,
    padding: 16, borderWidth: 1, borderColor: C.border,
    shadowColor: C.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  cardTitle: { fontSize: 11, fontWeight: TYPE.bold, color: C.textTertiary, letterSpacing: 1, marginBottom: 16 },
  massRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.accentLight, borderRadius: RADIUS.md, padding: 14,
    borderWidth: 1, borderColor: C.accent + '40',
  },
  massIcon: { width: 40, height: 40, borderRadius: RADIUS.pill, backgroundColor: C.accent + '20', alignItems: 'center', justifyContent: 'center' },
  massLabel: { fontSize: 11, color: C.accentText, marginBottom: 2, fontWeight: TYPE.medium },
  massValue: { fontSize: 26, fontWeight: TYPE.bold, color: C.accent },
  massUnit: { fontSize: 13, color: C.accentText },
  propsCard: {
    marginHorizontal: 16, marginBottom: 0, backgroundColor: C.surface,
    borderRadius: RADIUS.md, padding: 16, borderWidth: 1, borderColor: C.border,
    shadowColor: C.cardShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  sectionLabel: { fontSize: 10, fontWeight: TYPE.bold, color: C.textTertiary, letterSpacing: 0.8, marginBottom: 12 },
  propsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  propItem: {
    backgroundColor: C.surface2, borderRadius: RADIUS.md, padding: 10,
    minWidth: '47%', flex: 1,
  },
  propKey: { fontSize: 10, color: C.textTertiary, marginBottom: 3, fontWeight: TYPE.medium },
  propVal: { fontSize: 14, fontWeight: TYPE.semibold, color: C.text },
  infoBox: {
    backgroundColor: C.warningLight, borderRadius: RADIUS.sm, padding: 12,
    borderWidth: 1, borderColor: C.warning + '40', marginTop: 4,
  },
  infoText: { fontSize: 12, color: C.warningText, lineHeight: 18 },
  hintCard: {
    margin: 16, backgroundColor: C.surface, borderRadius: RADIUS.md,
    padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border,
  },
  hintIcon: { fontSize: 40, marginBottom: 12 },
  hintTitle: { fontSize: 18, fontWeight: TYPE.bold, color: C.accent, marginBottom: 6 },
  hintText: { fontSize: 13, color: C.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  hintSub: { fontSize: 12, color: C.textTertiary, textAlign: 'center' },
});
