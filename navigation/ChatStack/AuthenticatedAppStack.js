import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Easing, Animated, Dimensions } from "react-native";


// drawer
import CustomDrawerContent from "./../Menu";

//Stacks
import ChatStack from "./../CommonStacks/ChatStacks"
import NotificationsStack from "./../CommonStacks/NotificationsStack"
import ProfileStack from "./../CommonStacks/ProfileStack"


const { width } = Dimensions.get("screen");
const Drawer = createDrawerNavigator();




export default function  PublicAppStack(props) {
    return (
      <Drawer.Navigator
        screenOptions={{headerShown: false}}
        style={{ flex: 1 }}
        drawerContent={props => <CustomDrawerContent {...props} screens={[
          {"title":Language.chats,'link':"Chats"},
          {"title":Language.profile,'link':"Profile"},
        ]} />}
        drawerStyle={{
          backgroundColor: "white",
          width: width * 0.8
        }}
        drawerContentOption={{
          activeTintcolor: "white",
          inactiveTintColor: "#000",
          activeBackgroundColor: "transparent",
          itemStyle: {
            width: width * 0.75,
            backgroundColor: "transparent",
            paddingVertical: 16,
            paddingHorizonal: 12,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            overflow: "hidden"
          },
          labelStyle: {
            fontSize: 18,
            marginLeft: 12,
            fontWeight: "normal"
          }
        }}
        initialRouteName="Chats"
      >
        <Drawer.Screen name="Chats" component={ChatStack} />
        <Drawer.Screen name="Profile" component={ProfileStack} />
      </Drawer.Navigator>
    );
  }