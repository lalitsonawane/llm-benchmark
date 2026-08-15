import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { BENCHMARK_MODELS } from '../shared/benchmarksData';

export const CalculatorScreen: React.FC = () => {
  const [requestTier, setRequestTier] = useState<number>(100000); // 100k

  const promptTokensM = (requestTier * 1000) / 1_000_000;
  const completionTokensM = (requestTier * 300) / 1_000_000;

  const costData = BENCHMARK_MODELS.map(m => {
    const cost = (promptTokensM * m.pricing.prompt) + (completionTokensM * m.pricing.completion);
    return {
      model: m,
      totalCost: cost
    };
  }).sort((a, b) => a.totalCost - b.totalCost);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.card}>
          <Text style={styles.title}>Monthly Traffic Volume</Text>
          <Text style={styles.subTitle}>1k prompt tokens, 300 completion tokens per request</Text>

          <View style={styles.tierButtons}>
            {[50000, 100000, 500000, 1000000].map(tier => (
              <TouchableOpacity
                key={tier}
                style={[styles.tierBtn, requestTier === tier && styles.tierBtnActive]}
                onPress={() => setRequestTier(tier)}
              >
                <Text style={[styles.tierText, requestTier === tier && styles.tierTextActive]}>
                  {tier >= 1000000 ? `${tier / 1000000}M` : `${tier / 1000}k`} reqs
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionHeader}>PROJECTED MONTHLY SPEND</Text>

        <View style={styles.resultsList}>
          {costData.map(({ model, totalCost }) => (
            <View key={model.id} style={styles.resultRow}>
              <View>
                <Text style={styles.modelName}>{model.name}</Text>
                <Text style={styles.providerName}>{model.provider} • QI: {model.metrics.qualityIndex}</Text>
              </View>

              <Text style={styles.costVal}>${totalCost.toFixed(2)}/mo</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, gap: 14 },
  card: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  subTitle: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  tierButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  tierBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    alignItems: 'center',
  },
  tierBtnActive: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderColor: '#0284c7',
  },
  tierText: { fontSize: 11, fontWeight: '600', color: '#94a3b8' },
  tierTextActive: { color: '#38bdf8' },
  sectionHeader: { fontSize: 11, fontWeight: 'bold', color: '#64748b', letterSpacing: 0.8 },
  resultsList: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modelName: { fontSize: 13, fontWeight: 'bold', color: '#f8fafc' },
  providerName: { fontSize: 11, color: '#64748b', marginTop: 2 },
  costVal: { fontSize: 13, fontWeight: 'bold', color: '#34d399', fontFamily: 'monospace' },
});
