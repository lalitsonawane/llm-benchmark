import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { fetchMobileBenchmarks } from '../services/mobileApi';

export const ApiExplorerScreen: React.FC = () => {
  const [source, setSource] = useState('artificial-analysis');
  const [task, setTask] = useState('coding');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await fetchMobileBenchmarks({
        source,
        task_type: task,
        apiKey: apiKey.trim() || undefined
      });
      setResponseJson(JSON.stringify(res.data.slice(0, 3), null, 2));
    } catch (e: any) {
      setResponseJson(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.card}>
          <Text style={styles.title}>API Query Tester</Text>
          <Text style={styles.subTitle}>GET https://openrouter.ai/api/v1/benchmarks</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Benchmark Source</Text>
            <TextInput
              style={styles.input}
              value={source}
              onChangeText={setSource}
              placeholder="e.g. artificial-analysis"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Type</Text>
            <TextInput
              style={styles.input}
              value={task}
              onChangeText={setTask}
              placeholder="e.g. coding"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>OpenRouter API Key (Optional)</Text>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-or-v1-..."
              placeholderTextColor="#64748b"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleTest} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnText}>Send API Request</Text>
            )}
          </TouchableOpacity>
        </View>

        {responseJson && (
          <View style={styles.responseCard}>
            <Text style={styles.responseHeader}>RESPONSE DATA (3 models preview)</Text>
            <Text style={styles.jsonText}>{responseJson}</Text>
          </View>
        )}

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
    gap: 12,
  },
  title: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  subTitle: { fontSize: 11, color: '#38bdf8', fontFamily: 'monospace' },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#f8fafc',
  },
  btn: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
  responseCard: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
  },
  responseHeader: { fontSize: 10, fontWeight: 'bold', color: '#64748b', marginBottom: 8 },
  jsonText: { fontSize: 11, color: '#38bdf8', fontFamily: 'monospace', lineHeight: 16 },
});
