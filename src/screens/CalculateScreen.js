import React from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SECTIONS, MOC_LIST } from '../data/steelData';

export default function CalculateScreen({ state, setState }) {
  const { theme } = useTheme();
  const C = theme.colors;
  const styles = makeStyles(C);

  const sections = state.memberType ? SECTIONS[state.memberType] : [];
  const selected = state.sectionIndex !== null ? sections[state.sectionIndex] : null;
  const isPlate = state.memberType === 'plate';
  const moc = MOC_LIST[state.mocIndex];

  const update = (key, val) => setState(prev => ({ ...prev, [key]: val }));

  if (!selected) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyIcon}>📐</Text>
        <Text style={styles.emptyTitle}>No Section Selected</Text>
        <Text style={styles.emptyText}>Go to Step 1 and select a structural member section to continue.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Selected section banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerLabel}>Selected Section</Text>
            <Text style={styles.bannerDesig}>{selected.d}</Text>
          </View>
          {!isPlate && (
            <View style={styles.bannerRight}>
              <Text style={styles.bannerMassVal}>{selected.m}</Text>
              <Text style={styles.bannerMassUnit}>kg/m</Text>
            </View>
          )}
        </View>

        {/* MOC Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MATERIAL OF CONSTRUCTION (MOC)</Text>
          <View style={styles.mocGrid}>
            {MOC_LIST.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.mocBtn, state.mocIndex === i && styles.mocBtnActive]}
                onPress={() => update('mocIndex', i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.mocBtnLabel, state.mocIndex === i && styles.mocBtnLabelActive]}>
                  {m.shortName}
                </Text>
                <Text style={[styles.mocBtnDensity, state.mocIndex === i && styles.mocBtnDensityActive]}>
                  {m.density} kg/m³
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.densityRow}>
            <View style={styles.densityInfo}>
              <Text style={styles.densityLabel}>Density (ρ)</Text>
              <Text style={styles.densityVal}>{moc.density} <Text style={styles.densityUnit}>kg/m³</Text></Text>
            </View>
            <View style={styles.densityDivider} />
            <View style={styles.densityInfo}>
              <Text style={styles.densityLabel}>Standard</Text>
              <Text style={styles.densityVal2}>{moc.standard}</Text>
            </View>
          </View>
          <View style={styles.mocDesc}>
            <Text style={styles.mocDescText}>📋  {moc.name}  —  {moc.desc}</Text>
          </View>
        </View>

        {/* Plate dimensions */}
        {isPlate && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PLATE DIMENSIONS  (IS 1730)</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Width  (mm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={String(state.plateWidth)}
                  onChangeText={v => update('plateWidth', v)}
                  placeholderTextColor={C.textTertiary}
                  placeholder="e.g. 200"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Thickness  (mm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={String(state.plateThick)}
                  onChangeText={v => update('plateThick', v)}
                  placeholderTextColor={C.textTertiary}
                  placeholder="e.g. 10"
                />
              </View>
            </View>
            {(() => {
              const w = parseFloat(state.plateWidth) || 0;
              const t = parseFloat(state.plateThick) || 0;
              const mpm = (w / 1000) * (t / 1000) * moc.density;
              return (
                <View style={styles.plateResult}>
                  <Text style={styles.plateResultLabel}>Calculated unit mass:</Text>
                  <Text style={styles.plateResultVal}>{mpm.toFixed(3)} kg/m</Text>
                </View>
              );
            })()}
          </View>
        )}

        {/* Length & Count */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>QUANTITY & LENGTH</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Length per Member</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  keyboardType="decimal-pad"
                  value={String(state.length)}
                  onChangeText={v => update('length', v)}
                  placeholderTextColor={C.textTertiary}
                  placeholder="e.g. 6.0"
                />
                <Text style={styles.inputSuffix}>m</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>No. of Members</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  keyboardType="number-pad"
                  value={String(state.count)}
                  onChangeText={v => update('count', v)}
                  placeholderTextColor={C.textTertiary}
                  placeholder="e.g. 5"
                />
                <Text style={styles.inputSuffix}>nos</Text>
              </View>
            </View>
          </View>

          {/* Quick count buttons */}
          <Text style={[styles.inputLabel, { marginBottom: 8 }]}>Quick Count</Text>
          <View style={styles.quickRow}>
            {[1, 2, 4, 5, 10, 20, 50, 100].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.quickBtn, parseInt(state.count) === n && styles.quickBtnActive]}
                onPress={() => update('count', String(n))}
              >
                <Text style={[styles.quickBtnText, parseInt(state.count) === n && styles.quickBtnTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Total length preview */}
          <View style={styles.totalLenRow}>
            <Text style={styles.totalLenLabel}>Total Length</Text>
            <Text style={styles.totalLenVal}>
              {((parseFloat(state.length) || 0) * (parseInt(state.count) || 0)).toFixed(3)}  m
            </Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  emptyWrap: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },

  banner: {
    margin: 16, marginBottom: 0, backgroundColor: C.accent, borderRadius: 14,
    padding: 16, flexDirection: 'row', alignItems: 'center',
  },
  bannerLeft: { flex: 1 },
  bannerLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 0.8, marginBottom: 4 },
  bannerDesig: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  bannerRight: { alignItems: 'flex-end' },
  bannerMassVal: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  bannerMassUnit: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },

  card: {
    margin: 16, marginBottom: 0, backgroundColor: C.surface, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: C.border,
    shadowColor: C.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 10, fontWeight: '700', color: C.textTertiary, letterSpacing: 1, marginBottom: 14 },

  mocGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  mocBtn: {
    paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface2,
    minWidth: '22%',
  },
  mocBtnActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  mocBtnLabel: { fontSize: 11, fontWeight: '600', color: C.textSecondary, marginBottom: 2 },
  mocBtnLabelActive: { color: C.accent },
  mocBtnDensity: { fontSize: 9, color: C.textTertiary },
  mocBtnDensityActive: { color: C.accentText },

  densityRow: {
    flexDirection: 'row', backgroundColor: C.surface2, borderRadius: 10,
    padding: 12, marginBottom: 10,
  },
  densityInfo: { flex: 1 },
  densityLabel: { fontSize: 10, color: C.textTertiary, marginBottom: 3, fontWeight: '500' },
  densityVal: { fontSize: 18, fontWeight: '700', color: C.text },
  densityUnit: { fontSize: 12, fontWeight: '400', color: C.textSecondary },
  densityVal2: { fontSize: 13, fontWeight: '600', color: C.text },
  densityDivider: { width: 1, backgroundColor: C.border, marginHorizontal: 14 },
  mocDesc: {
    backgroundColor: C.successLight, borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: C.success + '40',
  },
  mocDescText: { fontSize: 12, color: C.successText },

  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: C.textSecondary, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, overflow: 'hidden' },
  input: {
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, fontWeight: '600', color: C.text,
  },
  inputSuffix: { paddingHorizontal: 10, fontSize: 12, fontWeight: '600', color: C.textTertiary },

  plateResult: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.accentLight, borderRadius: 10, padding: 12, marginTop: 4,
  },
  plateResultLabel: { fontSize: 12, color: C.accentText, fontWeight: '500' },
  plateResultVal: { fontSize: 16, fontWeight: '700', color: C.accent },

  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  quickBtn: {
    width: 44, height: 36, borderRadius: 8, borderWidth: 1,
    borderColor: C.border, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center',
  },
  quickBtnActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  quickBtnTextActive: { color: C.accent },

  totalLenRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.surface2, borderRadius: 10, padding: 12,
  },
  totalLenLabel: { fontSize: 12, color: C.textSecondary, fontWeight: '500' },
  totalLenVal: { fontSize: 16, fontWeight: '700', color: C.text },
});
