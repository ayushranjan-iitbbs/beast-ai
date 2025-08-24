import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useContext } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HistoryContext } from "../context/HistoryContext";

export default function HistoryScreen() {
  const { history } = useContext(HistoryContext);

  const handleDownload = async (item) => {
    const fileUri = `${FileSystem.cacheDirectory}${item.prompt.replace(/\s+/g, "_")}.png`;
    await FileSystem.downloadAsync(item.url, fileUri);
    await Sharing.shareAsync(fileUri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}> Image History</Text>

      {history.length === 0 && <Text style={styles.empty}>No images generated yet.</Text>}

      {history.map((item, index) => (
        <View key={index} style={styles.item}>
          <Image source={{ uri: item.url }} style={styles.image} />
          <Text style={styles.prompt}>{item.prompt}</Text>
          <Text style={styles.aspect}>Aspect: {item.aspect}</Text>
          <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item)}>
            <Text style={styles.downloadText}>⬇️ Download</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f0f4f8", alignItems: "center" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 15, color: "#4f46e5" },
  empty: { color: "#555", marginTop: 20 },
  item: { marginBottom: 20, alignItems: "center" },
  image: { width: 250, height: 250, borderRadius: 15, borderWidth: 1, borderColor: "#ddd" },
  prompt: { marginTop: 5, fontWeight: "bold" },
  aspect: { color: "#555" },
  downloadButton: { backgroundColor: "#4f46e5", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginTop: 5 },
  downloadText: { color: "#fff", fontWeight: "bold" },
});
