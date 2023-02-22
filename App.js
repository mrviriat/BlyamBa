// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Button, Input } from 'react-native-elements';
// import {  StyleSheet, Text, View } from 'react-native';
// import { auth } from "./firebase"
// export default function App() {

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const register = () => {
//     auth.createUserWithEmailAndPassword(email, password)
//   }

//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//       <View>
//         <Input
//           placeholder="Full Name"
//           type="email"
//           value={email}
//           onChangeText={(text) => setEmail(text)}
//         />
//         <Input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChangeText={(text) => setPassword(text)}
//         />
//       </View>
//       <Button
//         containerStyle={styles.button}
//         raised
//         onPress={register}
//         title="Register"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React, { useEffect } from 'react';
import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, TextInput, Button, Alert } from 'react-native';
import { BlurView } from 'expo-blur';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { auth, db } from './firebase-config';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenFontSize
} from "react-native-responsive-dimensions";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Bulion } from './Bulion'
import { FontAwesome5 } from '@expo/vector-icons';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  arrayUnion,
  Timestamp,
  FieldValue,
  onSnapshot
} from "firebase/firestore";
const uri = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg'
const profilePicture = 'https://randomuser.me/api/portraits/men/34.jpg'

var chat_ID = '';


function Input() {
  const [text, setText] = React.useState("новый текст");
  const [img, setImg] = React.useState(null);
  const [load, setLoad] = React.useState(true);
  const handleSend = async () => {
    if (img) {
      console.log("img");
    } else {
      console.log(chat_ID);
      await updateDoc(doc(db, "chats", chat_ID), {
        messages: arrayUnion(
          {
            text: text,
            iud: auth.currentUser.uid,
            date: Timestamp.now(),
          }
        ),
      });
    }

    setText("");
    setImg(null);
    setLoad(!load);

  };

  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chat_ID), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
  }, [load]);





  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 350 }}>
        {messages.map((m) => (m.iud == auth.currentUser.uid ?
          <Text style={{alignSelf: 'flex-end' }}>{m.text}</Text> 
          : <Text style={{alignSelf: 'flex-start' }}>{m.text}</Text> 
        ))}
      </View>
      <Text>здесь будет твой чат... быдло{'\n'}</Text>
      {/* <TouchableOpacity onPress={handleSelect} style={[styles.button, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: responsiveFontSize(2.1), color: "#2C6BED" }}>сделать чат</Text>
      </TouchableOpacity> */}
      <TextInput onChangeText={(text) => setText(text)} style={styles.input} placeholder="text" />
      <Text>{text}</Text>
      <TouchableOpacity onPress={handleSend} style={[styles.button, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: responsiveFontSize(2.1), color: "#2C6BED" }}>отправить сообщение</Text>
      </TouchableOpacity>
    </View>
  );
};















function Bb() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Bulion />
    </View>
  );
}


function HomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState("");
  const [user, setUser] = React.useState(null);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      auth.currentUser.uid > user.uid
        ? auth.currentUser.uid + user.uid
        : user.uid + auth.currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }

      chat_ID = combinedId;
      console.log(chat_ID)
      navigation.navigate('Chat')
    }
    catch (err) { }
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput onChangeText={(text) => setUsername(text)} style={styles.input} placeholder="Serched_User" />
      <TouchableOpacity onPress={handleSearch} style={[styles.button, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: responsiveFontSize(2.1), color: "#2C6BED" }}>найти</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelect} style={[styles.button, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: responsiveFontSize(2.1), color: "#2C6BED" }}>сделать чат</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: responsiveFontSize(2), padding: responsiveWidth(10) }}>{user == null ? "ничего" : user.displayName}</Text>




      {/* <FontAwesome5 name="grin-tongue" size={responsiveHeight(18)} color="black" />
      <Text style={{ fontSize: responsiveFontSize(2), padding: responsiveWidth(10) }}>Здравствуй, {auth?.currentUser?.providerData[0].displayName}!{'\n'}
        К сожалению сейчас ваш личный кабинет и страничка чатов находятся на стадии проектирования и будут готовы в самое ближайшее время,
        а пока вы можете ускорить этот процесс, обеспечив главного программиста вкусным обедом и слюняывм отсосом.{'\n'}
        С наилучшими пожеланиями! ;{')\n'}
        Можете оценить нашу недавнюю разработку <Text style={{ color: "#2C6BED" }} >Bulion</Text></Text>
      <TouchableOpacity onPress={() => navigation.navigate('Bulion')} style={[styles.button, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: responsiveFontSize(2.1), color: "#2C6BED" }}>попробовать</Text>
      </TouchableOpacity> */}
    </View>
  );
}

