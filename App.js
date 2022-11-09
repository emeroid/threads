import { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import { useThread } from './hooks/useThread';
import {spawnThread} from 'react-native-multithreading';

export default function App() {

  const [message, setMessage] = useState(""),
  [data, setData] = useState([]),
  [fib, setFib] = useState(""),
  [result, setResult] = useState(""),
  [thread] = useThread(),
  scrollViewRef = useRef(),
  // make an expensive calculation
  fibonacci = (num) => {
    'worklet'
    if (num <= 1) return 1
    return fibonacci(num - 1) + fibonacci(num - 2)
  },
  sendMessage = useCallback(() => {
    thread.postMessage(message)
    setMessage("")
  }, [message])

  useEffect(() => {
    thread.onmessage = (message) => {
      setData([...data, message]);
    }
  }, [])

  useEffect(() => {
    (async () => {
        const result = await spawnThread(() => {
          'worklet'
          let computed = fibonacci(fib)
          return computed;
        })
        setResult(result);
    })()
  }, [fib])

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}>
        <View>
          {fib && <Text>{`Fibonacci Thread Result: ${result}`}</Text>}
          <Text>Messages: </Text>
          {data?.map((msg, i) => <Text key={i}>{msg}</Text>)}
        </View>
      </ScrollView>
      <View style={[styles.row, styles.input]}>
        <View style={{flexDirection: "row", width: "80%"}}>
          <View style={{width: "90%"}}>
            <TextInput 
              placeholder={"Compute Fibonacci"} 
              onChangeText={(e) => setFib(e)} 
              value={message}
            />
          </View>
        </View>
      </View>
      
      <View style={[styles.row, styles.input]}>
        <View style={{flexDirection: "row", width: "80%"}}>
          <View style={{width: "90%"}}>
            <TextInput 
              placeholder={"Type Message"} 
              onChangeText={(e) => setMessage(e)} 
              value={message}
            />
          </View>
          <TouchableOpacity onPress={sendMessage}>
            <MaterialCommunityIcons name="send-circle-outline" size={32} color="#F94949" />
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: "#F3F3F3", 
    borderRadius: 8, 
    width: "100%", 
    height: 50, 
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2
  },
  row: {
    flexDirection: "row", 
    padding: 16
  }
});
