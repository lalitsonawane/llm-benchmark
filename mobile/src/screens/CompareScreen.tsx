import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { BENCHMARK_MODELS } from '../shared/benchmarksData';

export const CompareScreen: React.FC = () => {
  const [modelAIndex, setModelAIndex] = useState(0); // Claude 3.7
  const [modelBIndex, setModelBIndex] = useState(2); // DeepSeek R1

  const modelA = BENCHMARK_MODELS[modelAIndex] || BENCHMARK_MODELS[0];
  const modelB = BENCHMARK_MODELS[modelBIndex] || BENCHMARK_MODELS[1];

  const compareRows = [
    { label: 'Chatbot ELO', valA: modelA.metrics.elo, valB: modelB.metrics.elo, suffix: '' },
    { label: 'Quality Index', valA: modelA.metrics.qualityIndex, valB: modelB.metrics.qualityIndex, suffix: '' },
    { label: 'Throughput', valA: modelA.metrics.tokensPerSec, valB: modelB.metrics.tokensPerSec, suffix: ' tps' },
    { label: 'TTFT Latency', valA: modelA.metrics.ttftMs, valB: modelB.metrics.ttftMs, suffix: ' ms', lowerIsBetter: true },
    { label: 'SWE-bench', valA: modelA.metrics.sweBench || 0, valB: modelB.metrics.sweBench || 0, suffix: '%' },
    { label: 'AIME 2024 Math', valA: modelA.metrics.aime2024 || 0, valB: modelB.metrics.aime2024 || 0, suffix: '%' },
    { label: 'Prompt Price', valA: modelA.pricing.prompt, valB: modelB.pricing.prompt, suffix: ' / 1M', lowerIsBetter: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Model Selector Cards */}
        <View style={styles.selectorsRow}>
          {/* Card A */}
          <View style={styles.modelHeaderCard}>
            <Text style={styles.headerTag}>MODEL A</Text>
            <Text style={styles.headerName}>{modelA.name}</Text>
            <Text style={styles.headerProvider}>{modelA.provider}</Text>
          </View>

          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Card B */}
          <View style={styles.modelHeaderCard}>
            <Text style={[styles.headerTag, { color: '#a855f7' }]}>MODEL B</Text>
            <Text style={styles.headerName}>{modelB.name}</Text>
            <Text style={styles.headerProvider}>{modelB.provider}</Text>
          </View>
        </View>

        {/* Comparison Rows */}
        <View style={styles.compareTable}>
          {compareRows.map((row, idx) => {
            const isWinnerA = row.lowerIsBetter ? row.valA < row.valB : row.valA > row.valB;
            const isWinnerB = row.lowerIsBetter ? row.valB < row.valA : row.valB > row.valA;

            return (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.cellVal, isWinnerA && styles.winnerVal]}>
                  {row.valA}{row.suffix}
                </Text>
                
                <Text style={styles.metricLabelCell}>{row.label}</Text>

                <Text style={[styles.cellVal, isWinnerB && styles.winnerVal]}>
                  {row.valB}{row.suffix}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Quick Model Selector Pills */}
        <Text style={styles.switchTitle}>SWITCH COMPARISON CANDIDATES</Text>
        <View style={styles.pillsContainer}>
          {BENCHMARK_MODELS.map((m, idx) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.selectPill,
                modelAIndex === idx && { borderColor: '#38bdf8' },
                modelBIndex === idx && { borderColor: '#a855f7' }
              ]}
              onPress={() => {
                if (modelAIndex !== idx) setModelBIndex(idx);
                else setModelAIndex(idx);
              }}
            >
              <Text style={styles.pillText}>{m.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, gap: 16 },
  selectorsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modelHeaderCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
  },
  headerTag: { fontSize: 10, fontWeight: 'bold', color: '#38bdf8' },
  headerName: { fontSize: 13, fontWeight: 'bold', color: '#f8fafc', marginTop: 2 },
  headerProvider: { fontSize: 11, color: '#64748b', marginTop: 2 },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  vsText: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8' },
  compareTable: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  metricLabelCell: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
  cellVal: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#64748b',
    fontWeight: 'bold',
    width: 75,
    textAlign: 'center',
  },
  winnerVal: {
    color: '#38bdf8',
  },
  switchTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
  },
  pillText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
});
