import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { BENCHMARK_MODELS } from '../shared/benchmarksData';

export const ParetoScreen: React.FC = () => {
  const topTier = BENCHMARK_MODELS.filter(m => m.metrics.qualityIndex >= 88);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Info Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Pareto Efficient Models</Text>
          <Text style={styles.bannerSub}>
            Models providing the highest benchmark score per dollar and zero dominate alternatives.
          </Text>
        </View>

        {/* Pareto Cards */}
        {topTier.map((model, idx) => (
          <View key={model.id} style={styles.paretoCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.modelName}>{model.name}</Text>
                <Text style={styles.providerName}>{model.provider}</Text>
              </View>
              <View style={styles.optimalBadge}>
                <Text style={styles.optimalText}>★ Pareto Optimal</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Quality Index</Text>
                <Text style={styles.statVal}>{model.metrics.qualityIndex}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Throughput</Text>
                <Text style={[styles.statVal, { color: '#38bdf8' }]}>{model.metrics.tokensPerSec} tps</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Prompt / 1M</Text>
                <Text style={[styles.statVal, { color: '#34d399' }]}>${model.pricing.prompt}</Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, gap: 12 },
  banner: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
  },
  bannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  bannerSub: { fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 16 },
  paretoCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modelName: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  providerName: { fontSize: 11, color: '#64748b', marginTop: 2 },
  optimalBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  optimalText: { fontSize: 10, fontWeight: 'bold', color: '#34d399' },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  statBox: { alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },
  statVal: { fontSize: 13, fontWeight: 'bold', color: '#f8fafc', fontFamily: 'monospace', marginTop: 2 },
});
