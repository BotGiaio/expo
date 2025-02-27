import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Linking,
  View
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import config from '../config';
import { Button } from "../components";
import { Images, argonTheme, Language } from "../constants";
import { HeaderHeight } from "../constants/utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("screen");
import { useSharedState } from './../store/store';
import userFunctions from './../services/user'
import { TouchableOpacity } from "react-native-gesture-handler";
import User from './../services/user';
var md5 = require('md5');
import AuthContext from './../store/auth'
import Fancy from "./../components/Fancy"
import API from "./../services/api"



const thumbMeasure = (width - 48 - 32) / 3;


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:{

      },
      action:null,
    };
    this.getCurrentUser=this.getCurrentUser.bind(this);
  }

  componentDidMount(){
    this.getCurrentUser();
  }

  async getCurrentUser(){
    var userJSON = await AsyncStorage.getItem('user');
    if (userJSON !== null) {
      var parsedUser=JSON.parse(userJSON)
      this.setState({
        user:parsedUser
      })
     }
  }

  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>


                 {/* Account delete */}
                 <AuthContext.Consumer>
                 {({  signOut }) => (
                 <Fancy 
                        color="red"
                        buttonColor="red"
                        visible={this.state.action=="accDelete"} 
                        icon_ios={'trash-bin-outline'} icon_android="trash-bin-outline"
                        title={Language.close_account} subtitle={Language.close_account_info}
                        button={Language.ok} closeAction={()=>{this.setState({action:""})}}
                        action={()=>{
                          API.deactivateUser((responseJson)=>{
                            console.log(JSON.stringify(responseJson));
                            this.setState({action:""})
                            signOut();
                          },()=>{
                            //Error call back
                          });
                        
                        }}
                        ></Fancy>
                        )}
                  </AuthContext.Consumer>


                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{ uri: this.state.user.email? "https://www.gravatar.com/avatar/"+md5(this.state.user.email)+"?s=200&d=https%3A%2F%2Fcdn1.iconfinder.com%2Fdata%2Ficons%2Fflat-business-icons%2F128%2Fuser-512.png":"" }}
                    style={styles.avatar}
                  />
                </Block>
                
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {this.state.user.name}
                      
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    {this.state.user.email}
                    </Text>

                    <TouchableOpacity style={{marginTop:10}} onPress={()=>{this.setState({action:"accDelete"})}}>
                        <Text
                          size={14}
                          muted
                          style={{ textAlign: "center", color:"red", opacity:0.5 }}
                        >
                        {Language.deleteAccount}
                        </Text>
                      </TouchableOpacity>

                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>

                  <Block middle>
                    <AuthContext.Consumer>
                     {({  signOut }) => (

                      <TouchableOpacity onPress={signOut}>
                        <Text
                          size={16}
                          muted
                          style={{ textAlign: "center" }}
                        >
                        {Language.logout}
                        </Text>
                      </TouchableOpacity>

                      
                    )}
                    </AuthContext.Consumer>
                    

                  </Block>

                  
                 
                  
                  
                  
                 
                


                </Block>
              </Block>
            </ScrollView>
            
          </ImageBackground>

        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Profile;
