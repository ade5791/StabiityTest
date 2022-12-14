import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  FlatList,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import commands from "./src/commands";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

import {

  SkypeIndicator,

} from  "react-native-indicators";
import * as ImagePicker from "expo-image-picker";


export default function App() {
  const [refImage, setRefImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [previousPrediction, setPreviousPrediction] = useState(null);
  const [displayImage, setDisplayImage] = useState("");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setRefImage(result.uri);
    }
  };
  const generatePrompt = (prompt) => {
    setLoading(true);
    //see if prompt contains a URL
    try {
 
              commands
              .stabilityAITxt2Img(prompt, refImage)
              .then((res) => {
                //console.log("Prediction is :" , res);
                setPreviousPrediction(res);
                setDisplayImage(res);
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
    } catch (err) {
      console.log(err);
    }
  };


  return (
 <View style={styles.container}>
        <Text style={styles.title}>Dream</Text>
        <View style={styles.promptContainer}>
        <Card style={styles.card}>
        <Card.Content>   
        <View
          style={{
            marginTop: -10,
            width: "100%",
          }}
        >
          <TextInput
            style={styles.InputText}
            onChangeText={(prompt) => setPrompt(prompt)}
            placeholder={`Type your prompt here`}
          />
         
      
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              generatePrompt(prompt);
            }}
          >
            <Image
              style={styles.tinyLogo}
              resizeMode="cover"
              source={require("./assets/go.png")}
            />
          </TouchableOpacity>    
          </View> 
          </Card.Content>
           </Card> 
     </View>
        <View style={styles.answerContainer}>
        
          <View style={styles.buttonContainer}>
          <TouchableOpacity
              style={styles.galleryButton}
              onPress={() => {
                pickImage();
              }}
            >
              <Image
                style={styles.galleryIcon}
                resizeMode="cover"
                source={require("./assets/add.png")}
              />
            </TouchableOpacity>
         
          </View>

          <View style={styles.displayImage}>
            {refImage ? (
              <Image
                source={{ uri: refImage }}
                style={styles.imageContainer}
                resizeMode="cover"
              />
            ) : null}
            {loading ? (
              <SkypeIndicator color="#5f5fff" style={styles.Indicator}/>
            ) : (
              <Image
                style={styles.imageContainer}
                resizeMode="cover"
                //   source={{ uri: `data:image/png;base64,${displayImage[0]}`}}
                source={{ uri: `data:image/png;base64,${displayImage}` }}
              />
            )}
          </View>
        </View>
      </View>
    );

}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",

    padding: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    top: 14,
    textAlign: "center",
    marginVertical: 20,
  },
  InputText: {
    fontStyle: "italic",
    fontSize: 16,
    borderColor: "gray",
    color: "#0A1257",

    padding: 10,

    width: "80%",
 
  },
  sub_title: {
    fontSize: 15,
    textAlign: "center",
  },
  sub_description: {
    fontSize: 15,
    textAlign: "center",
  },

  displayImage: {
    fontSize: 20,

    height: "100%",
   
    marginHorizontal: -20,
    backgroundColor: "#FFFFFF",
    padding: 20,


    borderRadius: 30,
  },



  output: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
 
  },
  buttonContainer: {
    justifyContent: "space-between",
    zIndex: 10000,
  top: 12,
  right: -10,
   

    flexDirecton: "row",
  },
  answerContainer: {
    height: "60%",

  },
  goBackIcon: {
    width: 20,
    height: 20,
    borderRadius: 1000,

    marginTop: -30,
    marginRight: 10,
  },
  goBackButton: {
    width: 800,
    height: 10,
    borderRadius: 1000,
    zIndex: 10000,
  },
  answer: {
    fontSize: 12,
    zIndex: 10000,
    fontStyle: "normal",
  },
  outputText: {
    marginVertical: 30,
  },
  tinyLogo: {
    width: 25,
    height: 25,
    borderRadius: 1000,
    alignItems: "flex-end",
    alignSelf: "flex-end",
    marginTop: -30,
    marginRight: 15,
    zIndex: 3000,
  },


  imageContainer: {
    height: "100%",
    width: "120%",
    marginHorizontal: -35,
    top: 23,


  },

  galleryButton: {
    borderRadius: 1000,
    marginTop: 30,
    color: "#5f5fff",

    justifyContent: "center",
    flex: 1,
    zIndex: 10000,
  },
  galleryIcon: {
    width: 30,
    height: 30,
    borderRadius: 1000,
    zIndex: 30000,
  },

  listContainer: {

    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: "center",
    alignItems: "center",

  },
  listItem: {
    marginRight: 10,
  },
  styleButtons: {
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
  },
  separator: {
    width: 5,
  },
  selectedIcon: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: "#5f5fff",
    borderRadius: 10,
  },
  itemName: {
    fontSize: 10,
    color: "#333",
  },
  card: {

 
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
     width: "108%",
    borderRadius: 30,
    marginHorizontal: -14,
    zindex: 100000
  },
  styleContainer:   
{
  marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",

    width: "120%",
    marginHorizontal: -20,
  },
Indicator: {

    top: -130,
  
  },

});
