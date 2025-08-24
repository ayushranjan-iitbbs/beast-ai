import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useContext, useState } from "react";
import { Text, View } from "react-native";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { HistoryContext } from "../context/HistoryContext";
import { generateImage } from "../services/replicate";

export default function ImageScreen() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aspect, setAspect] = useState("1:1");

  const { history, setHistory } = useContext(HistoryContext);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl(null);

    const finalPrompt = `${prompt}, aspect ratio ${aspect}`;
    const url = await generateImage(finalPrompt);

    if (url) {
      setImageUrl(url);
      setHistory([{ url, prompt, aspect }, ...history]);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    const fileUri = `${FileSystem.cacheDirectory}${prompt.replace(/\s+/g, "_")}.png`;
    await FileSystem.downloadAsync(imageUrl, fileUri);
    await Sharing.shareAsync(fileUri);
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Cannot save image without gallery permission.");
      return;
    }

    try {
      const fileUri = `${FileSystem.cacheDirectory}${prompt.replace(/\s+/g, "_")}.png`;
      await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Success", "Image saved to gallery");
    } catch (err) {
      console.error("Download error:", err);
      Alert.alert("Error", "Failed to save image");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>AI Image Generator</Text>
      <Text style={styles.subHeader}>Enter description and choose aspect ratio</Text>

      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Enter image description..."
        style={styles.input}
      />

      <View style={styles.aspectContainer}>
        {["1:1", "16:9", "9:16", "4:3"].map((ratio) => (
          <TouchableOpacity
            key={ratio}
            style={[styles.aspectButton, aspect === ratio && styles.aspectButtonSelected]}
            onPress={() => setAspect(ratio)}
          >
            <Text style={[styles.aspectText, aspect === ratio && styles.aspectTextSelected]}>
              {ratio}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>Generate Image</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 20 }} />}

      {imageUrl && !loading && (
        <>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f0f4f8", alignItems: "center" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 5, color: "#4f46e5", textAlign: "center" },
  subHeader: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, backgroundColor: "#fff", marginBottom: 15 },
  aspectContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  aspectButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: "#999", marginHorizontal: 5, backgroundColor: "#fff" },
  aspectButtonSelected: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  aspectText: { color: "#333", fontWeight: "bold" },
  aspectTextSelected: { color: "#fff" },
  generateButton: { backgroundColor: "#4f46e5", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, marginBottom: 15 },
  generateButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  image: { width: 300, height: 300, marginTop: 20, borderRadius: 15, borderWidth: 1, borderColor: "#ddd" },
  buttonRow: { flexDirection: "row", marginTop: 10, justifyContent: "space-between", width: "60%" },
  shareButton: { backgroundColor: "#4f46e5", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  downloadButton: { backgroundColor: "#10b981", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
