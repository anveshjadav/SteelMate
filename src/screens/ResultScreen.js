import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert, Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SECTIONS, MOC_LIST } from '../data/steelData';

export default function ResultScreen({ state, onReset }) {
  const { theme } = useTheme();
  const C = theme.colors;
  const styles = makeStyles(C);

  const sections = state.memberType ? SECTIONS[state.memberType] : [];
  const selected = state.sectionIndex !== null ? sections[state.sectionIndex] : null;
  const isPlate = state.memberType === 'plate';
  const moc = MOC_LIST[state.mocIndex];

  if (!selected) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyIcon}>🏋️</Text>
        <Text style={styles.emptyTitle}>No Results Yet</Text>
        <Text style={styles.emptyText}>
          Complete Steps 1 and 2 — select a section, set length and count — to see the total weight here.
        </Text>
      </View>
    );
  }

  const L = parseFloat(state.length) || 0;
  const N = parseInt(state.count) || 0;

  let massPerM = 0;
  if (isPlate) {
    const W = parseFloat(state.plateWidth) || 0;
    const T = parseFloat(state.plateThick) || 0;
    massPerM = (W / 1000) * (T / 1000) * moc.density;
  } else {
    massPerM = selected.m;
  }

  const totalKg = massPerM * L * N;
  const totalTonne = totalKg / 1000;
  const totalGram = totalKg * 1000;

  const hasResult = totalKg > 0;

  const shareResult = async () => {
    const msg = [
      '📊 Steel Weight Calculation  —  IS 808 : 1989',
      '─────────────────────────────',
      `Designation    : ${selected.d}`,
      `Standard       : IS 808 : 1989`,
      `MOC            : ${moc.name}`,
      `Standard (MOC) : ${moc.standard}`,
      `Density (ρ)    : ${moc.density} kg/m³`,
      `Unit Mass (M)  : ${massPerM.toFixed(3)} kg/m`,
      '─────────────────────────────',
      `Length per Member : ${L.toFixed(3)} m`,
      `No. of Members    : ${N} nos`,
      `Total Length      : ${(L * N).toFixed(3)} m`,
      '─────────────────────────────',
      `TOTAL WEIGHT  : ${totalKg.toFixed(3)} kg`,
      `              : ${totalTonne.toFixed(6)} t`,
      `              : ${totalGram.toFixed(0)} g`,
      '─────────────────────────────',
      'SteelCalc IS 808 App',
    ].join('\n');
    await Share.share({ message: msg, title: 'Steel Weight Calculation' });
  };

  const SummaryRow = ({ label, value, accent }) => (
    <View style={styles.sumRow}>
      <Text style={styles.sumKey}>{label}</Text>
      <Text style={[styles.sumVal, accent && { color: C.accent, fontWeight: '700' }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

      {!hasResult && (
        <View style={styles.warnBox}>
          <Text style={styles.warnText}>⚠️  Enter length and count in Step 2 to calculate total weight.</Text>
        </View>
      )}

      {/* Total weight hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>TOTAL WEIGHT</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroVal}>{totalKg.toFixed(3)}</Text>
          <Text style={styles.heroUnit}>kg</Text>
        </View>
        <View style={styles.heroSubRow}>
          <View style={styles.heroSubItem}>
            <Text style={styles.heroSubVal}>{totalTonne.toFixed(6)}</Text>
            <Text style={styles.heroSubUnit}>tonnes</Text>
          </View>
          <View style={styles.heroSubDivider} />
          <View style={styles.heroSubItem}>
            <Text style={styles.heroSubVal}>{totalGram.toFixed(0)}</Text>
            <Text style={styles.heroSubUnit}>grams</Text>
          </View>
        </View>
      </View>

      {/* Stat grid */}
      <View style={styles.statGrid}>
        {[
          { label: 'Unit Mass', val: `${massPerM.toFixed(3)}`, unit: 'kg/m' },
          { label: 'Length / Member', val: L.toFixed(3), unit: 'm' },
          { label: 'No. of Members', val: N.toString(), unit: 'nos' },
          { label: 'Total Length', val: (L * N).toFixed(3), unit: 'm' },
        ].map((s, i) => (
          <View key={i} style={styles.statBox}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statUnit}>  {s.unit}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Calculation summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>CALCULATION SUMMARY</Text>
        <SummaryRow label="Designation" value={selected.d} />
        <SummaryRow label="Standard" value="IS 808 : 1989" />
        <SummaryRow label="MOC" value={moc.name} />
        <SummaryRow label="Standard (MOC)" value={moc.standard} />
        <SummaryRow label="Density (ρ)" value={`${moc.density} kg/m³`} />
        <SummaryRow label="Unit Mass (M)" value={`${massPerM.toFixed(3)} kg/m`} />
        <View style={styles.divider} />
        <SummaryRow label="Length per Member" value={`${L.toFixed(3)} m`} />
        <SummaryRow label="No. of Members (N)" value={`${N} nos`} />
        <SummaryRow label="Total Length (L×N)" value={`${(L * N).toFixed(3)} m`} />
        <View style={styles.formulaBox}>
          <Text style={styles.formulaLabel}>Formula (IS 808)</Text>
          <Text style={styles.formulaText}>W  =  M × L × N</Text>
          <Text style={styles.formulaText}>W  =  {massPerM.toFixed(3)} × {L.toFixed(3)} × {N}</Text>
          <Text style={styles.formulaResult}>W  =  {totalKg.toFixed(3)} kg</Text>
        </View>
        <View style={styles.divider} />
        <SummaryRow label="Total Weight" value={`${totalKg.toFixed(3)} kg`} accent />
        <SummaryRow label="Total Weight" value={`${totalTonne.toFixed(6)} t`} accent />
        <SummaryRow label="Total Weight" value={`${totalGram.toFixed(0)} g`} />
      </View>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.shareBtn} onPress={shareResult} activeOpacity={0.8}>
          <Text style={styles.shareBtnText}>📤  Share / Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={() => {
          Alert.alert('Reset Calculator', 'This will clear all inputs. Continue?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: onReset },
          ]);
        }} activeOpacity={0.8}>
          <Text style={styles.resetBtnText}>🔄  Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Always use OEM data for accurate calculations</Text>
    </ScrollView>
  );
}

const makeStyles = (C) => StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  emptyWrap: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  warnBox: {
    margin: 16, marginBottom: 0, backgroundColor: C.warningLight, borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: C.warning + '50',
  },
  warnText: { fontSize: 13, color: C.warningText, lineHeight: 18 },

  heroCard: {
    margin: 16, backgroundColor: C.accent, borderRadius: 20, padding: 20,
  },
  heroLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 6 },
  heroRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  heroVal: { fontSize: 48, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  heroUnit: { fontSize: 18, fontWeight: '400', color: 'rgba(255,255,255,0.85)', marginLeft: 8 },
  heroSubRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 },
  heroSubItem: { flex: 1, alignItems: 'center' },
  heroSubDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroSubVal: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  heroSubUnit: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 16, marginBottom: 0 },
  statBox: {
    flex: 1, minWidth: '45%', backgroundColor: C.surface, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: C.border,
  },
  statLabel: { fontSize: 10, color: C.textTertiary, fontWeight: '600', letterSpacing: 0.4, marginBottom: 5 },
  statVal: { fontSize: 18, fontWeight: '700', color: C.text },
  statUnit: { fontSize: 11, color: C.textSecondary },

  card: {
    margin: 16, marginBottom: 0, backgroundColor: C.surface, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: C.border,
    shadowColor: C.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  cardTitle: { fontSize: 10, fontWeight: '700', color: C.textTertiary, letterSpacing: 1, marginBottom: 14 },
  sumRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  sumKey: { fontSize: 12, color: C.textSecondary, flex: 1 },
  sumVal: { fontSize: 13, fontWeight: '600', color: C.text, textAlign: 'right', flex: 1 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 8 },
  formulaBox: {
    backgroundColor: C.accentLight, borderRadius: 10, padding: 12, marginVertical: 10,
    borderWidth: 1, borderColor: C.accent + '40',
  },
  formulaLabel: { fontSize: 10, color: C.accentText, fontWeight: '600', letterSpacing: 0.5, marginBottom: 6 },
  formulaText: { fontSize: 13, color: C.accentText, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 2 },
  formulaResult: { fontSize: 15, color: C.accent, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: '700', marginTop: 4 },

  actionsRow: { flexDirection: 'row', gap: 10, margin: 16, marginBottom: 0 },
  shareBtn: {
    flex: 1, backgroundColor: C.accent, borderRadius: 14, padding: 14, alignItems: 'center',
  },
  shareBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  resetBtn: {
    flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: C.danger,
  },
  resetBtnText: { color: C.dangerText, fontSize: 14, fontWeight: '700' },

  footer: { fontSize: 11, color: C.textTertiary, textAlign: 'center', margin: 16, marginBottom: 0 },
});
