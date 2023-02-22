import React, { useCallback, useEffect, useState, } from 'react';
import { Text, View, StyleSheet, Switch, useWindowDimensions, SafeAreaView } from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenFontSize
} from "react-native-responsive-dimensions";


Text.defaultProps = Text.defaultProps || {}; //Disable dynamic type in IOS
Text.defaultProps.allowFontScaling = false;


export function Bulion() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  return (
    <View
      // style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      style={styles.container}>
      <View style={{
        backgroundColor: 'white', shadowColor: 'black',
        shadowOpacity: 0.45,
        shadowOffset: { width: 0, height: '25%' },
        shadowRadius: '30%',
        borderRadius: '5%',
      }}>
        <View style={{
          backgroundColor: '#151718', height: responsiveHeight(3.1), width: responsiveWidth(77),
          flexDirection: "row",
          alignItems: 'center',
          borderTopStartRadius: '5%',
          borderTopEndRadius: '5%',
        }}>
          <View style={styles.circlered}></View>
          <View style={styles.circley}></View>
          <View style={styles.circleg}></View>
        </View>
        <View style={{
          backgroundColor: 'white', flexDirection: "row", height: responsiveHeight(53), width: responsiveWidth(77),
          borderBottomEndRadius: '5%',
          borderBottomStartRadius: '5%',
        }}>
          <View style={styles.byl}>
            <Text style={styles.text}>Буль</Text>
          </View>
          <View style={styles.on}>
            {isEnabled ? <Text style={styles.textON}>on</Text> : <Text style={styles.textOFF}>off</Text>}
          </View>
          <View style={styles.sw}>
            <Switch
              style={styles.verticalSwitch}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text12: {
    fontSize: 9,
    color: 'blak',
  },
  container: {

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  byl: {
    justifyContent: 'center',
    marginLeft: responsiveWidth(12.5),
  },
  on: {
    justifyContent: 'center',
  },
  sw: {
    marginRight: responsiveWidth(12.5),
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  verticalSwitch: {

    transform: [{ rotate: '-90deg' }, { scaleX: responsiveWidth(0.4) }, { scaleY: responsiveWidth(0.4) }]
  },
  text: {
    fontSize: responsiveFontSize(5.7),
    color: 'blak',
  },
  textON: {
    fontSize: responsiveFontSize(5.7),
    color: 'green',
  },
  textOFF: {
    fontSize: responsiveFontSize(5.7),
    color: 'red',
  },
  // textOFF: {
  //   fontSize: responsiveFontSize(5.7),
  //   color: 'red',
  // },
  circlered: {
    backgroundColor: '#ff5f56',
    width: responsiveWidth(3.7),
    height: responsiveWidth(3.7),
    borderRadius: responsiveWidth(3.7) / 2,
    marginLeft: responsiveWidth(3.2)
  },
  circley: {
    backgroundColor: '#ffbd2e',
    width: responsiveWidth(3.7),
    height: responsiveWidth(3.7),
    borderRadius: responsiveWidth(3.7) / 2,
    marginLeft: responsiveWidth(1.4)
  },
  circleg: {
    backgroundColor: '#27c93f',
    width: responsiveWidth(3.7),
    height: responsiveWidth(3.7),
    borderRadius: responsiveWidth(3.7) / 2,
    marginLeft: responsiveWidth(1.4)
  }
});

