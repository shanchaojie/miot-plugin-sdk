'use strict';

import React from 'react';
import {
  StyleSheet,
  WebView,
  View,
  StatusBar,
  Platform,
  Navigator,
  PixelRatio,
  Dimensions,
  Text,
  Switch,
  ScrollView,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  PanResponder,

} from 'react-native';

import { ImageButton } from 'miot/ui';
import { Device, Package, Host, DeviceEvent } from "miot";
import * as Progress from 'react-native-progress';

var window = Dimensions.get('window');
var ratio = window.width / 375;
var ScreenWidth = window.width;
var ScreenHeight = window.height;


import { from } from 'rxjs';
import { localStrings as LocalStrings } from './MHLocalizableString.js';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';

import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "mijia.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;
let db;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const isIPad = ScreenWidth >= 768 ? true : false;
const iphonexTop = isIphoneX() ? 24 : 0;

export default class WasherModel extends React.Component {

  constructor(props, context) {
    super(props, context);
    //
    this.state = {
      wash_id: 0,//洗衣id
      washwl: 0,//水位选择：1档、2档、3档、4档
      washwl_list: [1, 2, 3, 4],
      washwlleft: 0,
      washwlprogress: 0,
      wash: 0,//洗涤时间，5个档位的值:5,10,15,20,25分钟
      wash_list: [5, 10, 15, 20, 25],
      washleft: 0,
      washprogress: 0,
      auto_wl: 0,//自动水位
      checkdirty: 0,//智能检测，智能漂洗
      rinse: 0,//漂洗次数：1次，2次，3次
      rinse_list: [1, 2, 3],
      rinseleft: 0,
      rinseprogress: 0,
      drier: 0,//脱水时间
      drierleft: 0,
      drierprogress: 0,
      drierIndex: 0,//脱水档位
      drier_list: [],//脱水时间选择范围,范例：1,2,3,4 表示4个时间点可以选择
      heat: 0,//加热温度40,50,60三个档位取值
      heat_list: [0, 40, 50, 60],
      heatleft: 0,
      heatprogress: 0,
      waterid: 0,//洗涤强度，0--16的取值
      wateridleft: 0,
      wateridprogress: 0,
      wateridIndex: 0,
      waterid_list: [],//洗涤强度的3个值：5,4,2，类似这样
      wlwarn: 0,//高温杀菌
      shower: 0,//淋漂
      soak: 0,//洗前浸泡
      modelObj: {},
      isCanScroll: true,
    };
  }

  render () {
    return (
      <View style={styles.container} >
        <StatusBar barStyle='default' />
        {this._modeWashView()}
        <View style={styles.buttonAllBack}>
          <TouchableOpacity onPress={this.buttonOnClick.bind(this)}>
            <View style={styles.buttonBack}>
              <Text style={{ fontSize: 15 * ratio, color: '#383939' }}>{LocalStrings.Set}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttonDivMid}></View>
          <TouchableOpacity onPress={this.buttonOffClick.bind(this)}>
            <View style={styles.buttonBack}>
              <Text style={{ fontSize: 15 * ratio, color: '#383939' }}>{LocalStrings.Cancel}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*{this._modeWashBaseView(1,1,1,"自动水位",null,"水位选择","1档")}*/}

