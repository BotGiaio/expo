import React from "react";
import { StyleSheet, TouchableWithoutFeedback, Image } from "react-native";
import PropTypes from "prop-types";
import { Block, Text } from "galio-framework";
import Icon from "./Icon";
import { argonTheme } from "../constants";

export default class Conversation extends React.Component {
  render() {
    const {
      body,
      color,
      iconColor,
      iconFamily,
      iconName,
      iconSize,
      onPress,
      style,
      system,
      time,
      title,
      avatar,
      transparent,
      is_last_message_by_contact
    } = this.props;

    const iconContainer = [
      styles.iconContainer,
      { backgroundColor: color || argonTheme.COLORS.PRIMARY },
      system && { width: 34, height: 34 },
      !system && styles.iconShadow
    ];

    const container = [
      styles.card,
      !transparent && { backgroundColor: argonTheme.COLORS.WHITE },
      !transparent && styles.cardShadow,
      system && { height: 78 },
      style
    ];
    return (
      <Block style={container} middle>
        <TouchableWithoutFeedback onPress={onPress}>
          <Block row style={{ width: "95%" }}>
            <Block top flex={system ? 0.12 : 0.2} middle>
              <Block middle style={iconContainer}>
              <Image
                source={{ uri: avatar }}
                style={[styles.avatar, styles.shadow]}
              />
              </Block>
            </Block>
            <Block flex style={{ paddingRight: 3, paddingLeft: 12 }}>
              {system && (
                <Block row space="between" style={{ height: 18 }}>
                  <Text color={argonTheme.COLORS.BLACK} style={{ fontFamily: 'open-sans-bold', fontWeight:'bold' }}   size={13}>{title}</Text>
                  <Block row style={{ marginTop: 3 }}>
                    <Icon
                      family="material-community"
                      name="clock"
                      size={12}
                      color={is_last_message_by_contact+""=="0"?argonTheme.COLORS.MUTED:argonTheme.COLORS.WHATSAPP_COLOR}
                    />
                    <Text
                      color={is_last_message_by_contact+""=="0"?argonTheme.COLORS.MUTED:argonTheme.COLORS.WHATSAPP_COLOR}
                      style={{
                        
                        marginLeft: 3,
                        marginTop: -3
                      }}
                      size={12}
                    >
                      {time}
                    </Text>
                  </Block>
                </Block>
              )}
              <Text
                color={argonTheme.COLORS.TEXT}
                size={system ? 13 : 14}
                
              >
                {body}
              </Text>
              <Block  style={{ opacity:0.5, marginTop:15, width: "100%", height: 1, backgroundColor: argonTheme.COLORS.BORDER }} />
            </Block>
            {!system && (
              <Block row flex={0.2} style={{ marginTop: 3 }}>
                <Icon
                  family="material-community"
                  name="clock"
                  size={12}
                  color={argonTheme.COLORS.MUTED}
                />
                <Text
                  color={argonTheme.COLORS.MUTED}
                  style={{
                   
                    marginLeft: 3,
                    marginTop: -2
                  }}
                  size={12}
                >
                  {time}
                </Text>
              </Block>
            )}
          </Block>
        </TouchableWithoutFeedback>

        
      </Block>
    );
  }
}

Conversation.propTypes = {
  body: PropTypes.string,
  color: PropTypes.string,
  iconColor: PropTypes.string,
  iconFamily: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  onPress: PropTypes.func,
  style: PropTypes.object,
  system: PropTypes.bool,
  time: PropTypes.string,
  title: PropTypes.string,
  transparent: PropTypes.bool,
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginTop: 2
  },
  iconShadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  card: {
    zIndex: 2,
    height: 127,
    borderRadius: 6
  },
  cardShadow: {
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginBottom: 0
  }
});
