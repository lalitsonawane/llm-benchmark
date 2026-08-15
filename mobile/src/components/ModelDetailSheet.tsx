import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking 
} from 'lucide-react-native' ? require('react-native') : require('react-native');
import { BenchmarkModel } from '../shared/types';

interface ModelDetailSheetProps {
  visible: boolean;
  model: BenchmarkModel | null;
  onClose: () => void;
}

export const ModelDetailSheet: React.FC<ModelDetailSheetProps> = ({
  visible,
  model,
  onClose
}) => {
  if (!model) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          
          {/* Header Drag Handle */}
          <View style={styles.handleBar} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.providerBadge}>{model.provider}</Text>
                {model.isReasoningModel && (
                  <Text style={styles.reasoningBadge}>Reasoning</Text>
                )}
                {model.isOpenWeights && (
                  <Text style={styles.openWeightsBadge}>Open Weights</Text>
                )}
              </View>
              <Text style={styles.modelTitle}>{model.name}</Text>
              <Text style={styles.modelId}>{model.id}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <Text style={styles.sectionHeading}>OVERVIEW</Text>
            <Text style={styles.descriptionText}>{model.description}</Text>

            {/* Core Metrics Grid */}
            <Text style={[styles.sectionHeading, { marginTop: 16 }]}>BENCHMARK METRICS</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Arena ELO</Text>
                <Text style={[styles.metricValue, { color: '#fbbf24' }]}>{model.metrics.elo}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Quality Index</Text>
                <Text style={styles.metricValue}>{model.metrics.qualityIndex}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Throughput</Text>
                <Text style={[styles.metricValue, { color: '#38bdf8' }]}>{model.metrics.tokensPerSec} tps</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>TTFT Latency</Text>
                <Text style={styles.metricValue}>{model.metrics.ttftMs} ms</Text>
              </View>
            </View>

            {/* Technical Specs */}
            <Text style={[styles.sectionHeading, { marginTop: 16 }]}>SPECIFICATIONS & PRICING</Text>
            <View style={styles.specBox}>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Context Length</Text>
                <Text style={styles.specVal}>{(model.context_length / 1000).toFixed(0)}k tokens</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Prompt Price</Text>
                <Text style={[styles.specVal, { color: '#34d399' }]}>${model.pricing.prompt.toFixed(2)} / 1M</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Completion Price</Text>
                <Text style={[styles.specVal, { color: '#34d399' }]}>${model.pricing.completion.toFixed(2)} / 1M</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>SWE-bench Verified</Text>
                <Text style={styles.specVal}>{model.metrics.sweBench ? `${model.metrics.sweBench}%` : 'N/A'}</Text>
              </View>
              <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.specLabel}>AIME 2024 Math</Text>
                <Text style={styles.specVal}>{model.metrics.aime2024 ? `${model.metrics.aime2024}%` : 'N/A'}</Text>
              </View>
            </View>

            {/* Action button */}
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => Linking.openURL(model.openRouterUrl)}
            >
              <Text style={styles.actionBtnText}>Open on OpenRouter.ai →</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#334155',
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  providerBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reasoningBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d8b4fe',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  openWeightsBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6ee7b7',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  modelId: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bodyScroll: {
    marginTop: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 0.8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  specBox: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  specLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  specVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f8fafc',
    fontFamily: 'monospace',
  },
  actionBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
