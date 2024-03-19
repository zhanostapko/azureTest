import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Checkbox from "expo-checkbox";
import { Color } from "../styles/GlobalStyles";
import Logo from "../../assets/images/logo.svg";
import backgroundLogin from "../../assets/images/backgroundLogin.png";
import loginAircraft from "../../assets/images/loginAircraft.png";
import { AppContext } from "../context/AppContext";

type User = {
  code: string;
  password: string;
};

const Main = () => {
  const [user, setUser] = useState({} as User);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);
  const context = useContext(AppContext);

  const submitHandler = async () => {
    setError(null);
    if (!user.code || !user.password) {
      setError("Please, fill in username and password");
      return null;
    }
    setIsLoading(true);

    const body = {
      password: user.password,
      code: user.code,
    };


    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/Security/CreateToken`,
        {
          method: "POST",
          headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.status === 401 || response.status === 500) {
        setError("Username or password is incorrect.");
      } else if (response.status === 200) {
        const token = await response.json();

        context.setUser(token);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkboxChangeHandler = () => {
    setCheckboxState((prevState) => !prevState);
  };

  const codeHandler = (newValue: string) => {
    setUser((prevState) => {
      return { ...prevState, code: newValue };
    });
  };
  const passwordHandler = (newValue: string) => {
    setUser((prevState) => {
      return { ...prevState, password: newValue };
    });
  };
  return (
    <View style={styles.screenContainer}>
      <StatusBar hidden />
      <Image
        style={styles.backgroundImage}
        resizeMode="stretch"
        source={backgroundLogin}
      />
      <Image source={loginAircraft} style={styles.aircraft} />

      <View style={styles.dataContainer}>
        <Logo />
        <View style={styles.shadows}>
          <View style={styles.form}>
            <View style={styles.titleStyle}>
              <Text style={styles.welcome}>Welcome!</Text>
              <Text style={styles.loginTitle}>Log in to Your Account.</Text>
            </View>
            <View style={styles.inputsContainer}>
              <View style={styles.inputForm}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  onChangeText={codeHandler}
                  placeholder="Enter code.."
                  value={user.code}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputForm}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  secureTextEntry
                  onChangeText={passwordHandler}
                  placeholder="Enter password"
                  value={user.password}
                  style={styles.input}
                />
              </View>
              <Pressable onPress={checkboxChangeHandler}>
                <View style={styles.checkbox}>
                  <Checkbox
                    onValueChange={checkboxChangeHandler}
                    color="rgba(46, 87, 250, 1)"
                    value={checkboxState}
                    style={styles.toggle}
                  />
                  <Text style={styles.checkboxLabel}>Remember me</Text>
                </View>
              </Pressable>
            </View>

            <Pressable
              onPressIn={submitHandler}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: !pressed
                    ? "rgba(46, 87, 250, 1)"
                    : "#2747c7",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  screenContainer: {
    position: "relative",
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: "30%",
    width: "100%",
  },
  aircraft: {
    width: 105,
    height: 150,
    position: "absolute",
    right: 0,
    bottom: 86,
    zIndex: 10,
  },
  dataContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    justifyContent: "space-around",
    alignItems: "center",
  },
  shadows: {
    // backgroundColor: "pink",
    alignSelf: "stretch",
    flexShrink: 0,
    shadowColor: "rgba(76, 93, 112, 0.15)",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 16,
  },
  form: {
    backgroundColor: "rgba(228, 228, 238, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 48,
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 16,
  },
  titleStyle: {
    flexShrink: 0,
    height: 72,
    width: 177,
  },
  welcome: {
    position: "absolute",
    flexShrink: 0,
    left: 32.5,
    width: 113,
    height: 32,
    textAlign: "left",
    color: "rgba(55, 57, 61, 1)",
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 32,
  },
  loginTitle: {
    position: "absolute",
    flexShrink: 0,
    top: 48,
    left: 0.5,
    width: 177,
    height: 24,
    textAlign: "left",
    color: "rgba(115, 118, 128, 1)",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 24,
  },
  inputsContainer: {
    width: "90%",
    gap: 16,
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 8,
  },
  label: {
    color: "rgba(55, 57, 61, 1)",
    fontFamily: "Inter",
  },
  inputForm: {
    height: 68,
  },
  content: {
    alignSelf: "stretch",
    flexShrink: 0,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 1)",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(208, 211, 218, 1)",
    borderRadius: 8,
  },
  placeholdertext: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: "left",
    color: "rgba(115, 118, 128, 1)",
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 20,
  },
  checkbox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  toggle: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderColor: "rgba(208, 211, 218, 1)",
    borderRadius: 2,
    width: 16,
    height: 16,
  },
  checkboxLabel: {
    lineHeight: 24,
    color: "rgba(55, 57, 61, 1)",
  },
  button: {
    height: 40,
    backgroundColor: "rgba(46, 87, 250, 1)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "500",
  },
  master: {
    flexShrink: 0,

    alignItems: "flex-start",
    rowGap: 0,
  },
});
