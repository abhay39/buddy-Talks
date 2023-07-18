import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, Touchable, TouchableOpacity, View,FlatList } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import {datas} from './dummyData.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons.js'
import { Authinication } from '../../hooks/authState.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {

    const {user,setUser,token,setToken,URL}=useContext(Authinication)

    const [userInfo,setUserInfo]=useState([]);

    const getToken = async () => {
        try {
          const isToken =JSON.parse(await AsyncStorage.getItem("token"))
          setToken(isToken.token)
        } catch (error) {
         console.log(error); 
        }
    };

    const getUserData = async () => {
        const response=await fetch(`${URL}/getDetails`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                token:token
            })
        })
        const statusCode= response.status;
        const data= await response.json();
        // console.log(data)
        if(statusCode===200){
            const t=data.userData;
            setUserInfo(t)
        }else if(statusCode===404){
            // Alert.alert(data.message)
        }
    };

    const logout=async()=>{
        await AsyncStorage.clear()
        setUser(false)
    }

    useEffect(()=>{
        AsyncStorage.setItem("userState", JSON.stringify(user));
        getToken()
        getUserData()
    })

    {userInfo.totalConversation?.map((item,index)=>{
        // console.log(item)
    })}


  return (
    <View style={styles.container}>
        <StatusBar backgroundColor='#075E54' barStyle={'light-content'}/>
      
      <View style={styles.header}>
        <View style={{display:'flex',justifyContent:'space-between',flexDirection:'row'}}>
        <TouchableOpacity>
            <Image source={{uri:userInfo?.image || "https://i.imgur.com/t33Dab1.jpg"}} style={{
                width:60,
                height:60,
                borderRadius:60,resizeMode:'center'
            }}/>
        </TouchableOpacity>
            <Text style={{fontSize:45,color:'white',fontWeight:'700',marginLeft:5}}>Chats</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',marginLeft:10,alignItems:'center'}}>
            <TouchableOpacity onPress={logout}>
                <MaterialCommunityIcons name="pencil-circle-outline" size={40} color="white" style={{marginLeft:10}}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialCommunityIcons name="camera-outline" size={40} color="white" style={{marginLeft:20}}/>
            </TouchableOpacity>
        </View>
      </View>

      <View style={{flex:1}}>
        {/* Chat List */}
        <FlatList 
            data={userInfo.totalConversation}
            renderItem={({item,index})=>{
                return(
                    <View key={item.conversationId} style={{marginBottom:16,flex:1}}>
                        <View  style={{display:'flex',flexDirection:'row',padding:10,alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                            <TouchableOpacity>
                                <Image source={{uri:item.profile}} style={{
                                    width:60,
                                    height:60,
                                    borderRadius:60,resizeMode:'center'
                                }}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:20}}>
                                <Text style={{fontSize:20,color:'black',fontWeight:'600'}}>{item.name}</Text>
                                <Text style={{fontSize:16,color:'black',fontWeight:'400'}}>{item[index]?.message[index]?.receiverMobile}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <View style={{marginRight:20}}>
                                <Text style={{fontSize:16,color:item.isOnline?("green"):("red"),fontWeight:'600'}}>{item.isOnline?("Online"):("Offline")}</Text>
                                <Text style={{fontSize:16,color:'black',fontWeight:'400'}}>{item.timeStamp}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{borderWidth:0.75,borderColor:'gray'}}></View>
                    </View>
                )
            }}
        />
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    header:{
        height :120,
        backgroundColor:"#075E54",
        padding:20,
        display:'flex',
        flexDirection:'row',
        alignItems:"center",
        justifyContent:'space-between'
    }
})