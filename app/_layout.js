import { Ionicons } from "@expo/vector-icons"; // install expo/vector-icons if not already
import { Tabs } from "expo-router";
import { HistoryProvider } from "../context/HistoryContext";

export default function Layout() {
  return (
    <HistoryProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#4f46e5",
          tabBarInactiveTintColor: "#555",
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Beast Chatbot",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="image"
          options={{
            title: "Beast Image Generator",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="image" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </HistoryProvider>
  );
}
