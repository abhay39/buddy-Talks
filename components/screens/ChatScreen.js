import { Alert, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons.js'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js'
import Feather from 'react-native-vector-icons/Feather'

const ChatScreen = () => {

    const [message,setMessage]=useState("")

  return (
        <View style={{flex: 1,
            backgroundColor:'white'}}>
            <ImageBackground source={{uri:"https://i.pinimg.com/originals/10/77/60/107760135651e70300fb4c1cf09eea09.jpg"}} style={{height:'100%',width:'100%'}}>
            <View style={styles.container}>
        <StatusBar backgroundColor='#075E54' barStyle={'light-content'}/>
        <View style={styles.header}>
            <View style={{display:'flex',flexDirection:'row'}}>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="keyboard-backspace" size={40} color="white" style={{marginLeft:10}}/>
                </TouchableOpacity>
                <Text style={{fontSize:28,color:'white',fontWeight:'700',marginLeft:10}}>Abhay</Text>
            </View>
            <View style={{display:'flex',flexDirection:'row',marginLeft:10,alignItems:'center'}}>
                <TouchableOpacity>
                    <MaterialIcons name="call" size={30} color="white" style={{marginLeft:10}}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="video" size={30} color="white" style={{marginLeft:20}}/>
                </TouchableOpacity>
            </View>
        </View>
        </View> 
        <ScrollView contentContainerStyle={{paddingBottom:60,padding:20}}>
            <TouchableOpacity style={{backgroundColor:'gray',padding:10,borderRadius:20}}>
                <Text style={{fontSize:21,color:'white',fontWeight:'500'}}>Hey</Text>
            </TouchableOpacity>
        </ScrollView>
            <View style={{position:'absolute',bottom:0,backgroundColor:'blue',width:'100%',padding:15,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderRadius:10}}>
                <TextInput onChangeText={(text)=>setMessage(text)} placeholder='Write here to send message' placeholderTextColor={"white"} style={{
                    fontSize:18,color:'white'
                }}/>
                {message.length>0?(<TouchableOpacity><Feather name="send" size={30} color="white" style={{}}/></TouchableOpacity>):(<TouchableOpacity>
                    <MaterialCommunityIcons name="camera-outline" size={30} color="white" style={{}}/>
                </TouchableOpacity>)}
                
            </View>
            </ImageBackground>
        </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    header:{
        height :80,
        backgroundColor:"#075E54",
        padding:5,
        display:'flex',
        flexDirection:'row',
        alignItems:"center",
        justifyContent:'space-between'
    }
})