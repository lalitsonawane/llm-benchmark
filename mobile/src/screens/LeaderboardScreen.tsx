import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { BenchmarkModel, TaskType } from '../shared/types';
import { BENCHMARK_MODELS } from '../shared/benchmarksData';
import { ModelDetailSheet } from '../components/ModelDetailSheet';

export const LeaderboardScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskType>('all');
  const [selectedModel, setSelectedModel] = useState<BenchmarkModel | null>(null);

  const tasks: { id: TaskType; label: string }[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'coding', label: 'Coding' },
    { id: 'reasoning', label: 'Reasoning' },
    { id: 'math', label: 'Math' },
    { id: 'agentic', label: 'Agentic' },
  ];

  const filteredModels = BENCHMARK_MODELS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.provider.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (selectedTask === 'coding') return (b.metrics.sweBench || 0) - (a.metrics.sweBench || 0);
    if (selectedTask === 'math') return (b.metrics.aime2024 || 0) - (a.metrics.aime2024 || 0);
    if (selectedTask === 'reasoning') return (b.metrics.gpqa || 0) - (a.metrics.gpqa || 0);
    return b.metrics.elo - a.metrics.elo;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search model or provider..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Task Filters */}
      <View style={styles.taskScrollWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.taskContainer}>
          {tasks.map(t => {
            const isSelected = selectedTask === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setSelectedTask(t.id)}
                style={[styles.taskChip, isSelected && styles.taskChipActive]}
              >
                <Text style={[styles.taskText, isSelected && styles.taskTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Models List */}
      <FlatList
        data={filteredModels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.modelCard}
            onPress={() => setSelectedModel(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.modelName} numberOfLines={1}>{item.name}</Text>
                  {item.isReasoningModel && (
                    <View style={styles.reasoningPill}>
                      <Text style={styles.reasoningPillText}>Reasoning</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.providerSubText}>
                  {item.provider} • {(item.context_length / 1000).toFixed(0)}k context
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Arena ELO</Text>
                <Text style={[styles.metricVal, { color: '#fbbf24' }]}>{item.metrics.elo}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Quality</Text>
                <Text style={styles.metricVal}>{item.metrics.qualityIndex}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Throughput</Text>
                <Text style={[styles.metricVal, { color: '#38bdf8' }]}>{item.metrics.tokensPerSec} tps</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Price / 1M</Text>
                <Text style={[styles.metricVal, { color: '#34d399' }]}>${item.pricing.prompt}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <ModelDetailSheet
        visible={Boolean(selectedModel)}
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#f8fafc',
  },
  taskScrollWrapper: {
    height: 44,
  },
  taskContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  taskChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  taskChipActive: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderColor: '#0284c7',
  },
  taskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  taskTextActive: {
    color: '#38bdf8',
  },
  listContainer: {
    padding: 16,
    gap: 10,
  },
  modelCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8fafc',
    flexShrink: 1,
  },
  reasoningPill: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  reasoningPillText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#d8b4fe',
  },
  providerSubText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f8fafc',
    fontFamily: 'monospace',
  },
});
