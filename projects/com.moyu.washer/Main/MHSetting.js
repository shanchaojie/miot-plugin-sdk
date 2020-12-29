'use strict';

import React from 'react';

import { localStrings as LocalStrings } from './MHLocalizableString.js';

import { Device, Package, Host, DeviceEvent } from "miot";

// var WashEdit = require('./WashEdit');

import {
  StyleSheet,
  Text,
  ListView,
  View,
  Image,
  TouchableHighlight,
  Component,
  StatusBar,
  ScrollView,
  DeviceEventEmitter,
  Platform,
  PixelRatio,
  Dimensions,
} from 'react-native';

var window = Dimensions.get('window');
var ratio = window.width / 375;
var ScreenWidth = window.width;
var ScreenHeight = window.height;

import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const isIPad = ScreenWidth >= 768 ? true : false;
const iphonexTop = isIphoneX() ? 24 : 0;

var BUTTONS = [
  '测试对话框',
  '确定',
];

export default class MHSetting extends React.Component {
  constructor(props, context) {
    super(props, context);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this._createMenuData();

    this.state = {

      dataSource: ds.cloneWithRowsAndSections(this._menuData),
    };

  }
  UNSAFE_componentWillMount () {
  }
  componentDidUnMount () {
    this._deviceNameChangedListener.remove();
  }
  _createMenuData () {
    var commonMenuData = [];
    var featureMenuData = [];
    var resetMenuData = [];//listView的footerView好像不支持，用一个section来模拟
    if (Device.isOwner) // 非分享设备
    {
      commonMenuData = [
        {
          'name': LocalStrings.deviceName,
          'subtitle': LocalStrings.deviceName,
          'func': () => {
            //不支持替换设备名字
          }
        },
        {
          // 'name': LocalStrings.how,
          'name': LocalStrings.locationManagement,
          'func': () => {
            Host.ui.openRoomManagementPage();
          }
        },
        {
          'name': LocalStrings.shareDevice,
          'func': () => {
            Host.ui.openShareDevicePage();
          }
        },
        {
          'name': LocalStrings.ifttt,
          'func': () => {
            Host.ui.openIftttAutoPage();
          }
        },
        {
          'name': LocalStrings.UseHelp,
          'func': () => {
            Host.ui.openFeedbackInput();
          }
        },
        {
          'name': LocalStrings.addToDesktop,
          'func': () => {
            Host.ui.openAddToDesktopPage();
          }
        },
        {
          'name': LocalStrings.licenseAndPolicy,
          'func': () => {
            // if (MHPluginSDK.apiLevel >= 133) {
            if (LocalStrings.getLanguage() == "en") {

              // MHPluginSDK.privacyAndProtocolReview(LocalStrings.License, "http://moyu.haijiacp.com/mobile/terms_of_use_en.html", LocalStrings.Policy, "http://moyu.haijiacp.com/mobile/privacy_agreement_en.html");

            } else {

              // MHPluginSDK.privacyAndProtocolReview(LocalStrings.License, "http://moyu.haijiacp.com/mobile/terms_of_use_1.html", LocalStrings.Policy, "http://moyu.haijiacp.com/mobile/privacy_agreement_1.html");
            }

            // } else if (MHPluginSDK.apiLevel >= 129) {
            //   MHPluginSDK.reviewPrivacyAndProtocol();
            // } else {

            // }
          }
        },

      ];

      featureMenuData = [
        {
          'name': LocalStrings.ProgramEdit,
          'func': () => {
            //程序编辑
            // this.props.navigation.navigate(
            //   'WashEdit'
            // )
          }
        }

      ];

      resetMenuData = [
        {
          'name': LocalStrings.resetDevice,
          'func': () => {
            Host.ui.openDeleteDevice();
          }
        },
      ];
    }
    var featureSetting = LocalStrings.featureSetting;
    var commonSetting = LocalStrings.commonSetting;
    this._menuData = {};
    this._menuData[featureSetting] = featureMenuData;
    this._menuData[commonSetting] = commonMenuData;
    this._menuData[""] = resetMenuData;//不显示这个section的header，所以key为空
  }

  render () {
    return (
      <View style={{ backgroundColor: 'rgb(235,235,236)', marginTop: 0, marginBottom: 0, flex: 1 }}>
        <View style={{ backgroundColor: 'rgb(174,174,174)', height: 1, }}></View>
        <ScrollView style={{ backgroundColor: 'rgb(235,235,236)' }}>
          <View style={styles.container}>
            <StatusBar barStyle='default' />
            <ListView style={styles.list} dataSource={this.state.dataSource} renderRow={this._renderRow.bind(this)} renderSectionHeader={this._renderSectionHeader.bind(this)} />
          </View>
        </ScrollView>
      </View>
    );
  }

  _renderSectionHeader (sectionData, sectionID) {
    return (
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{sectionID}</Text>
        </View>
      </View>
    );
  }
  _renderRow (rowData, sectionID, rowID) {
    if (sectionID != '') {
      return (
        <TouchableHighlight onPress={() => this._pressRow(sectionID, rowID)}>
          <View style={{ backgroundColor: '#ffffff' }}>
            <View style={styles.rowContainer}>
              <Text style={styles.title}>{rowData.name}</Text>
            </View>
            <View style={rowID != this._menuData[sectionID].length - 1 ? styles.separator : {}}></View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight onPress={() => this._pressRow(sectionID, rowID)}>
          <View style={{ backgroundColor: '#ffffff' }}>
            <View style={styles.rowContainer}>
              <Text style={styles.reset}>{rowData.name}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  }

  _pressRow (sectionID, rowID) {
    console.log("sectionID" + sectionID + "row" + rowID + "clicked!");
    this._menuData[sectionID][rowID].func();
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(235,235,236)',
    // marginBottom: 0,
    // marginTop: 64,
  },

  rowContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    // padding: 20,
    backgroundColor: '#ffffff',
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  sectionHeader: {
    height: 30,
    backgroundColor: 'rgb(235,235,236)',
    justifyContent: 'center',
    // padding:10,
    marginLeft: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
  },
  list: {
    alignSelf: 'stretch',
  },

  title: {
    // alignSelf: 'stretch',
    fontSize: 16,
    // alignItems: 'center',
    flex: 2,
    // height:49,
  },
  reset: {
    // alignSelf: 'stretch',
    fontSize: 16,
    // alignItems: 'center',
    flex: 1,
    // height:49,
    color: 'rgb(251,0,0)',
    textAlign: 'center'
  },
  subtitle: {
    // alignSelf: 'stretch',
    fontSize: 14,
    // alignItems: 'center',
    flex: 1,
    color: 'rgb(138,138,138)',
    textAlign: "right",
    marginRight: 5

  },
  subArrow: {
    width: 6.5,
    height: 13,
  },
  separator: {
    height: 0.75,
    backgroundColor: '#dddddd',
    marginLeft: 20,
    marginRight: 20
  }
});