      </View>
    );
  }

  //设置视图
  _modeWashView () {
    return (
      <ScrollView style={styles.scrollBack} scrollEnabled={this.state.isCanScroll}>
        {this._washwlBaseView(this.state.modelObj.washwl_show, this.state.modelObj.auto_wl_show, this.state.auto_wl, LocalStrings.Automaticwaterlevel, null, LocalStrings.WaterLevel, this.state.washwl, this._washpanResponder, this.state.washwlleft)}
        {this._washBaseView(this.state.modelObj.wash_show, 0, 0, null, null, LocalStrings.Washingtime, this.state.wash, this._washpanResponder, this.state.washleft)}
        {this._rinseBaseView(this.state.modelObj.rinse_show, this.state.modelObj.checkdirty_show, this.state.checkdirty, LocalStrings.SmartRinsing, null, LocalStrings.Rinsetimes, this.state.rinse, this._rinsepanResponder, this.state.rinseleft)}
        {this._drierBaseView(this.state.modelObj.drier_show, 0, 0, null, null, LocalStrings.Dehydrationtime, this.state.drier, this._drierpanResponder, this.state.drierleft)}
        {this._heatBaseView(this.state.modelObj.heat_show, 0, 0, null, null, LocalStrings.Heatingtemperature, this.state.heat, this._heatpanResponder, this.state.heatleft)}
        {this._wateridBaseView(this.state.modelObj.waterid_show, 0, 0, null, null, LocalStrings.Washingstrength, this.state.wateridIndex, this._wateridpanResponder, this.state.wateridleft)}
        <View style={styles.checkAllBack}>
          {this.checkView(this.state.modelObj.wlwarn_show, this.state.wlwarn, LocalStrings.Hightemperaturesterilization)}
          {this.checkView(this.state.modelObj.shower_show, this.state.shower, LocalStrings.Dripping)}
          {this.checkView(this.state.modelObj.soak_show, this.state.soak, LocalStrings.Soakbeforewashing)}
        </View>
      </ScrollView>
    );

  }


  //水位基础视图
  _washwlBaseView (isShow, isSWitch, switchType, switchTitle, switchDetail, washTitle, washContent) {
    if (isShow == 1) {
      //有switch
      return (
        <View style={styles.modeBaseBack}>
          {isSWitch == 1 ? (<View style={styles.modeBaseSwitchBack}>
            {switchDetail ? (<Text style={styles.switchDetail}>{switchDetail}</Text>) : null}
            <Text style={styles.switchTitle}>{switchTitle}</Text>
            <TouchableOpacity onPress={() => {
              if (washTitle == LocalStrings.WaterLevel) {
                this.setState({
                  auto_wl: switchType == 0 ? 1 : 0,
                });
              } else if (washTitle == LocalStrings.Rinsetimes) {
                this.setState({
                  checkdirty: switchType == 0 ? 1 : 0,
                })
              }
            }}>
              <Image style={styles.switchBack}
                source={switchType == 1 ? (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_on.png') : require('../resources/switch_on.png')) : (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_off.png') : require('../resources/switch_off.png'))}
                resizeMode={'stretch'}></Image>
            </TouchableOpacity>
          </View>) : null}
          <View style={styles.washBack}>
            <Text style={styles.washTitle}>{washTitle}</Text>
            <Text style={styles.washCon}>{washContent}{LocalStrings.Level}</Text>
          </View>
          <View {...this._washwlpanResponder.panHandlers} style={styles.slideBack} pointerEvents={this.state.auto_wl == 1 ? 'none' : 'auto'}>
            <Progress.Bar style={styles.washSlide} width={ScreenWidth - 46 * ratio} progress={this.state.washwlprogress} color={this.state.auto_wl == 1 ? '#525354' : '#37C6EE'} indeterminate={false} unfilledColor={'white'}/>
            <View style={[styles.slideCircle, { left: this.state.washwlleft }]}></View>
          </View>
        </View>
      )
    } else {
      //无switch
      return (null)
    }
  }
  //洗涤时间基础视图
  _washBaseView (isShow, isSWitch, switchType, switchTitle, switchDetail, washTitle, washContent) {
    if (isShow == 1) {
      //有switch
      return (
        <View style={styles.modeBaseBack}>
          {isSWitch == 1 ? (<View style={styles.modeBaseSwitchBack}>
            {switchDetail ? (<Text style={styles.switchDetail}>{switchDetail}</Text>) : null}
            <Text style={styles.switchTitle}>{switchTitle}</Text>
            <TouchableOpacity onPress={() => {
              if (washTitle == LocalStrings.WaterLevel) {
                this.setState({
                  auto_wl: switchType == 0 ? 1 : 0,
                });
              } else if (washTitle == LocalStrings.Rinsetimes) {
                this.setState({
                  checkdirty: switchType == 0 ? 1 : 0,
                })
              }
            }}>
              <Image style={styles.switchBack}
                source={switchType == 1 ? (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_on.png') : require('../resources/switch_on.png')) : (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_off.png') : require('../resources/switch_off.png'))}
                resizeMode={'stretch'}></Image>
            </TouchableOpacity>
          </View>) : null}
          <View style={styles.washBack}>
            <Text style={styles.washTitle}>{washTitle}</Text>
            <Text style={styles.washCon}>{washContent}{LocalStrings.Minute}</Text>
          </View>
          <View {...this._washpanResponder.panHandlers} style={styles.slideBack} >
              <Progress.Bar style={styles.washSlide} width={ScreenWidth - 46 * ratio} progress={this.state.washprogress} color={'#37C6EE'} indeterminate={false} unfilledColor={'white'}/>
              <View style={[styles.slideCircle, { left: this.state.washleft }]}></View>
          </View>
        </View>
      )
    } else {
      //无switch
      return (null)
    }
  }



  //漂洗次数基础视图
  _rinseBaseView (isShow, isSWitch, switchType, switchTitle, switchDetail, washTitle, washContent) {
    if (isShow == 1) {
      //有switch
      return (
        <View style={styles.modeBaseBack}>
          {isSWitch == 1 ? (<View style={styles.modeBaseSwitchBack}>
            {switchDetail ? (<Text style={styles.switchDetail}>{switchDetail}</Text>) : null}
            <Text style={styles.switchTitle}>{switchTitle}</Text>
            <TouchableOpacity onPress={() => {
              if (washTitle == LocalStrings.WaterLevel) {
                this.setState({
                  auto_wl: switchType == 0 ? 1 : 0,
                });
              } else if (washTitle == LocalStrings.Rinsetimes) {
                this.setState({
                  checkdirty: switchType == 0 ? 1 : 0,
                })
              }
            }}>
              <Image style={styles.switchBack}
                source={switchType == 1 ? (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_on.png') : require('../resources/switch_on.png')) : (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_off.png') : require('../resources/switch_off.png'))}
                resizeMode={'stretch'}></Image>
            </TouchableOpacity>
          </View>) : null}
          <View style={styles.washBack}>
            <Text style={styles.washTitle}>{washTitle}</Text>
            <Text style={styles.washCon}>{washContent}{LocalStrings.Times}</Text>
          </View>
          <View {...this._rinsepanResponder.panHandlers} style={styles.slideBack} pointerEvents={this.state.checkdirty == 1 ? 'none' : 'auto'}>
              <Progress.Bar style={styles.washSlide} width={ScreenWidth - 46 * ratio} progress={this.state.rinseprogress} color={this.state.checkdirty == 1 ? '#525354' : '#37C6EE'} indeterminate={false} unfilledColor={'white'}/>
              <View style={[styles.slideCircle, { left: this.state.rinseleft }]}></View>
          </View>
        </View>
      )
    } else {
      //无switch
      return (null)
    }
  }

  //脱水时间基础视图
  _drierBaseView (isShow, isSWitch, switchType, switchTitle, switchDetail, washTitle, washContent) {
    if (isShow == 1) {
      //有switch
      return (
        <View style={styles.modeBaseBack}>
          {isSWitch == 1 ? (<View style={styles.modeBaseSwitchBack}>
            {switchDetail ? (<Text style={styles.switchDetail}>{switchDetail}</Text>) : null}
            <Text style={styles.switchTitle}>{switchTitle}</Text>
            <TouchableOpacity onPress={() => {
              if (washTitle == LocalStrings.WaterLevel) {
                this.setState({
                  auto_wl: switchType == 0 ? 1 : 0,
                });
              } else if (washTitle == LocalStrings.Rinsetimes) {
                this.setState({
                  checkdirty: switchType == 0 ? 1 : 0,
                })
              }
            }}>
              <Image style={styles.switchBack}
                source={switchType == 1 ? (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_on.png') : require('../resources/switch_on.png')) : (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_off.png') : require('../resources/switch_off.png'))}
                resizeMode={'stretch'}></Image>
            </TouchableOpacity>
          </View>) : null}
          <View style={styles.washBack}>
            <Text style={styles.washTitle}>{washTitle}</Text>
            <Text style={styles.washCon}>{parseInt(washContent) + 4}{LocalStrings.Minute}</Text>
          </View>
          <View {...this._drierpanResponder.panHandlers} style={styles.slideBack}>
              <Progress.Bar style={styles.washSlide} width={ScreenWidth - 46 * ratio} progress={this.state.drierprogress} color={'#37C6EE'} indeterminate={false} unfilledColor={'white'}/>
              <View style={[styles.slideCircle, { left: this.state.drierleft }]}></View>
          </View>
        </View>
      )
    } else {
      //无switch
      return (null)
    }
  }


  //洗衣温度基础视图
  _heatBaseView (isShow, isSWitch, switchType, switchTitle, switchDetail, washTitle, washContent) {
    if (isShow == 1) {
      //有switch
      return (
        <View style={styles.modeBaseBack}>
          {isSWitch == 1 ? (<View style={styles.modeBaseSwitchBack}>
            {switchDetail ? (
              <Text style={styles.switchDetail}>{switchDetail}</Text>) : null}
            <Text style={styles.switchTitle}>{switchTitle}</Text>
            <TouchableOpacity onPress={() => {
              if (washTitle == LocalStrings.WaterLevel) {
                this.setState({
                  auto_wl: switchType == 0 ? 1 : 0,
                });
              } else if (washTitle == LocalStrings.Rinsetimes) {
                this.setState({
                  checkdirty: switchType == 0 ? 1 : 0,
                })
              }
            }}>
              <Image style={styles.switchBack}
                source={switchType == 1 ? (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_on.png') : require('../resources/switch_on.png')) : (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_off.png') : require('../resources/switch_off.png'))}
                resizeMode={'stretch'}></Image>
            </TouchableOpacity>
          </View>) : null}
          <View style={styles.washBack}>
            <Text style={styles.washTitle}>{washTitle}</Text>
            <Text style={styles.washCon}>{washContent}℃</Text>
          </View>
          <View {...this._heatpanResponder.panHandlers} style={styles.slideBack}>
              <Progress.Bar style={styles.washSlide} width={ScreenWidth - 46 * ratio} progress={this.state.heatprogress} color={'#37C6EE'} indeterminate={false} unfilledColor={'white'}/>
              <View style={[styles.slideCircle, { left: this.state.heatleft }]}></View>
          </View>
        </View>
      )
    } else {
      //无switch
      return (null)
    }
  }
  //洗衣强度基础视图
  _wateridBaseView (isShow, isSWitch, switchType, switchTitle, switchDetail, washTitle, washContent) {
    if (isShow == 1) {
      //有switch
      return (
        <View style={styles.modeBaseBack}>
          {isSWitch == 1 ? (<View style={styles.modeBaseSwitchBack}>
            {switchDetail ? (
              <Text style={styles.switchDetail}>{switchDetail}</Text>) : null}
            <Text style={styles.switchTitle}>{switchTitle}</Text>
            <TouchableOpacity onPress={() => {
              if (washTitle == LocalStrings.WaterLevel) {
                this.setState({
                  auto_wl: switchType == 0 ? 1 : 0,
                });
              } else if (washTitle == LocalStrings.Rinsetimes) {
                this.setState({
                  checkdirty: switchType == 0 ? 1 : 0,
                })
              }
            }}>
              <Image style={styles.switchBack}
                source={switchType == 1 ? (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_on.png') : require('../resources/switch_on.png')) : (LocalStrings.getLanguage() == "en" ? require('../resources/switchEn_off.png') : require('../resources/switch_off.png'))}
                resizeMode={'stretch'}></Image>
            </TouchableOpacity>
          </View>) : null}
          <View style={styles.washBack}>
            <Text style={styles.washTitle}>{washTitle}</Text>
            <Text style={styles.washCon}>{washContent == 0 ? LocalStrings.Weak : (washContent == 1 ? LocalStrings.Mid : LocalStrings.Strong)}</Text>
          </View>
          <View {...this._wateridpanResponder.panHandlers} style={styles.slideBack}>
              <Progress.Bar style={styles.washSlide} width={ScreenWidth - 46 * ratio} progress={this.state.wateridprogress} color={'#37C6EE'} indeterminate={false} unfilledColor={'white'}/>
              <View style={[styles.slideCircle, { left: this.state.wateridleft }]}></View>
          </View>
        </View>
      )
    } else {
      //无switch
      return (null)
    }
  }

  //洗前浸泡等选择框
  checkView (isShow, isChecked, title) {
    if (isShow == 1) {
      return (
        <TouchableOpacity onPress={() => {
          if (title == LocalStrings.Hightemperaturesterilization) {
            var isCan = this.state.wlwarn;
            this.setState({
              wlwarn: isCan == 0 ? 1 : 0,
            });

          } else if (title == LocalStrings.Dripping) {
            var isCan = this.state.shower;
            this.setState({
              shower: isCan == 0 ? 1 : 0,
            });

          } else if (title == LocalStrings.Soakbeforewashing) {
            var isCan = this.state.soak;
            this.setState({
              soak: isCan == 0 ? 1 : 0,
            });
          }
        }}>
          <View style={styles.checkBack}>
            <View style={{ width: 15 * ratio, height: 15 * ratio, borderWidth: 1, borderColor: '#B4B5B6', backgroundColor: isChecked == 1 ? '#27C6F0' : '#F2F2F2', borderRadius: 3 * ratio, overflow: 'hidden' }}></View>
            <Text style={{ fontSize: 15 * ratio, color: '#333', marginLeft: 10 * ratio }}>{title}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  }

  UNSAFE_componentWillMount () {
    //添加手势水位
    this._washwlpanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._left = this.state.washwlleft
        this.setState({
          isCanScroll: false,
        });
      },
      onPanResponderMove: (evt, gs) => {

        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //水位4档
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 3));
          this.setState({
            washwl: this.state.washwl_list[washNum],
            washwlleft: (this._left + gs.dx),
            washwlprogress: (this._left + gs.dx) / (ScreenWidth - 66 * ratio),
          });
        }

      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          isCanScroll: true,
        });

        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //水位4档
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 3));
          this.setState({
            washwl: this.state.washwl_list[washNum],
            washwlleft: washNum * ((ScreenWidth - 66 * ratio) / 3),
            washwlprogress: washNum / 3,
          });
        }
      },

    });

    //添加手势洗衣时间
    this._washpanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._left = this.state.washleft;
        this.setState({
          isCanScroll: false,
        });
      },
      onPanResponderMove: (evt, gs) => {
        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //洗衣时间5档
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 4));
          this.setState({
            wash: this.state.wash_list[washNum],
            washleft: (this._left + gs.dx),
            washprogress: (this._left + gs.dx) / (ScreenWidth - 66 * ratio),
          });
        }

      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          isCanScroll: true,
        });
        console.log("<>><>><><>");
        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //洗衣时间5档
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 4));
          this.setState({
            wash: this.state.wash_list[washNum],
            washleft: washNum * ((ScreenWidth - 66 * ratio) / 4),
            washprogress: washNum / 4,
          });
        }
      },

    });

    //添加手势漂洗次数
    this._rinsepanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._left = this.state.rinseleft
        this.setState({
          isCanScroll: false,
        });
      },
      onPanResponderMove: (evt, gs) => {

        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //漂洗次数3档
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 2));
          this.setState({
            rinse: this.state.rinse_list[washNum],
            rinseleft: (this._left + gs.dx),
            rinseprogress: (this._left + gs.dx) / (ScreenWidth - 66 * ratio),
          });
        }

      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          isCanScroll: true,
        });
        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 2));
          this.setState({
            rinse: this.state.rinse_list[washNum],
            rinseleft: washNum * ((ScreenWidth - 66 * ratio) / 2),
            rinseprogress: washNum / 2,
          });
        }
      },

    });

    //添加手势脱水时间
    this._drierpanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._left = this.state.drierleft
        this.setState({
          isCanScroll: false,
        });
      },
      onPanResponderMove: (evt, gs) => {

        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //脱水时间档位不固定,一般有5挡
          var drierLength = this.state.drier_list.length - 1;
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / drierLength));
          this.setState({
            drier: this.state.drier_list[washNum],
            drierIndex: washNum,
            drierleft: (this._left + gs.dx),
            drierprogress: (this._left + gs.dx) / (ScreenWidth - 66 * ratio),
          });
        }

      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          isCanScroll: true,
        });
        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //脱水时间档位不固定,一般有5挡
          var drierLength = this.state.drier_list.length - 1;

          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / drierLength));
          this.setState({
            drier: this.state.drier_list[washNum],
            drierIndex: washNum,
            drierleft: washNum * ((ScreenWidth - 66 * ratio) / drierLength),
            drierprogress: washNum / drierLength,
          });
        }
      },

    });

    //添加手势加热
    this._heatpanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._left = this.state.heatleft
        this.setState({
          isCanScroll: false,
        });
      },
      onPanResponderMove: (evt, gs) => {

        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //加热3挡
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 3));
          this.setState({
            heat: this.state.heat_list[washNum],
            heatleft: (this._left + gs.dx),
            heatprogress: (this._left + gs.dx) / (ScreenWidth - 66 * ratio),
          });
        }

      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          isCanScroll: true,
        });
        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 3));
          this.setState({
            heat: this.state.heat_list[washNum],
            heatleft: washNum * ((ScreenWidth - 66 * ratio) / 3),
            heatprogress: washNum / 3,
          });
        }
      },

    });

    //添加手势洗涤强度
    this._wateridpanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._left = this.state.wateridleft
        this.setState({
          isCanScroll: false,
        });
      },
      onPanResponderMove: (evt, gs) => {

        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //洗涤强度3挡
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 2));
          this.setState({
            waterid: this.state.waterid_list[washNum],
            wateridIndex: washNum,
            wateridleft: (this._left + gs.dx),
            wateridprogress: (this._left + gs.dx) / (ScreenWidth - 66 * ratio),
          });
        }

      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          isCanScroll: true,
        });
        if ((this._left + gs.dx) > (ScreenWidth - 66 * ratio) || (this._left + gs.dx) < 0) {

        } else {
          //洗涤强度3挡
          var washNum = Math.round((this._left + gs.dx) / ((ScreenWidth - 66 * ratio) / 2));
          this.setState({
            waterid: this.state.waterid_list[washNum],
            wateridIndex: washNum,
            wateridleft: washNum * ((ScreenWidth - 66 * ratio) / 2),
            wateridprogress: washNum / 2,
          });
        }
      },

    });

    //打开数据库
    db = SQLite.openDatabase({ name: database_name, location: 'default' },
      () => {
        console.log("modelID==== ", this.props.navigation.state.params.modelID);
        this.queryEmployeesWithInfo(this.props.navigation.state.params.modelID ? this.props.navigation.state.params.modelID : '');
      }, this.errorCB);
    // this.deleteDatabase();
  }

  componentDidMount () {
    //视图加载完成
  }

  componentWillUnmount () {

  }




  //确定按钮的响应事件
  buttonOnClick () {
    var sql = `UPDATE Models SET washwl = ${this.state.washwl},wash = ${this.state.wash},auto_wl = ${this.state.auto_wl},checkdirty = ${this.state.checkdirty},rinse = ${this.state.rinse},drier = ${this.state.drier},heat = ${this.state.heat},waterid = ${this.state.waterid},wlwarn = ${this.state.wlwarn},shower = ${this.state.shower},soak = ${this.state.soak} WHERE wash_id = '${this.state.modelObj.wash_id}'`;
    this.updateDatbase(sql);

  }

  //取消按钮的响应事件
  buttonOffClick () {
    this.props.navigation.goBack();
  }

  //数据库-------------------------------------------------
  //数据库错误回调
  errorCB = (err) => {
    return false;
  }

  //数据库操作成功的回调
  successCB = () => {
    console.log("SQL executed ...");
  }

  //打开数据库的回调
  openCB = () => {
    console.log("open db")
  }

  //数据库关闭的回调
  closeCB = () => {
    console.log("Database CLOSED");
  }

  //数据库删除的回调
  deleteCB = () => {
    console.log("Database DELETED");
  }

  //更新数据库
  updateDatbase (sql) {
    //开启数据库
    var that = this;
    db.executeSql(sql);
    this.closeDatabase();
    this.props.navigation.goBack();
    DeviceEventEmitter.emit('WashModelEvent');
  }

  //根据条件查询数据库
  queryEmployeesWithInfo (modeId) {
    //开启数据库
    var that = this;
    // //查询数据库
    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM Models WHERE wash_id = ${modeId}`, [], (tx, results) => {
        let row = results.rows.item(0);

        console.log(["row>>>>>", row]);

        //脱水时间
        var drier_list = row.drier_list.split(',');
        var drierIndex = 0;
        for (var i = 0; i < drier_list.length; i++) {
          if (row.drier == drier_list[i]) {
            drierIndex = i;
          }
        }

        //洗涤强度
        var waterid_list = row.waterid_list.split(',');
        var wateridIndex = 0;
        for (var j = 0; j < waterid_list.length; j++) {
          if (row.waterid == waterid_list[j]) {
            wateridIndex = j;
          }
        }

        var washwlProgress = this.checkNumIndex(row.washwl, this.state.washwl_list);
        var washProgress = this.checkNumIndex(row.wash, this.state.wash_list);
        var rinseProgress = this.checkNumIndex(row.rinse, this.state.rinse_list);
        var drierProgress = drierIndex / (drier_list.length - 1);
        var heatProgress = this.checkNumIndex(row.heat, this.state.heat_list);
        var wateridProgress = wateridIndex / (waterid_list.length - 1);

        this.setState({
          wash_id: modeId,//洗衣id
          washwl: row.washwl,
          washwlleft: washwlProgress * (ScreenWidth - 66 * ratio),
          washwlprogress: washwlProgress,
          wash: row.wash,
          washleft: washProgress * (ScreenWidth - 66 * ratio),
          washprogress: washProgress,
          auto_wl: row.auto_wl,
          checkdirty: row.checkdirty,
          rinse: row.rinse,
          rinseleft: rinseProgress * (ScreenWidth - 66 * ratio),
          rinseprogress: rinseProgress,
          drier: row.drier,
          drierleft: drierProgress * (ScreenWidth - 66 * ratio),
          drierprogress: drierProgress,
          drierIndex: drierIndex,
          drier_list: drier_list,
          heat: row.heat,
          heatleft: heatProgress * (ScreenWidth - 66 * ratio),
          heatprogress: heatProgress,
          waterid: row.waterid,
          wateridleft: wateridProgress * (ScreenWidth - 66 * ratio),
          wateridprogress: wateridProgress,
          wateridIndex: wateridIndex,
          waterid_list: waterid_list,
          wlwarn: row.wlwarn,
          shower: row.shower,
          soak: row.soak,
          modelObj: row,
        });

        console.log("soak========= ", this.state.soak);

        //关闭数据库
        // this.closeDatabase()
      });

    });

  }

  //检测值在数组中的比值
  checkNumIndex (value, num_list) {
    var index = 0;
    for (var i = 0; i < num_list.length; i++) {
      if (value == num_list[i]) {
        index = i;
      }
    }
    return (index) / (num_list.length - 1);

  }

  //关闭数据库
  closeDatabase = () => {
    if (db) {
      console.log("Closing database ...");
      console.log("Closing database");
      db.close(this.closeCB, this.errorCB);
    } else {
      console.log("Database was not OPENED");
    }
  }

  //删除数据库
  deleteDatabase = () => {
    console.log("Deleting database");
    SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
  }
}



var styles;
styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F2F2F2',
    // alignItems:'center',

  },

  scrollBack: {
    marginTop: iphonexTop,
    flex: 1,
    // marginBottom:-55*ratio,
    marginLeft: 0,
    marginRight: 0,

  },

  checkAllBack: {
    marginTop: 20 * ratio,
    marginLeft: 23 * ratio,
    marginRight: 23 * ratio,
    marginBottom: 48 * ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',

  },

  checkBack: {
    height: 35 * ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },

  buttonAllBack: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: isIphoneX() ? 34 : 0,
    height: 55 * ratio,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#97999A',
  },

  buttonDivMid: {
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    width: 1,
    backgroundColor: '#97999A',
  },

  buttonBack: {
    height: 54 * ratio,
    width: ScreenWidth / 2.0,
    alignItems: 'center',
    marginTop: 19.5 * ratio,
  },



  modeBaseBack: {
    marginTop: 21 * ratio,
    marginLeft: 25 * ratio,
    width: ScreenWidth - 46 * ratio,
    // height:74*ratio,
    flexDirection: 'column',
    // backgroundColor:'red',
  },

  modeBaseSwitchBack: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    // width: ScreenWidth,
    height: 25 * ratio,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  switchBack: {
    marginRight: 0,
    width: 57 * ratio,
    height: 25 * ratio,
  },

  switchTitle: {
    marginRight: 6 * ratio,
    fontSize: 12 * ratio,
    color: '#A5A6A7',
  },

  switchDetail: {
    marginRight: 8 * ratio,
    width: 91 * ratio,
    height: 11 * ratio,
    fontSize: 8 * ratio,
    color: '#fff',
    backgroundColor: '#A6A6A6',
    borderRadius: 5.5 * ratio,
    overflow: 'hidden',
  },

  washBack: {
    marginTop: 3 * ratio,
    // width:ScreenWidth,
    marginLeft: 0,
    marginRight: 0,
    height: 14 * ratio,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  washTitle: {
    fontSize: 14 * ratio,
    color: '#333333',
  },

  washCon: {
    fontSize: 12 * ratio,
    color: '#333333',
  },

  slideBack: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 10,
    height: 20 * ratio,
    // alignItems:'center',


  },

  washSlide: {
    marginTop: 6 * ratio
  },

  slideCircle: {
    position: 'absolute',
    top: 0,
    width: 20 * ratio,
    height: 20 * ratio,
    borderRadius: 10 * ratio,
    // overflow:'hidden',
    backgroundColor: '#fff',
  },
});