function LoginScreen() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigation = useNavigation();


  const handleCreateAccount = () => {
    navigation.navigate('Reg');
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // console.log('Signed in!')
        const user = userCredential.user;
        // console.log(user)
        navigation.navigate('Home');
      })
      .catch(error => {
        // console.log(error)
        Alert.alert(error.message)
      })
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons name="dog" size={200} color="#2C6BED" />
        <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="my_email@blyamba.com" />
        <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="password" secureTextEntry={true} />
        <TouchableOpacity onPress={handleSignIn} style={[styles.button, { backgroundColor: "#2C6BED" }]}>
          <Text style={{ fontSize: responsiveFontSize(2.1), fontWeight: '400', color: 'white' }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateAccount} style={[styles.button, { backgroundColor: "white" }]}>
          <Text style={{ fontSize: responsiveFontSize(2.1), fontWeight: '400', color: "#2C6BED" }}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 100 }}></View>

    </KeyboardAvoidingView>
    // <View style={styles.container}>
    //   <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
    //   <View style={{ width: 100, height: 100, backgroundColor: 'purple', position: 'absolute' }}></View>
    //   <View style={{ width: 100, height: 100, backgroundColor: 'blue', top: 120, position: 'absolute', transform: [{ rotate: '25deg' }] }}></View>
    //   <View style={{ width: 100, height: 100, backgroundColor: 'red', bottom: 120, position: 'absolute', borderRadius: 50, transform: [{ rotate: '50deg' }] }}></View>
    //   <ScrollView contentContainerStyle={{
    //     flex: 1,
    //     width: '100%',
    //     height: '100%',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //   }}>
    //     <BlurView intensity={100}>
    // <View style={styles.login}>
    //   <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
    //   <View>
    //     <Text style={{ fontSize: 17, fontWeight: '400', color: 'white' }}>E-mail</Text>
    //     <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="betomoedano@outlook.com" />
    //   </View>
    //   <View>
    //     <Text style={{ fontSize: 17, fontWeight: '400', color: 'white' }}>Password</Text>
    //     <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="password" secureTextEntry={true} />
    //   </View>
    //   <TouchableOpacity onPress={handleSignIn} style={[styles.button, { backgroundColor: '#00CFEB90' }]}>
    //     <Text style={{ fontSize: 17, fontWeight: '400', color: 'white' }}>Login</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={handleCreateAccount} style={[styles.button, { backgroundColor: '#6792F090' }]}>
    //     <Text style={{ fontSize: 17, fontWeight: '400', color: 'white' }}>Create Account</Text>
    //   </TouchableOpacity>
    // </View>
    //     </BlurView>
    //   </ScrollView>
    // </View>
  );
}

function RegScreen() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('unknown')
  const navigation = useNavigation();


  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: name
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: name,
          email,
          password,
        });

        //create empty user chats on firestore
        await setDoc(doc(db, "userChats", userCredential.user.uid), {});



        // userCredential.user.updateProfile({
        //   displayName: name
        // })
        const user = userCredential.user;
        // console.log(user)
        Alert.alert("Success", "Your accaunt has been created", [
          { text: 'OK', onPress: () => navigation.navigate("Let's LogIn") },
        ]);
      })
      .catch(error => {
        // console.log(error)
        Alert.alert('Error', error.message)
      })
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        // console.log('Signed in!')
        const user = userCredential.user;
        // console.log(user)
        navigation.navigate('Home');
      })
      .catch(error => {
        // console.log(error)
        Alert.alert(error.message)
      })
  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons name="dog" size={200} color="#2C6BED" />
        <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="my_email@blyamba.com" />
        <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="password" secureTextEntry={true} />
        <TextInput onChangeText={(text) => setName(text)} style={styles.input} placeholder="myName" />
        <TouchableOpacity onPress={handleCreateAccount} style={[styles.button, { backgroundColor: "white" }]}>
          <Text style={{ fontSize: responsiveFontSize(2.1), fontWeight: '400', color: "#2C6BED" }}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 100 }}></View>

    </KeyboardAvoidingView>
  );
}

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTytleStyle: { color: "white" },
  headerTintColor: "white",
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Let's LogIn" component={LoginScreen} />
        <Stack.Screen name="Reg" component={RegScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Bulion" component={Bb} />
        <Stack.Screen name="Chat" component={Input} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  login: {
    width: 350,
    height: 500,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 1,
    marginVertical: 30
  },
  input: {
    width: responsiveWidth(65),
    height: responsiveHeight(5),
    borderRadius: responsiveWidth(3),
    borderColor: 'grey',
    borderWidth: 1,

    padding: 10,
    marginVertical: 1,
    backgroundColor: '#ffffff90',
    // marginBottom: 20
  },
  button: {
    width: responsiveWidth(65),
    height: responsiveHeight(5),
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 10,
    borderColor: "#2C6BED",
    borderWidth: 1,
    marginTop: 20
  }

});
