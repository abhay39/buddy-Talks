import { StyleSheet, Text, View,Appearance,StatusBar,TextInput,Dimensions,TouchableOpacity,Modal,Alert } from 'react-native'
import React,{useState,useContext} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Authinication } from '../../hooks/authState';
import AsyncStorage from '@react-native-async-storage/async-storage';


const colorScheme = Appearance.getColorScheme();
const WIDTH=Dimensions.get('screen').width;
const HEIGHT=Dimensions.get('screen').height;



const SignUp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [number,setNumber]=useState(0);
  const [otp,setOtp]=useState(0)
  
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
    const incomplete= !name || !email || number.length<10 ;
    const incomplete2= otp.length<4 ;

    const {URL,setUser,user}=useContext(Authinication)

    const sendData=async()=>{
      const response=await fetch(`${URL}/create`,{
        method:"POST",
        headers:{
          "Content-type":"application/json",
        },
        body:JSON.stringify({
          emailId:email,
          number:number,
          name:name
        })
      })
      const statusCode=await response.status;
      const data=await response.json();
      if(statusCode===201){
        const message=data.message;
        Alert.alert(message)
        setModalVisible(true)
      }else if(statusCode===422){
        const message=data.message;
        Alert.alert(message)
      }else{
        Alert.alert("Something went wrong")
      }
    }

    const verifyOTP=async()=>{
      const response=await fetch(`${URL}/verifyOTP`,{
        method:"POST",
        headers:{
          "Content-type":"application/json",
        },
        body:JSON.stringify({
          number:number,
          otp:otp
        })
      })
      const statusCode=await response.status;
      const data=await response.json();
      if(statusCode===201){
        const message=data.message;
        const token=data.token;
        Alert.alert(message)
        setModalVisible(true)
        AsyncStorage.setItem("token",JSON.stringify({token}))
        setUser(true)
      }else if(statusCode===422){
        const message=data.message;
        Alert.alert(message)
      }else if(statusCode===500){
        const message=data.message;
        Alert.alert(message)
      }
  }

  return (
    <View style={styles.container}>
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.container}>
              <View style={styles.modalView}>
              <TouchableOpacity onPress={toggleModal} style={{marginTop:-55,marginBottom:20,backgroundColor:'red',padding:6,borderRadius:100}}>
                <Icon name="close" size={50} color="white" />
              </TouchableOpacity>
                <Text style={styles.modalText}>Verify OTP</Text>
                <TextInput placeholder='Enter otp send to email' style={{
                    backgroundColor:colorScheme === "dark"? "#2c3e50" : '#2c3e50',
                    color:'white',borderRadius:20,fontSize:20,padding:10,height:60,width:WIDTH-100,marginTop:20,fontWeight:'500'
                }} placeholderTextColor={'white'} keyboardType='number-pad' onChangeText={(text)=>setOtp(text)}/>

                <TouchableOpacity disabled={incomplete2} onPress={verifyOTP} style={{backgroundColor:incomplete2?("gray"):('green'),padding:10,borderRadius:10,width:WIDTH-100,marginTop:20,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:20,color:'white'}}>Verify OTP</Text>
          </TouchableOpacity>
                
              </View>
            </View>
          </Modal>
        </View>

        <StatusBar backgroundColor={colorScheme==='dark'?("black"):("white")} barStyle={colorScheme==='dark'?('light-content'):('dark-content')}/>

      <View  style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}>

        <Text style={{ fontSize: 30,color:colorScheme==='dark'?("white"):("black"),fontWeight:'600' }}>Sign Up</Text>

        <TextInput placeholder='Enter your name' style={{
            backgroundColor:colorScheme === "dark"? "#2c3e50" : '#2c3e50',
            color:'white',borderRadius:20,fontSize:20,padding:10,height:60,width:WIDTH-100,marginTop:20,fontWeight:'500'
        }} placeholderTextColor={'white'} keyboardType='default' onChangeText={(text)=>setName(text)}/>

        <TextInput placeholder='Enter your email address' style={{
            backgroundColor:colorScheme === "dark"? "#2c3e50" : '#2c3e50',
            color:'white',borderRadius:20,fontSize:20,padding:10,height:60,width:WIDTH-100,marginTop:20,fontWeight:'500'
        }} placeholderTextColor={'white'} keyboardType='email-address' onChangeText={(text)=>setEmail(text)}/>

        <TextInput placeholder='Enter mobile number' style={{
            backgroundColor:colorScheme === "dark"? "#2c3e50" : '#2c3e50',
            color:'white',borderRadius:20,fontSize:20,padding:10,height:60,width:WIDTH-100,marginTop:20,fontWeight:'500'
        }} placeholderTextColor={'white'} keyboardType='number-pad' onChangeText={(text)=>setNumber(text)}/>

        <TouchableOpacity  disabled={incomplete} onPress={sendData} style={{backgroundColor:incomplete?("gray"):('green'),padding:10,borderRadius:10,width:WIDTH-100,marginTop:20,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:20,color:'white'}}>SIGN UP</Text>
        </TouchableOpacity>

      </View>

    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:colorScheme==='dark'?("black"):("white"),
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'black',
    fontSize:30,
    fontWeight:'600'
  },
})