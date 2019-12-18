'use strict';

import { Entrance, Package } from "miot";
import { strings, Styles } from 'miot/resources';
import { localStrings as LocalStrings } from './MHLocalizableString.js';
import { CommonSetting, SETTING_KEYS } from "miot/ui/CommonSetting";
import { firstAllOptions, secondAllOptions } from "miot/ui/CommonSetting/CommonSetting";
import { ListItem, ListItemWithSlider, ListItemWithSwitch } from 'miot/ui/ListItem';
import Separator from 'miot/ui/Separator';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const { first_options, second_options } = SETTING_KEYS;

export default class Setting extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      sliderValue: 25,
      switchValue: false,
      showDot: [],
    }
  }

  render () {
    // 显示部分一级菜单项
    const firstOptions = [
      first_options.SHARE,
      first_options.IFTTT,
      first_options.MEMBER_SET,

    ]
    // 显示部分二级菜单项
    const secondOptions = [

    ]
    // 显示固件升级二级菜单
    const extraOptions = {
      showUpgrade: true,
      excludeRequiredOptions: [firstAllOptions.LOCATION, secondAllOptions.SECURITY],
      option: {
        privacyURL: LocalStrings.getLanguage() == "en" ? require('../resources/privacy_en.htm') : require('../resources/privacy_china.htm'),
        agreementURL: LocalStrings.getLanguage() == "en" ? require('../resources/use_en.htm') : require('../resources/use_china.htm'),
        experiencePlanURL: '',
        hideUserExperiencePlan: true,
      },
      syncDevice: true,
      networkInfoConfig: 0,
    }
    return (
      <View style={styles.container}>
        <Separator />
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[styles.blank, { borderTopWidth: 0 }]} />
          <View style={styles.featureSetting}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{strings.featureSetting}</Text>
            </View>
            <Separator style={{ marginLeft: Styles.common.padding }} />
            <ListItem
              title={LocalStrings.ProgramEdit}
              showDot={false}
              onPress={_ => {
                this.props.navigation.navigate(
                  'WashEdit'
                )
              }}
            />
          </View>
          <View style={styles.blank} />
          <CommonSetting
            navigation={this.props.navigation}
            firstOptions={firstOptions}
            showDot={this.state.showDot}
            secondOptions={secondOptions}
            extraOptions={extraOptions}
          />
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    );
  }

  onValueChange (value) {
    console.log(value);
  }

  onSlidingComplete (value) {
    console.log(value);
  }

  componentDidMount () {
    // TODO: 拉取功能设置项里面的初始值，比如开关状态，slider的value
    this.setState({
      switchValue: true,
      sliderValue: 75,
      showDot: [
        first_options.FIRMWARE_UPGRADE
      ]
    })
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: Styles.common.backgroundColor,
    flex: 1,
  },
  featureSetting: {
    backgroundColor: '#fff',
  },
  blank: {
    height: 8,
    backgroundColor: Styles.common.backgroundColor,
    borderTopColor: Styles.common.hairlineColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Styles.common.hairlineColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleContainer: {
    height: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: Styles.common.padding,
  },
  title: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
    lineHeight: 14,
  }
});
