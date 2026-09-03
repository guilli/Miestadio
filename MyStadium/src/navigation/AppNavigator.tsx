import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import InfoScreen from '../screens/InfoScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1B5E20',
          borderTopWidth: 0,
          elevation: 12,
          height: 62,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#A5D6A7',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Brújula', tabBarIcon: ({ focused }) => <TabIcon emoji="🧭" focused={focused} /> }} />
      <Tab.Screen name="Quiz" component={QuizScreen} options={{ tabBarLabel: 'Quiz', tabBarIcon: ({ focused }) => <TabIcon emoji="🧠" focused={focused} /> }} />
      <Tab.Screen name="Info" component={InfoScreen} options={{ tabBarLabel: 'Ayuda', tabBarIcon: ({ focused }) => <TabIcon emoji="ℹ️" focused={focused} /> }} />
    </Tab.Navigator>
  );
}
