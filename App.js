import { StatusBar } from 'expo-status-bar';
import React from "react";
import { Image, Alert } from "react-native";
import { StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from "expo-asset";
import Toast from 'react-native-toast-message';
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from 'react-native';
import * as Notifications from "expo-notifications";

LogBox.ignoreAllLogs(); // Ignore log notification by message

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import { Block, GalioProvider } from "galio-framework";
import config from './config';

// App Screens
import Screens from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';
import { SharedStateProvider } from './store/store';
import 'expo-asset';

// Cache app images
const assetImages = [
  Images.noData,
  Images.RemoteLogo
];

// Cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  return token;
}

async function sendPushTokenToServer(userId) {
  const pushToken = await registerForPushNotificationsAsync();

  if (pushToken) {
    console.log('Enviando a la API - userId:', userId, 'pushToken:', pushToken); // Agrega este log

    try {
      const response = await fetch('https://api.botgia.com/push-token/store', {  // Reemplaza con la URL correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Reemplaza con el ID del usuario obtenido durante el inicio de sesión
          pushToken: pushToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Push token enviado y guardado correctamente en el servidor');
      } else {
        console.error('Error al enviar el push token al servidor:', data.error);
      }
    } catch (error) {
      console.error('Error al enviar el push token al servidor:', error);
    }
  }
}

// Ejemplo de cómo llamar a la función después del inicio de sesión
// Suponiendo que tienes el userId disponible después del inicio de sesión
const handleLoginSuccess = (userId) => {
  sendPushTokenToServer(userId);
};

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
    expoPushToken: "",
  };

  async loadFonts() {
    await Font.loadAsync({
      'ArgonExtra': require('./assets/font/ArgonExtra.ttf')
    });
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    await this.loadFonts();

    const token = await registerForPushNotificationsAsync();
    if (token) {
      this.setState({ expoPushToken: token });

      fetch("https://api.botgia.com/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pushToken: token,
          title: "¡Hola!",
          body: "Notificación de prueba",
        }),
      })
      .then((response) => response.json())
      .then((data) => console.log("Respuesta API:", data))
      .catch((error) => console.error("Error:", error));
    }
  }

  render() {
    if (this.state.fontsLoaded) {
      return (
        <>
          <NavigationContainer>
            <GalioProvider theme={argonTheme}>
              <SharedStateProvider>
                <Block flex>
                  <Screens />
                </Block>
              </SharedStateProvider>
            </GalioProvider>
          </NavigationContainer>
          <Toast />
        </>
      );
    } else {
      return null;
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

