import { StyleSheet, Text, View } from "react-native";

export default function Signup() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup Screen</Text>
      {/* You will add signup form code here later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
