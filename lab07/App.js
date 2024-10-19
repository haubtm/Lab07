import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack';

const Stack = createStackNavigator();

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function EnterName({navigation}){
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('./assets/Image95.png')}></Image>
      <Text style={styles.textManager}>MANAGE YOUR{'\n'}TASK</Text>
      <View style={styles.input}>
        <TextInput style={styles.inputName} placeholder="Enter your name" value={name} 
          onChangeText={text => setName(text)}/>
        <Image style={styles.iconInput} source={require('./assets/Frame.png')}></Image>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => navigation.navigate('ToDoList', { userName: name })}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  )
}

function ToDoList({navigation, route}){
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');

  const { userName} = route.params || {};
  const { job } = route.params || {};

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setTodos(json.slice(0, 10));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch todos');
    }
  };

  const addTodo = (jobTitle) => {
    if (!jobTitle) return;
    const newTodoObj = {
      userId: 1,
      id: todos.length + 1,
      title: jobTitle,
      completed: false,
    };
    setTodos([...todos, newTodoObj]);
  };

  const editTodo = (id, newTitle) => {
    if (!newTitle) return;
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, title: newTitle } : todo
    ));
    setEditTodoId(null);
    setEditTodoTitle('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (job) {
      addTodo(job); 
    }
  }, [job]);

  return (
    <View style={styles.container}>
      <View style={styles.navigate}>
        <TouchableOpacity onPress={() => navigation.navigate('EnterName')}>
          <Image source={require('./assets/Back.png')}></Image>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Image style={styles.avatar} source={require('./assets/Avatar.png')}></Image>
          <View style={styles.message}>
            <Text style={styles.h1}>Hi {userName}</Text>
            <Text style={styles.h2}>Have agrate day a head</Text>
          </View>
        </View>
      </View>
      <View style={styles.input}>
        <TextInput style={styles.inputName} placeholder="Search"/>
        <Image style={styles.iconInput} source={require('./assets/Search.png')}></Image>
      </View>
      <FlatList style={styles.listToDo}
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.toDo}>
            <View style={styles.toDoItem}>
              <Image style={styles.check} source={require('./assets/Check.png')} ></Image>
              <Text style={styles.toDoText}>{item.title}</Text>
            </View>
            
            <TouchableOpacity onPress={() => {
              setEditTodoId(item.id);
              setEditTodoTitle(item.title);
            }}>
              <Image source={require('./assets/Edit.png')}></Image>
            </TouchableOpacity>
          </View>
        )}
      />
      {editTodoId && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.inputEdit}
            placeholder="Edit todo"
            value={editTodoTitle}
            onChangeText={setEditTodoTitle}
          />
          <TouchableOpacity style={styles.buttonSave} onPress={() => editTodo(editTodoId, editTodoTitle)}> 
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate('AddNewJob', { userName })}> 
          <Image source={require('./assets/Add.png')}></Image>
      </TouchableOpacity>
    </View>
  )
}

function AddToDo({navigation, route}){
  const [job, setJob] = useState('');
  const { userName} = route.params || {};

  return(
    <View style={styles.container}>
      <View style={[styles.navigate, {alignItems:'center'}]}>
        <View style={styles.userInfo}>
          <Image style={styles.avatar} source={require('./assets/Avatar.png')}></Image>
          <View style={styles.message}>
            <Text style={styles.h1}>Hi {userName}</Text>
            <Text style={styles.h2}>Have agrate day a head</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ToDoList', { userName })}>
          <Image source={require('./assets/Back.png')}></Image>
        </TouchableOpacity>
      </View>
      <Text style={styles.textAddJob}>ADD YOUR JOB</Text>
      <View style={styles.input}>
        <TextInput style={styles.inputName} placeholder="Input your job" value={job}
          onChangeText={text => setJob(text)} />
        <Image style={styles.iconInput} source={require('./assets/Job.png')}></Image>
      </View>  
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ToDoList', { job, userName})}>
        <Text style={styles.buttonText}>FINISH -></Text>
      </TouchableOpacity>
      <Image source={require('./assets/Image95.png')}></Image>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen  name="EnterName" component={EnterName} options={{headerShown: false}}/>
        <Stack.Screen  name="ToDoList" component={ToDoList} options={{headerShown: false}}/>
        <Stack.Screen  name="AddNewJob" component={AddToDo} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textManager:{
    fontFamily: 'Epilogue',
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 36,
    color: '#8353E2',
    textAlign: 'center'
  },
  input:{
    height: 43,
    width: '80%',
    justifyContent: 'center',
  },
  inputName:{
    borderColor: '#9095A0',
    borderWidth: 1,
    height: '100%',
    borderRadius: 12,
    paddingLeft: 40,
    fontSize: 16,
    lineHeight: 26,
  },
  iconInput:{
    position: 'absolute',
    marginLeft: 10
  },
  button:{
    height: 44,
    width: '50%',
    backgroundColor: '#00BDD6',
    borderRadius: 12,
    justifyContent: 'center'
  },
  buttonText:{
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter',
    lineHeight: 26,
    fontWeight: 400
  },
  navigate:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%'
  },
  avatar:{
    backgroundColor: '#D9CBF6',
    borderRadius: 25
  },
  userInfo: {
    flexDirection: 'row'
  },
  h1:{
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    color: '#171A1F'
  },
  h2:{
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#A1A1A1'
  },
  listToDo:{
    width: "85%",
    maxHeight: 350
  },
  toDo:{
    flexDirection: 'row',
    backgroundColor: '#DEE1E678',
    width: '100%',
    height: 48,
    borderRadius: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10
  },
  toDoItem:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
  },
  toDoText:{
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 26,
    color: '#171A1F',
    height: 30,
    marginLeft: 20
  },
  check:{
    width: 25,
    height: 25,
  },
  editContainer:{
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between'
  },
  inputEdit:{
    borderColor: '#9095A0',
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 26,
    paddingLeft: 20,
    width: '80%'
  },
  buttonSave:{
    backgroundColor: '#00BDD6',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonAdd:{
    height: 70,
    width: 70,
    backgroundColor: '#00BDD6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textAddJob:{
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 48,
    color: '#171A1F'
  }
});