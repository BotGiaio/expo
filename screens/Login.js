import React, { useContext, useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Image,
    Linking,
    Platform,
    Button // Importa el Button de React Native
} from "react-native";
import { Block, Text } from "galio-framework";
import config from '../config';
import { Icon, Input } from "../components"; // Elimina Button de aquí
import { Images, argonTheme, Language } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");
import AuthContext from './../store/auth'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null; // Importante: Retornar null si no se obtienen los permisos
        }
        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });
        console.log("We get the token");
        console.log(token);
        return token.data; // Importante: Retornar solo el token
    } else {
        alert('Must use physical device for Push Notifications');
        return null; // Importante: Retornar null si no es un dispositivo físico
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return null; // Si llegamos aquí por alguna razón, retornar null
}


const Login = ({ navigation }) => {


    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //const [expoPushToken, setExpoPushToken] = useState(""); // Eliminar: No necesitamos un estado para esto
    const [notification, setNotification] = useState(undefined);
    const notificationListener = useRef < Notifications.Subscription > (undefined);
    const responseListener = useRef < Notifications.Subscription > (undefined);


    useEffect(() => {
        // No registramos el token aquí.  Lo haremos DESPUÉS de iniciar sesión
        // registerForPushNotificationsAsync().then(
        //   token => setExpoPushToken(token)
        // );

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification received");
            console.log(notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, []);


    const handleLogin = async () => { // Crear una función async para manejar el inicio de sesión
        console.log('handleLogin llamada!'); // <--- Agrega esto al principio
        try {
            const token = await registerForPushNotificationsAsync(); // Obtener el token ANTES de iniciar sesión
            console.log('Token obtenido:', token); // <--- Agrega esto
            if (token) {
                console.log('Token es válido, llamando a signIn'); // <--- Agrega esto
                // Agregamos el console.log aquí para verificar el token antes de enviarlo
                console.log('Enviando a la API:', {
                    email: email,
                    password: password,
                    expotoken: token,
                });

                signIn({ email: email, password: password, expoPushToken: token }); // Pasar el token a la función signIn
            } else {
                console.log('Token es nulo, llamando a signIn con null'); // <--- Agrega esto
                signIn({ email: email, password: password, expoPushToken: null }); // Pasar null si no hay token
                console.log("No se pudo obtener el token de push antes de iniciar sesión.");
            }

        } catch (error) {
            console.error("Error al registrar el token:", error);
            signIn({ email: email, password: password, expoPushToken: null }); // Pasar null en caso de error
        }
    };


    return (
        <Block flex middle>
            <StatusBar hidden />
            <ImageBackground
                source={Images.RegisterBackground}
                style={{ width, height, zIndex: 1 }}
            >
                <Block flex middle>
                    <Block style={styles.registerContainer}>

                        <Block flex>
                            <Block flex={0.17} middle style={{ marginTop: 20 }}>
                                <Image source={{ uri: Images.RemoteLogo }} style={{ width: (244), height: (config.LOGOHeight * (244 / config.LOGOWidth)) }} />
                                <Text muted></Text>
                            </Block>
                            <Block flex center>
                                <KeyboardAvoidingView
                                    style={{ flex: 1 }}
                                    behavior="padding"
                                    enabled
                                >

                                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                        <Input
                                            value={email}
                                            borderless
                                            onChangeText={text => setEmail(text)}
                                            placeholder={"Email"}
                                            iconContent={
                                                <Icon
                                                    size={16}
                                                    color={argonTheme.COLORS.ICON}
                                                    name="ic_mail_24px"
                                                    family="ArgonExtra"
                                                    style={styles.inputIcons}
                                                />
                                            }
                                        />
                                    </Block>


                                    <Block width={width * 0.8}>
                                        <Input
                                            value={password}
                                            password
                                            borderles
                                            placeholder={"Password"}
                                            onChangeText={text => setPassword(text)}
                                            iconContent={
                                                <Icon
                                                    size={16}
                                                    color={argonTheme.COLORS.ICON}
                                                    name="padlock-unlocked"
                                                    family="ArgonExtra"
                                                    style={styles.inputIcons}
                                                />
                                            }
                                        />

                                    </Block>

                                    <Block row space="evenly" style={{ marginVertical: 10 }} >
                                        <Block>
                                            <TouchableOpacity onPress={() => Linking.openURL(config.domain + "/password/reset").catch(err => console.error("Couldn't load page", err))} >
                                                <Text size={14} color={argonTheme.COLORS.PRIMARY}>
                                                    {Language.forgotPassword}
                                                </Text>
                                            </TouchableOpacity>
                                        </Block>
                                        <Block style={{ opacity: config.disableRegister ? 0 : 1 }}>
                                            <TouchableOpacity onPress={config.disableRegister ? null : () => navigation.navigate('Register')} >
                                                <Text size={14} color={argonTheme.COLORS.PRIMARY}>
                                                    {Language.register}
                                                </Text>
                                            </TouchableOpacity>
                                        </Block>

                                    </Block>

                                    <Block middle>
                                        {/* Usar la función handleLogin aquí */}
                                        <Button
                                            title="Login"
                                            onPress={handleLogin}
                                        />
                                    </Block>

                                </KeyboardAvoidingView>
                            </Block>
                        </Block>



                    </Block>
                </Block>
            </ImageBackground>
        </Block>
    );
};

export default Login;


const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.78,
        backgroundColor: "#F4F5F7",
        borderRadius: 4,
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden"
    },
    socialConnect: {
        backgroundColor: argonTheme.COLORS.WHITE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#8898AA"
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: "#fff",
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: argonTheme.COLORS.PRIMARY,
        fontWeight: "800",
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25
    }
});