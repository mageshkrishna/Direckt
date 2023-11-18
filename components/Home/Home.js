import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import logo from "../Home/DirecktLogo.png";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  function handlebutton(e) {
    Alert.alert("You are a " + e);
  }
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.box1}>
          <Image source={logo} />
        </View>
        <View style={styles.box2}>
          <Text>Buy Whatever & </Text>
          <Text>from Wherever you want</Text>
        </View>

        <View style={styles.box3}>
          <Svg
            height="80%"
            width="180%"
            viewBox="0 0 1440 320"
            style={{ position: "fixed" }}
          >
            <Path
              fill="#8A57E4"
              d="M0,128L40,149.3C80,171,160,213,240,213.3C320,213,400,171,480,133.3C560,96,640,64,720,64C800,64,880,96,960,90.7C1040,85,1120,43,1200,58.7C1280,75,1360,149,1400,186.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            />
          </Svg>
        </View>
        <View style={styles.box4}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>
              Get Started
            </Text>
            <Text style={{ color: "#f1f1f1" }}>Choose one?</Text>
          </View>
          <View style={{ flex: 2 }}>
            <TouchableOpacity
              underlayColor="white"
              onPress={(e) => {
                navigation.navigate("Logincustomer");
              }}
            >
              <View style={styles.cusbutton}>
                <Text style={styles.cusbuttonText}>I am a Customer</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              underlayColor="white"
              onPress={(e) => {
                handlebutton("Shop Owner");
              }}
            >
              <View style={styles.ownbutton}>
                <Text style={styles.ownbuttonText}>I am a Shop Owner</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box1: {
    flex: 4,
  },
  box2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  box3: {
    flex: 3,
    backgroundColor: "white",
    justifyContent: "flex-end",
  },
  box4: {
    flex: 5,
    backgroundColor: "#8A57E4",
    alignItems: "center",
    justifyContent: "center",
  },
  cusbutton: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 50,
  },
  ownbutton: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#B287FF",
    borderRadius: 50,
  },
  cusbuttonText: {
    textAlign: "center",
    padding: 20,
    color: "#8A57E4",
  },
  ownbuttonText: {
    textAlign: "center",
    padding: 20,
    color: "white",
  },
});
