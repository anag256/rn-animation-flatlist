import { StatusBar } from "expo-status-bar";
import { Animated, Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fa, faker } from "@faker-js/faker";
import { useRef, useState } from "react";

let genderAr=["man","women"];
 function createRandomUser() {
  return {
    key: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatarGitHub(),
    role: faker.person.jobTitle(),

  };
}

 const USERS = faker.helpers.multiple(createRandomUser, {
  count: 40,
});

const IMAGE_SIZE=70;
const SPACING=20;
const ITEM_SIZE=IMAGE_SIZE+SPACING*3;
const {width,height}=Dimensions.get('screen')

const bgImage="https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
export default function App() {
  const [end,setEnd]=useState(false);
  const scrollY=useRef(new Animated.Value(0)).current;
  return (
    <SafeAreaView style={styles.container}>
      <Image source={{uri:bgImage}} style={StyleSheet.absoluteFillObject} blurRadius={80}/>
      <Animated.FlatList
        data={USERS}
        style={{marginVertical:15}}
        contentContainerStyle={{gap:SPACING,marginHorizontal:10}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y:scrollY}}}],  //mapping offset y to our scrolly variable
          {useNativeDriver:true}          // Optional async listener
        )}
        onEndReached={()=>setEnd(true)}
        renderItem={({ item,index }) => {
          const inputRange=[
            -1,
            0,
            ITEM_SIZE*index,
            ITEM_SIZE*(index+1)

          ]
          const opacityInputRange=[
            -1,
            0,
            ITEM_SIZE*index,
            ITEM_SIZE*(index+0.5)

          ]
          const scale=scrollY.interpolate({
            inputRange,
            outputRange:[1,1,1,0]
          })
          const opacity=scrollY.interpolate({
            inputRange:opacityInputRange,
            outputRange:[1,1,1,0]
          })
          return (
            <Animated.View style={{flexDirection:'row',padding:SPACING,backgroundColor:'rgba(255,255,255,0.9)',gap:SPACING,shadowColor:'#000',shadowOffset:{width:0,height:10},shadowRadius:20,shadowOpacity:0.3,opacity,transform:[{scale}]}}>
              <Image source={{ uri: item.avatar }} style={{width:IMAGE_SIZE,height:IMAGE_SIZE,borderRadius
              :IMAGE_SIZE}}/>
              <View>
                <Text style={{fontSize:20,fontWeight:700}}>{item.name}</Text>
                <Text style={{fontSize:14}}>{item.role}</Text>
                <Text style={{fontSize:12,color:'blue'}}>{item.email}</Text>
              </View>
            </Animated.View>
          );
        }}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // width,
    // height
  },
});
