import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { CompareScreen } from './src/screens/CompareScreen';
import { ParetoScreen } from './src/screens/ParetoScreen';
import { CalculatorScreen } from './src/screens/CalculatorScreen';
import { ApiExplorerScreen } from './src/screens/ApiExplorerScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#020617',
            borderBottomColor: '#1e293b',
            borderBottomWidth: 1,
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#f8fafc',
            fontWeight: 'bold',
            fontSize: 16,
          },
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopColor: '#1e293b',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#38bdf8',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            title: 'Leaderboard',
            headerTitle: 'OpenRouter Benchmarks',
            tabBarLabel: 'Evals',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🏆</Text>,
          }}
        />
        <Tab.Screen
          name="Compare"
          component={CompareScreen}
          options={{
            title: 'Model Comparison',
            tabBarLabel: 'Compare',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>⚖️</Text>,
          }}
        />
        <Tab.Screen
          name="Pareto"
          component={ParetoScreen}
          options={{
            title: 'Pareto Analytics',
            tabBarLabel: 'Pareto',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>📈</Text>,
          }}
        />
        <Tab.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{
            title: 'Cost Estimator',
            tabBarLabel: 'Calculator',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🧮</Text>,
          }}
        />
        <Tab.Screen
          name="API"
          component={ApiExplorerScreen}
          options={{
            title: 'API Explorer',
            tabBarLabel: 'API',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>⚡</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
