import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const API_KEY = "TzXec6gRGCJ2F0OHvDJnOQ7mqQy4SjN7pqUH4olQSIirrXGZKV2kT83R";

const PEXELS_API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portratit&size=small&per_page=20";


const { width, height } = Dimensions.get("screen");
const SPACING = 10;
const IMAGE_SIZE = 60;

export default function App() {
  const [photos, setPhotos] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const topRef = useRef();
  const downRef = useRef();
  const fetchDataFromPexels = async () => {
    const res = await fetch(PEXELS_API_URL, {
      headers: {
        Authorization: API_KEY,
      },
    });
    const { photos } = await res.json();
    return photos;
  };

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset:index*width,
      animated:true
    })

    if(index*(IMAGE_SIZE+SPACING)-IMAGE_SIZE/2>width/2){
      downRef?.current?.scrollToOffset({
        offset:index*(IMAGE_SIZE+SPACING)-width/2+IMAGE_SIZE/2,
        animated:true
      })
    }else{
      downRef?.current?.scrollToOffset({
        offset:0,
        animated:true
      })
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchDataFromPexels();
      setPhotos(images);
    };

    fetchImages();
  }, []);
  console.log("images", photos);
  if (!photos) return <Text>...Loading</Text>;
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={photos}
        ref={topRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          scrollToActiveIndex(
            Math.round(ev.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image
              source={{ uri: item.src.portrait }}
              alt={item.alt}
              style={[StyleSheet.absoluteFillObject]} //absolute fill object will take entire space of its view
            />
            <View style={styles.overlay} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <FlatList
        data={photos}
        ref={downRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          position: "absolute",
          bottom: IMAGE_SIZE,
          backgroundColor: "transparent",
        }}
        contentContainerStyle={{ gap: SPACING, paddingHorizontal: SPACING }}
        renderItem={({ item, index }) => (
         <TouchableOpacity onPress={()=>scrollToActiveIndex(index)}>
             <Image
            source={{ uri: item.src.small }}
            alt={item.alt}
            style={{
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: index == activeIndex ? "#fff" : "transparent",
            }} //absolute fill object will take entire space of its view
          />
         </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
