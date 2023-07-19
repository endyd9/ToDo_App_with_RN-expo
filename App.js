import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsnyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { theme } from "./color";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [modi, setModi] = useState(false);
  const [modiId, setModiId] = useState("");
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);
  const travel = async () => setWorking(false);
  const work = async () => setWorking(true);

  const saveToDos = async (toSave) => {
    await AsnyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const onChangeText = (payload) => setText(payload);

  const loadToDOs = async () => {
    const loadidToDos = JSON.parse(await AsnyncStorage.getItem(STORAGE_KEY));
    if (loadidToDos === null) return setLoading(false);
    setToDos(loadidToDos);
    setLoading(false);
  };

  const addToDo = async () => {
    if (text === "") return;
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, done: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const checkToDo = (id) => {
    const newTodos = { ...toDos };
    newTodos[id].done === false
      ? (newTodos[id].done = true)
      : (newTodos[id].done = false);
    saveToDos(newTodos);
    setToDos(newTodos);
  };

  const onModiPress = (id) => {
    setModiId(id);
    setText(toDos[id].text);
    setModi(true);
    this.input.focus();
  };
  const modiToDo = async () => {
    if (text === "") return;
    const newToDos = { ...toDos };
    newToDos[modiId].text = text;
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    setModiId("");
    setModi(false);
  };

  const deleteToDo = (id) => {
    Alert.alert("Delete To Do?", null, [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const newTodos = { ...toDos };
          delete newTodos[id];
          setToDos(newTodos);
          saveToDos(newTodos);
        },
      },
    ]);
  };
  useEffect(() => {}, []);
  useEffect(() => {
    loadToDOs();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            ToDo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.gray : "white" }}
          >
            Wish
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          ref={(input) => (this.input = input)}
          returnKeyType="done"
          onSubmitEditing={modi ? modiToDo : addToDo}
          onChangeText={onChangeText}
          placeholder={
            working
              ? modi
                ? "Modifiy To Do"
                : "Add To Do"
              : "Where Are You Going?"
          }
          style={styles.input}
          value={text}
        />
        <ScrollView>
          {loading ? (
            <ActivityIndicator style={styles.loading} size="large" />
          ) : (
            Object.keys(toDos).map((key) =>
              toDos[key]?.working === working ? (
                <View style={styles.toDo} key={key}>
                  <Text
                    style={{
                      ...styles.toDoText,
                      color: toDos[key].done ? "gray" : "white",
                      textDecorationLine: toDos[key].done
                        ? "line-through"
                        : null,
                    }}
                  >
                    {toDos[key].text}
                  </Text>
                  <View style={styles.btns}>
                    <TouchableOpacity onPress={() => checkToDo(key)}>
                      <Fontisto name="check" size={25} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onModiPress(key)}>
                      <Text>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <Fontisto name="trash" size={25} color={theme.toDoBg} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 25,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 70,
    marginBottom: 20,
  },
  loading: {
    marginTop: "50%",
  },
  btnText: {
    fontSize: 35,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    fontSize: 20,
    marginBottom: 10,
  },
  toDo: {
    flex: 1,
    borderRadius: 15,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.gray,
    flexDirection: "row",
    alignItems: "center",
  },
  toDoText: {
    flex: 1,
    fontSize: 16,
  },
  btns: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
