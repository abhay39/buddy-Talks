import { StyleSheet,Platform } from 'react-native'
import React,{useState,useEffect} from 'react'
import Home from './components/screens/Home'
import ChatScreen from './components/screens/ChatScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './components/screens/SignUp'
import { Authinication } from './hooks/authState'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Login from './components/screens/Login'

const Stack=createNativeStackNavigator();
const App = () => {

  const [user,setUser]=useState(false)
  const [userData,setUserData]=useState(null)
  const [token,setToken]=useState("")
  const URL=Platform.OS==='android'?("http://10.0.2.2:5000"):("http://localhost:8080")

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("userState"))
      if(userData){
        setUser(true)                     
      }else{
        setUser(false)
      }
    } catch (error) {
     console.log(error); 
    }
  };

  useEffect(()=>{
    getUser()
  })

  return (
    <NavigationContainer>
      <Authinication.Provider value={{user,setUser,userData,setUserData,URL,token,setToken}}>
        <Stack.Navigator screenOptions={{
          headerShown:false
        }}>
          {user?
          (<>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>)
          :
          (<>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>)
          }
        </Stack.Navigator>
      </Authinication.Provider>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})