import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
  StatusBar, Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { RADIUS, TYPE } from './src/theme/tokens';
import SectionScreen from './src/screens/SectionScreen';
import CalculateScreen from './src/screens/CalculateScreen';
import ResultScreen from './src/screens/ResultScreen';

const INITIAL_STATE = {
  memberType: null,
  sectionIndex: null,
  mocIndex: 0,
  length: '6',
  count: '1',
  plateWidth: '200',
  plateThick: '10',
};

const TABS = [
  { id: 0, label: 'Section', icon: '📐' },
  { id: 1, label: 'Inputs', icon: '📏' },
  { id: 2, label: 'Result', icon: '⚖️' },
];

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const C = theme.colors;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [state, setState] = useState(INITIAL_STATE);

  const styles = makeStyles(C);

  const handleReset = () => {
    setState(INITIAL_STATE);
    setActiveTab(0);
  };

  return (
      <SafeAreaView
        edges={['top']}
        style={[styles.safe, { backgroundColor: C.headerBg }]}
      >
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={C.headerBg}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            {/* <Text style={styles.logoIcon}>🔩</Text> */}
            <Image source={require('./assets/icon2.png')} style={{ width: 40, height:40 }} /> 
          </View>
          <View>
            <Text style={styles.appTitle}>SteelCalc</Text>
            <Text style={styles.appSub}>Structural Weight Calculator</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme} activeOpacity={0.75}>
          <Text style={styles.themeBtnText}>{theme.dark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.stepRow}>
        {TABS.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <View style={[styles.stepDot, activeTab === tab.id && styles.stepDotActive, activeTab > tab.id && styles.stepDotDone]}>
              <Text style={[styles.stepNum, (activeTab === tab.id || activeTab > tab.id) && styles.stepNumActive]}>
                {activeTab > tab.id ? '✓' : tab.id + 1}
              </Text>
            </View>
            {i < TABS.length - 1 && (
              <View style={[styles.stepLine, activeTab > tab.id && styles.stepLineDone]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={[styles.content, { backgroundColor: C.bg }]}>
        {activeTab === 0 && <SectionScreen state={state} setState={setState} />}
        {activeTab === 1 && <CalculateScreen state={state} setState={setState} />}
        {activeTab === 2 && <ResultScreen state={state} onReset={handleReset} />}
      </View>

      <View style={[styles.bottomNav, { backgroundColor: C.surface, borderTopColor: C.border, paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={[styles.navBtn, activeTab === 0 && styles.navBtnDisabled]}
          onPress={() => setActiveTab(t => Math.max(0, t - 1))}
          disabled={activeTab === 0}
          activeOpacity={0.75}
        >
          <Text style={[styles.navBtnText, { color: activeTab === 0 ? C.textTertiary : C.textSecondary }]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <View style={styles.navCenter}>
          <Text style={styles.navPageText}>{activeTab + 1} / {TABS.length}</Text>
        </View>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnNext, activeTab === TABS.length - 1 && styles.navBtnDisabled]}
          onPress={() => setActiveTab(t => Math.min(TABS.length - 1, t + 1))}
          disabled={activeTab === TABS.length - 1}
          activeOpacity={0.75}
        >
          <Text style={[styles.navBtnText, { color: activeTab === TABS.length - 1 ? C.textTertiary : '#FFFFFF' }]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const makeStyles = (C) => StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.headerBg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 40, height: 40, borderRadius: RADIUS.pill, backgroundColor: C.accentLight,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.accent + '33',
  },
  logoIcon: { fontSize: 20 },
  appTitle: { fontSize: 17, fontWeight: TYPE.bold, color: C.text, letterSpacing: -0.3 },
  appSub: { fontSize: 11, color: C.textTertiary, fontWeight: TYPE.medium },
  themeBtn: {
    width: 38, height: 38, borderRadius: RADIUS.md, backgroundColor: C.surface2,
    borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
  },
  themeBtnText: { fontSize: 18 },
  tabBar: {
    flexDirection: 'row', backgroundColor: C.headerBg,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tab: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, position: 'relative',
  },
  tabActive: {},
  tabIcon: { fontSize: 16, marginBottom: 2 },
  tabLabel: { fontSize: 11, fontWeight: TYPE.medium, color: C.tabInactive },
  tabLabelActive: { color: C.tabActive, fontWeight: TYPE.bold },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: '15%', right: '15%',
    height: 3, backgroundColor: C.tabActive, borderRadius: 2,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40,
    paddingVertical: 10, backgroundColor: C.headerBg,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  stepDot: {
    width: 24, height: 24, borderRadius: RADIUS.pill, borderWidth: 2,
    borderColor: C.border, backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { borderColor: C.accent, backgroundColor: C.accentLight },
  stepDotDone: { borderColor: C.success, backgroundColor: C.successLight },
  stepNum: { fontSize: 11, fontWeight: TYPE.bold, color: C.textTertiary },
  stepNumActive: { color: C.accent },
  stepLine: { flex: 1, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
  stepLineDone: { backgroundColor: C.success },
  content: { flex: 1 },
  bottomNav: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 10, borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 4 : 10,
  },
  navBtn: {
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: RADIUS.md,
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, minWidth: 90, alignItems: 'center',
  },
  navBtnNext: { backgroundColor: C.accent, borderColor: C.accent },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 14, fontWeight: TYPE.bold },
  navCenter: { flex: 1, alignItems: 'center' },
  navPageText: { fontSize: 12, color: C.textTertiary, fontWeight: TYPE.semibold },
});
