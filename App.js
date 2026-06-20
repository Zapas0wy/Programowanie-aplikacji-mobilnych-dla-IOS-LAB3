import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serverResponse, setServerResponse] = useState(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Błąd odpowiedzi serwera");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Nie udało się pobrać postów");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!title.trim() || !body.trim() || !userId.trim()) {
      setError("Wypełnij wszystkie pola");
      setSuccess("");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");
      setServerResponse(null);

      const newPost = {
        title: title,
        body: body,
        userId: Number(userId),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Błąd wysyłania danych");
      }

      const data = await response.json();

      setSuccess("Post został wysłany poprawnie");
      setServerResponse(data);
      setPosts([data, ...posts]);

      setTitle("");
      setBody("");
      setUserId("");
    } catch (err) {
      setError("Nie udało się wysłać posta");
    } finally {
      setSending(false);
    }
  };

  const renderPost = ({ item }) => {
    return (
      <View style={styles.post}>
        <Text style={styles.postId}>ID: {item.id}</Text>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody}>{item.body}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>Posty z API</Text>

            <View style={styles.form}>
              <Text style={styles.formTitle}>Dodaj nowy post</Text>

              <TextInput
                style={styles.input}
                placeholder="Tytuł"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Treść posta"
                value={body}
                onChangeText={setBody}
                multiline
              />

              <TextInput
                style={styles.input}
                placeholder="User ID"
                value={userId}
                onChangeText={setUserId}
                keyboardType="numeric"
              />

              <Button
                title={sending ? "Wysyłanie..." : "Wyślij"}
                onPress={createPost}
                disabled={sending}
              />

              {success ? <Text style={styles.success}>{success}</Text> : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              {serverResponse ? (
                <View style={styles.responseBox}>
                  <Text style={styles.responseTitle}>Odpowiedź serwera:</Text>
                  <Text>ID: {serverResponse.id}</Text>
                  <Text>Title: {serverResponse.title}</Text>
                  <Text>Body: {serverResponse.body}</Text>
                  <Text>User ID: {serverResponse.userId}</Text>
                </View>
              ) : null}
            </View>

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" />
                <Text>Ładowanie danych...</Text>
              </View>
            ) : null}
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  loadingBox: {
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  error: {
    color: "red",
    marginTop: 10,
    fontWeight: "bold",
  },
  success: {
    color: "green",
    marginTop: 10,
    fontWeight: "bold",
  },
  responseBox: {
    backgroundColor: "#eeeeee",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  responseTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  post: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  postId: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postBody: {
    fontSize: 14,
  },
});
