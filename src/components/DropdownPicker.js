import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, TextInput, StatusBar, Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function DropdownPicker({ label, placeholder, items, value, onSelect, disabled }) {
  const { theme } = useTheme();
  const C = theme.colors;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = items.find(i => i.value === value);
  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  const styles = makeStyles(C);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.75}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.arrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label || 'Select'}</Text>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          {items.length > 6 && (
            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={C.textTertiary}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
            </View>
          )}
          <FlatList
            data={filtered}
            keyExtractor={i => String(i.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, item.value === value && styles.itemActive]}
                onPress={() => { onSelect(item.value); setOpen(false); setSearch(''); }}
              >
                <Text style={[styles.itemText, item.value === value && styles.itemTextActive]}>
                  {item.label}
                </Text>
                {item.value === value && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (C) => StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6, letterSpacing: 0.3 },
  trigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
  },
  triggerDisabled: { opacity: 0.45 },
  triggerText: { flex: 1, fontSize: 14, color: C.text, fontWeight: '500' },
  placeholder: { color: C.textTertiary, fontWeight: '400' },
  arrow: { fontSize: 10, color: C.textTertiary, marginLeft: 8 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '75%', paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1, borderColor: C.border,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: '600', color: C.text },
  closeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 12, color: C.textSecondary },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  searchInput: {
    backgroundColor: C.surface2, borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 9, fontSize: 14, color: C.text, borderWidth: 1, borderColor: C.border,
  },
  item: { paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' },
  itemActive: { backgroundColor: C.accentLight },
  itemText: { flex: 1, fontSize: 14, color: C.text },
  itemTextActive: { color: C.accent, fontWeight: '600' },
  checkmark: { fontSize: 14, color: C.accent, marginLeft: 8 },
  sep: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },
});
