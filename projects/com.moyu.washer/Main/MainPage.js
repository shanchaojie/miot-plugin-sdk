'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  PixelRatio,
  Dimensions,
  Text,
  Switch,
  ScrollView,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  Linking,
  Alert,
} from 'react-native';

import { localStrings as LocalStrings } from './MHLocalizableString.js';
import MHGlobal from './MHGlobalData';
import TitleBar from 'miot/ui/TitleBar';
import { LoadingDialog, MessageDialog } from 'miot/ui';
import SQLite from 'react-native-sqlite-storage';
import { Device, Package, Host, DeviceEvent, Service } from "miot";
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
import Picker from 'rmc-picker';
import { red } from 'ansi-colors';
import th from 'miot/resources/strings/th';

var that;
var window = Dimensions.get('window');
var ratio = window.width / 375.0;
var ScreenWidth = window.width;
var ScreenHeight = window.height;
var pickHour = [];
var pickMinutes = [];

let ModelDefaultObj = 'ModelDefaultObj';//当前的洗衣模式
let isLicense = 'isLicense';//是否已经同意了协议

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "mijia.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;
let db;

let DB;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const isIPad = ScreenWidth >= 768 ? true : false;
const iphonexTop = isIphoneX ? 24 : 0;

export default class MainPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header:
        <View>
          <TitleBar
            type='dark'
            title={navigation.state["params"] ? navigation.state.params.name : Device.name}
            // subTitle={getString('NUM_PHOTOS', { 'numPhotos': 1 })}
            onPressLeft={() => {
              Package.exit()
            }}
            onPressRight={() => {
              navigation.navigate('Setting', { 'title': LocalStrings.setting });
            }}
            onPressRight2={Device.isOwner ? () => {
              Host.ui.openShareDevicePage()
            } : null}
          />
        </View>
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      switchIndex: 0,
      modelIndex: 0,
      modelList: [require('../resources/washNomal1.png'), require('../resources/washNomal2.png'), require('../resources/washNomal3.png'), require('../resources/washNomal4.png'), require('../resources/washNomal6.png')],//, require('../resources/washNomal5.png')
      modelListSel: [require('../resources/washSelect1.png'), require('../resources/washSelect2.png'), require('../resources/washSelect3.png'), require('../resources/washSelect4.png'), require('../resources/washSelect6.png')],//, require('../resources/washSelect5.png')
      mode_choose_list: [],
      status: 0,//运行过程，0待机状态 1模糊称重中 2浸泡运行中 3洗涤运行中 4漂洗运行中 5脱水运行中 6预约运行中 7洗涤完成 8暂停状态
      mode: 0,//洗衣主程序(mode)：0--7
      wash_id: 0,
      heat: 0,//水温
      washwl: 0,//设置洗涤水位
      ordermin: 0,//预约了多少分钟
      usetime: 0,//洗涤总时间，如值为 45，代表洗涤 45 分钟
      wash_count: 0,//已完成洗衣次数（提醒用户清洁桶）
      child: 0,//童锁是否有开
      power: 0,//开关机
      start: 0,//暂停或启动，0未启动 1启动 2暂停 3预约中 4故障
      checkdirty: 0,//智能漂洗
      modelObj: {},
      showPicker: false,
      hours: 0,
      minutes: 0,
      showMore: false,
      showWarn: false,//显示警告视图
      showPhone: false,//显示电话
      more_list: [LocalStrings.ProgramEdit, LocalStrings.GeneralSetting, LocalStrings.UseHelp],
      warn: 0,//洗衣故障0x00  无报警0x01  进水超时报警0x02  排水超时报警0x03  开盖报警0x04  脱水不平衡报警0x05  水位传感器异常报警0x06  童锁报警0x07  模糊异常报警0x08  污浊度传感器故障0x09  加热传感器故障0x0a  加热管失效0x0b  干烧故障
      wash_result: {},
      isJumpWashReport: true,//是否是跳转到洗衣报告页面
      isJumpWashModel: false,//是否是设置洗衣模式成功
      showDialog: false,
      showMessageStr: '',
      showLoading: false,
      showLoadingStr: '',
      showShare: false,
    };
  }

  render () {
    //
    return (
      <View style={styles.container}>
        {/* 状态栏 */}
        <StatusBar barStyle='default' />
        {/* 童锁按钮 */}
        <TouchableOpacity style={styles.switchBaseOne} onPress={this._childOnPress.bind(this)}>
          <Text style={styles.switchBaseTitle}>{LocalStrings.ChildLock}</Text>
          <Image style={styles.switchBaseOneImage}
            source={this.state.child == 1 ? require('../resources/child_on.png') : require('../resources/child_off.png')}
            resizeMode={'stretch'}></Image>
        </TouchableOpacity>

        {/* 剩余时间等的显示 */}
        <Text
          style={styles.timeTitle}>{this.state.ordermin > 0 ? LocalStrings.MakingAppointments : LocalStrings.TimeLeft}</Text>
        <Text style={styles.timeSub}>{this._leftTimeWash()}</Text>
        <View style={styles.timeDownBack}>
          {/*{this.state.modelObj.heat_show == 1? (<Text style={styles.timeDownLeft}>水温 | {this.state.heat}℃</Text>) : null},*/}
          <Text
            style={styles.timeDownLeft}>{LocalStrings.Watertemperature} | {(this.state.heat > 90) ? "--" : this.state.heat + "℃"}</Text>
          <Text style={styles.timeDownRight}>{this._getWashStatus()}</Text>
        </View>

        <Text style={{
          marginTop: isIPad ? 72 * ratio : 149 * ratio,
          color: '#9B9B9B',
          fontSize: 12 * ratio
        }}>{LocalStrings.Longpressentersetup}</Text>
        {this._specBaseView()}
        <View style={styles.bottomBack}>


          <TouchableOpacity onPress={this._appointmentTime.bind(this)}>

            <View style={styles.bottomBase}>
              <Image
                source={this.state.start == 3 ? require('../resources/appointment_sel.png') : require('../resources/appointment_normal.png')}
                style={styles.bottomBaseImage} resizeMode={'stretch'}></Image>
              <Text
                style={[styles.bottomBaseTitle, { color: this.state.start == 3 ? '#28C5EE' : '#575859' }]}>{LocalStrings.Reservation}</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={this.openOrCloseWash.bind(this)}>
            <View style={styles.bottomBase}>
              <Image
                source={this.state.power == 0 ? require('../resources/power_normal.png') : require('../resources/power_sel.png')}
                style={styles.bottomBaseImage} resizeMode={'stretch'}></Image>
              <Text
                style={[styles.bottomBaseTitle, { color: this.state.power == 0 ? '#575859' : '#28C5EE' }]}>{LocalStrings.Power}</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={this.pauseWash.bind(this)}>
            <View style={styles.bottomBase}>
              <Image
                source={this.state.start == 1 ? require('../resources/start_sel.png') : require('../resources/start_normal.png')}
                style={styles.bottomBaseImage} resizeMode={'stretch'}></Image>
              <Text
                style={[styles.bottomBaseTitle, { color: this.state.start == 1 ? '#28C5EE' : '#575859' }]}>{this.state.start == 1 ? LocalStrings.Pause : LocalStrings.Start}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {this._appointmentBaseView()}
        {this._showWarnView()}
        {this._showPhoneView()}

        <LoadingDialog
          title=''
          message={this.state.showLoadingStr}
          onDismiss={() => {
            this.setState({
              showLoading: false,
            });
          }}
          visible={this.state.showLoading}
          timeout={2000}
        />

        <MessageDialog title={''}
          message={this.state.showMessageStr}
          cancelable={true}
          cancel={LocalStrings.Cancel}
          confirm={LocalStrings.Set}
          timeout={3000}
          onCancel={(e) => {
            console.log('onCancel', e);
          }}
          onConfirm={(e) => {
            console.log('onConfirm', e);
          }}
          onDismiss={() => {
            console.log('onDismiss');
            this.setState({ showDialog: false });
          }}
          visible={this.state.showDialog} />
      </View>
    );
  }

  //视图--------------------------------------------
  //模式基础视图
  _specBaseView () {
    let _that = this;
    var specViewArr = [];

    for (var i = 0; i < _that.state.modelList.length; i++) {
      var specData;
      if (this.state.modelIndex == i) {
        specData = _that.state.modelListSel[i]
      } else {
        specData = _that.state.modelList[i]
      }
      specViewArr.push(
        <TouchableOpacity key={i} style={styles.modelBase} onPress={this._modelChoose(i).bind(this)}
          onLongPress={this.onOpenSubPage(i, 'WasherModel').bind(this)}>
          <Image style={styles.modelBaseImage} source={specData.pic} resizeMode={'stretch'}></Image>
        </TouchableOpacity>
      )
    }
    return (
      <View style={[styles.modelBack]}>
        <Image style={styles.modeImageBack} source={require('../resources/mainBack.png')}
          resizeMode={'stretch'}></Image>
        <Text style={{
          color: '#19C2EE',
          fontSize: 14 * ratio,
          marginTop: 7 * ratio
        }}>{this.getWashModelName(this.state.modelObj.name)}</Text>
        {/* <Text style={{ marginTop: 0 * ratio, fontSize: 13 * ratio, color: '#666' }}>{LocalStrings.Longpressentersetup}</Text> */}
        <ScrollView style={[{ marginTop: 6 * ratio, height: 105 * ratio, width: Dimensions.get('window').width }]}
          horizontal={true} showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}>
          {specViewArr.map((elem, index) => {
            return elem;
          })}
        </ScrollView>
      </View>
    )
  }

  //预约时间
  _appointmentBaseView () {
    if (this.state.showPicker) {
      return (
        <View style={styles.appointmentBack}>
          <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
          <View style={styles.pickCenterBack}>
            {/*滑动视图*/}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.showPicker ? this.state.hours : 0}
                onValueChange={(val) => this.setState({ hours: val })}
                itemStyle={styles.picker}
              >
                {pickHour.map((item) => (
                  console.log(item),
                  <Text key={item.label}
                    value={item.value}
                    label={item.label}
                  >{item.label}</Text>
                ))
                }
              </Picker>
              <View style={styles.pickCenter}><Text style={styles.pickerText}>:</Text></View>
              <Picker
                selectedValue={this.state.showPicker ? this.state.minutes : 0}
                onValueChange={(val) => this.setState({ minutes: val })}
                itemStyle={styles.picker}
              >
                {pickMinutes.map((item) => (
                  <Text key={item.label}
                    value={item.value}
                    label={item.label}
                  >{item.label}</Text>
                ))
                }
              </Picker>
            </View>
            {/*按钮*/}
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
          </View>
        </View>)

    } else {
      return (
        null
      )
    }
  }

  //显示警报视图
  _showWarnView () {

    if (this.state.showWarn == true) {

      if (this.state.start == 4 && this.state.status == 0) {
        //洗衣故障0x00  无报警
        return null;
      } else if (this.state.start == 4 && this.state.status == 1) {
        //0x01进水超时报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>1.{LocalStrings.Thefaucetisnotturnedon};</Text>
              <Text style={styles.warnConSec}>2.{LocalStrings.Inletvalveblocked};</Text>
              <Text style={styles.warnConSec}>3.{LocalStrings.Waterpressureistoolow}。</Text>
              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>1.{LocalStrings.Openthefaucet};</Text>
              <Text style={styles.warnConSec}>2.{LocalStrings.Cleantheinletvalve};</Text>
              <Text style={styles.warnConSec}>3.{LocalStrings.Reusewhenthewaterpressure}。</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 2) {
        //0x02排水超时报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>1.{LocalStrings.Whetherthedrainputdown};</Text>
              <Text style={styles.warnConSec}>2.{LocalStrings.Whetherthedrainblocked}。</Text>
              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>1.{LocalStrings.Putdownthedrain};</Text>
              <Text style={styles.warnConSec}>2.{LocalStrings.RemoteModules}。</Text>

              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 3) {
        //0x03开盖报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Doorisnotclosed}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Closethedoor}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 4) {
        //0x04脱水不平衡报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>1.{LocalStrings.Clothingdeviation};</Text>
              <Text style={styles.warnConSec}>2.{LocalStrings.Whetherthewashingmachineistilted}。</Text>
              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>1.{LocalStrings.Rearrangetheclothesandclosethedoor};</Text>
              <Text style={styles.warnConSec}>2.{LocalStrings.Placethewashingmachine}。</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 5) {
        //0x05水位传感器异常报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Abnormalwaterlevelsensor}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Replugthepower}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 6) {
        //0x06童锁报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Coveropening}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Openthecoverwithin5seconds}</Text>
              <Text style={styles.warnConSec}>{LocalStrings.Openthecovermorethan5seconds}</Text>
              <Text style={styles.warnConSec}>{LocalStrings.Thisalarmstilloccursafterrestarting}</Text>
              <Text style={[styles.warnConSec, { color: '#18c0ee' }]}>{LocalStrings.Callforwarranty}</Text>

              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 7) {
        //0x07模糊异常报警
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Thefuzzyvalueislessthan}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Restartafterturningoffthepower}</Text>
              <Text style={styles.warnConSec}>{LocalStrings.Thisalarmstilloccursafterrestarting}</Text>
              <Text style={[styles.warnConSec, { color: '#18c0ee' }]}>{LocalStrings.Callforwarranty}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 8) {
        //0x08污浊度传感器故障
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Turbiditysensorfailure}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Restartafterturningoffthepower}</Text>
              <Text style={styles.warnConSec}>{LocalStrings.Thisalarmstilloccursafterrestarting}</Text>
              <Text style={[styles.warnConSec, { color: '#18c0ee' }]}>{LocalStrings.Callforwarranty}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 9) {
        //0x09加热传感器故障
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Aproblemwiththeheater}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Automaticallycanceltheheating}</Text>
              <Text style={[styles.warnConSec, { color: '#18c0ee' }]}>{LocalStrings.Callforwarranty}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 10) {
        //0x0a 加热管失效
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Thereisaproblem}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Restartafterturningoffthepower}</Text>
              <Text style={styles.warnConSec}>{LocalStrings.Thisalarmstilloccursafterrestarting}</Text>
              <Text style={[styles.warnConSec, { color: '#18c0ee' }]}>{LocalStrings.Callforwarranty}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (this.state.start == 4 && this.state.status == 11) {
        //0x0b  干烧故障
        return (
          <View style={styles.appointmentBack}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
            <View style={styles.warnCenterBack}>
              <Text style={styles.warnTitle}>{LocalStrings.Erroroccured}</Text>
              {/*原因*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Errorcause}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Heaterdryburning}</Text>

              {/*排除方法*/}
              <Text style={styles.warnSecTitle}>{LocalStrings.Methodofexclusion}</Text>
              <Text style={styles.warnConOne}>{LocalStrings.Restartafterturningoffthepower}</Text>
              <Text style={styles.warnConSec}>{LocalStrings.Thisalarmstilloccursafterrestarting}</Text>
              <Text style={[styles.warnConSec, { color: '#18c0ee' }]}>{LocalStrings.Callforwarranty}</Text>
              {/*按钮*/}
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <TouchableOpacity onPress={this.warnOnClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#18c0ee',
                    }}>{LocalStrings.Solved}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
                <TouchableOpacity onPress={this.warnOffClick.bind(this)}>
                  <View style={styles.buttonBack}>
                    <Text style={{
                      fontSize: 15 * ratio,
                      color: '#383939'
                    }}>{LocalStrings.Unsolved}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      }
    } else {

      return null;
    }
  }

  //显示电话视图
  _showPhoneView () {
    if (this.state.showPhone) {
      return (
        <View style={styles.appointmentBack}>
          <TouchableOpacity onPress={this.phoneOffClick.bind(this)}>
            <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
          </TouchableOpacity>
          <View style={styles.warnCenterBack}>
            <Text style={styles.warnTitle}>{LocalStrings.Pleasecallournationalservicehotline}</Text>
            <Text style={styles.warnSecTitle}>400-620-1306</Text>
            <TouchableOpacity onPress={this.phoneOnClick.bind(this)}>
              <View style={[styles.buttonAllBack, {
                height: 55 * ratio,
                marginTop: 35 * ratio,
                borderTopColor: '#939393',
              }]}>
                <View style={[styles.buttonBack, { width: ScreenWidth - 46 * ratio }]}>
                  <Text style={{ fontSize: 20 * ratio, color: '#18c0ee', }}>{LocalStrings.Call}</Text>
                </View>

              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null;
    }
  }


  //数字补位
  pad (num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  //剩余时间
  _leftTimeWash () {
    if (this.state.ordermin > 0) {
      var time = this.pad(Math.floor(this.state.ordermin / 60), 2) + " : " + this.pad((this.state.ordermin % 60), 2);
      return time;
    } else {
      var time = this.pad(Math.floor(this.state.usetime / 60), 2) + " : " + this.pad((this.state.usetime % 60), 2);
      return this.state.start == 0 ? "00:00" : time;
    }
  }

  //获取洗衣状态
  _getWashStatus () {
    var start = this.state.start;
    if (start == 0) {
      return LocalStrings.WaitingToStart
    } else if (start == 1) {
      //启动了
      var status = this.state.status;
      //运行过程，0待机状态 1模糊称重中 2浸泡运行中 3洗涤运行中 4漂洗运行中 5脱水运行中 6预约运行中 7洗涤完成 8暂停状态
      switch (status) {
        case 0:
          return LocalStrings.Standby
        case 1:
          return LocalStrings.FuzzyWeighing
        case 2:
          return LocalStrings.Soakbeforewashing
        case 3:
          return LocalStrings.Washing
        case 4:
          return LocalStrings.Rinsing
        case 5:
          return LocalStrings.Dehydrating
        case 6:
          return LocalStrings.Reservation1
        case 7:
          return LocalStrings.WashingCompleted
        case 8:
          return LocalStrings.Pausing1
      }

    } else if (start == 2) {
      //暂停状态
      return LocalStrings.Pausing1

    } else if (start == 3) {
      //预约中
      return LocalStrings.Reservation1
    } else if (start == 4) {
      //洗衣故障0x00  无报警0x01  进水超时报警0x02  排水超时报警0x03  开盖报警0x04  脱水不平衡报警0x05  水位传感器异常报警0x06  童锁报警0x07  模糊异常报警0x08  污浊度传感器故障0x09  加热传感器故障0x0a  加热管失效0x0b  干烧故障
      var warn = this.state.status;
      switch (warn) {
        case 0:
          return "";
        case 1:
          return LocalStrings.Inflowovertimealarm;
        case 2:
          return LocalStrings.Drainingovertimealarm;
        case 3:
          return LocalStrings.Coveropeningalarm;
        case 4:
          return LocalStrings.Dehydrationunbalancealarm;
        case 5:
          return LocalStrings.Abnormalalarmofwaterlevelsensor;
        case 6:
          return LocalStrings.Childrenlockalarm;
        case 7:
          return LocalStrings.Fuzzyanomalyalarm;
        case 8:
          return LocalStrings.Turbiditysensorfailure;
        case 9:
          return LocalStrings.Heatingsensorfailure;
        case 10:
          return LocalStrings.Heatingpipefailure;
        case 11:
          return LocalStrings.Dryburningfailure;
      }
    }
  }

  //童锁的响应事件
  _childOnPress () {
    var child = this.state.child;
    if (this.state.status != 0) {
      //洗衣机正在运行
      let childLast = child == 0 ? 1 : 0;
      this.setState({
        child: childLast,
      });
      Device.getDeviceWifi().callMethod('child', [childLast]).then((res) => {
      }).catch(err => {
        console.log(['error:', err])
      });
    } else {
      this.showMessageDialog(LocalStrings.Thechildlockbutton);
    }
  }

  //选择model
  _modelChoose (index) {
    function modelSub () {
      if (this.state.start == 0) {
        //刚开机
        this.setState({
          modelIndex: index,
          wash_id: this.state.mode_choose_list.length > 0 ? this.state.mode_choose_list[index].wash_id : 1,
          mode: this.state.mode_choose_list.length > 0 ? this.state.mode_choose_list[index].mode : 0,
        });
        this.queryEmployeesWithInfo();
      }
    }

    return modelSub;
  }

  //预约时间
  _appointmentTime () {
    //0未启动 1启动 2暂停 3预约中 4故障
    if (this.state.power == 1 && (this.state.start == 0 || this.state.start == 3 || this.state.start == 4)) {
      this.setState({
        showPicker: true,
      })
    } else {
    }
  }

  //预约时间按钮的响应事件
  buttonOnClick () {

    var appointMin;//预约时间
    //当前时间
    var nowDate = new Date();
    var nowHour = nowDate.getHours();
    var nowMin = nowDate.getMinutes();

    //预设时间
    var hour = parseInt(this.state.hours);
    var min = parseInt(this.state.minutes);

    if (hour > nowHour) {
      //预约小时大于当前的小时
      if ((hour - nowHour) * 60 - nowMin + min >= 120) {
        //大于当前小时120分钟
        appointMin = (hour - nowHour) * 60 - nowMin + min;
      } else {
        //小于当前小时120分钟
        this.showMessageDialog(LocalStrings.Theappointmenttime);
        return;
      }

    } else if (hour == nowHour) {
      if (min >= nowMin) {
        //预约时间大于当前时间,时间间隔太短没法设置
        this.showMessageDialog(LocalStrings.Theappointmenttime);
        return;
      } else {
        //预约时间小于当前时间,
        appointMin = 24 * 60 + min - nowMin;
      }
    } else {
      //预约小时小于当前的小时
      appointMin = (24 - nowHour + hour) * 60 - nowMin + min;
    }

    this.setState({
      showPicker: false,
      ordermin: appointMin,
    });

    this.appointmentWash(appointMin);//设置洗衣参数
  }

  //取消预约的响应事件
  buttonOffClick () {
    this.setState({
      showPicker: false,
    })
  }

  //警告的确定按钮事件
  warnOnClick () {
    this.setState({
      showWarn: false,
    });
  }

  //警告的取消按钮的事件
  warnOffClick () {
    this.setState({
      showWarn: false,
      showPhone: true,
    });
  }

  //拨打电话
  phoneOnClick () {
    this.setState({
      showPhone: false,
    });
    if (Linking.canOpenURL('tel:4006201306')) {
      Linking.openURL('tel:4006201306')
    } else {
      this.showMessageDialog(LocalStrings.Failedcalling);
    }
  }

  //取消拨打电话
  phoneOffClick () {
    this.setState({
      showPhone: false,
    });

  }

  //显示提示框
  showMessageDialog (contentStr) {
    this.setState({
      showMessageStr: contentStr,
      showDialog: true,
    })
  }

  //显示加载框
  showLoadingDialog (contentStr) {
    this.setState({
      showLoading: true,
      showLoadingStr: contentStr,
    });
  }

  //数据库-------------------------------------------------
  //数据库错误回调
  errorCB = (err) => {
    console.log(['error', err]);
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
    db = null;
  }

  //删除数据库
  deleteDatabase = () => {
    console.log("Deleting database");
    SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
  }

  //关闭数据库
  closeDatabase = () => {
    if (db) {
      console.log("Closing database ...");
      db.close(this.closeCB, this.errorCB);
    } else {
      console.log("Database was not OPENED");
    }
  }

  //创建或者打开一个数据库
  loadAndQueryDB = () => {
    console.log("Opening database ...", true);
    //创建或者打开一个数据库
    //db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    //从代码中加载一个已有的数据库 米家内部实现，请必须按照这种方式调用，.db文件打包会被过滤掉，可以命名为.html
    //require('../../Resources/Test.html')
    db = SQLite.openDatabase({ name: database_name, location: 'default' },
      this.openCB, this.errorCB);
    this.populateDatabase(db);
  }

  populateDatabase = (db) => {
    if (!db) {
      console.log("Database is open fail");
      return;
    }
    console.log("Database integrity check");
    db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
      () => {
        console.log("Database is ready ... executing query ...");
        db.transaction(this.queryEmployees, this.errorCB, () => {
          console.log("Processing completed");
        });
      },
      (error) => {

        console.log("Database not yet ready ... populating data");

        db.transaction(this.populateDB, this.errorCB, () => {
          console.log("Database populated ... executing query ...");

          //获取mode列表数据
          this.queryModeList();

          db.transaction(this.queryEmployees, this.errorCB, () => {
            console.log("Transaction is now finished");

            // this.closeDatabase();
          });
        });
      });
  }

  populateDB = (tx) => {
    console.log("Executing DROP stmts");
    var that = this;
    tx.executeSql('DROP TABLE IF EXISTS Models;');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Models( '
      + 'wash_id INTEGER PRIMARY KEY NOT NULL, '
      + 'isChoosed INT, '//是否已选中
      + 'type INT, '//0就是洗涤模式（内置的那几个），1就是材质模式
      + 'isAdd INT, '//表示对于type是1的材质模式，用户是否添加了
      + 'name VARCHAR(30), '
      + 'mode INT, '
      + 'washwl_show INT, '
      + 'washwl INT, '//水位选择：1档、2档、3档、4档
      + 'wash_show INT, '//洗涤时间，5个档位的值:5,10,15,20,25分钟
      + 'wash INT, '
      + 'auto_wl_show INT, '
      + 'auto_wl INT, '//自动水位
      + 'checkdirty_show INT, '
      + 'checkdirty INT, '//智能检测，智能漂洗
      + 'rinse_show INT, '
      + 'rinse INT, '//漂洗次数：1次，2次，3次
      + 'drier_show INT, '
      + 'drier INT, '//脱水时间
      + 'drier_list VARCHAR(100), '//脱水时间选择范围,范例：1,2,3,4 表示4个时间点可以选择
      + 'heat_show INT, '
      + 'heat INT, '//加热温度40,50,60三个档位取值
      + 'waterid_show INT, '
      + 'waterid INT, '//洗涤强度，0--16的取值
      + 'waterid_list VARCHAR(100), '//洗涤强度的3个值：5,4,2，类似这样
      + 'wlwarn_show INT, '
      + 'wlwarn INT, '//高温杀菌
      + 'shower_show INT, '
      + 'shower INT, '//淋漂
      + 'soak_show INT, '
      + 'soak INT );',
      [], this.successCB, this.errorCB);


    //waterid 自定义水流编号
    //日常洗
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed,  type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (1, 1, 0, 1, ' + '"日常", 0, 1, 3, 1, 10, 1, 1, 1, 1, 1, 2, 1, 5, +"2,3,4,5,6", 1, 0, 1, 13, +"9,13,16", 1, 0, 0, 0, 0, 0);', []);

    //内衣洗
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (2, 1, 0, 1, ' + '"内衣", 1, 1, 3, 1, 15, 1, 0, 1, 1, 1, 2, 1, 2, +"2,3,4,5", 1, 0, 1, 14, +"9,14,16", 0, 0, 0, 0, 1, 1);', []);

    //婴儿洗
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (3, 1, 0, 1, ' + '"婴儿", 2, 1, 3, 1, 10, 1, 0, 1, 0, 1, 3, 1, 5, +"2,3,4,5", 1, 40, 1, 15, +"9,15,16", 1, 1, 0, 0, 1, 1);', []);

    //单脱
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (4, 1, 0, 1, ' + '"单脱", 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, +"2,3,4,5", 0, 0, 0, 0, +"0,0,0", 0, 0, 0, 0, 0, 0);', []);

    //桶自洁
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (6, 1, 0, 1, ' + '"洁桶", 5, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 6, +"4,5,6,7", 0, 0, 0, 0, +"0,0,0", 0, 0, 0, 0, 0, 0);', []);

    //棉布
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (11, 0, 1, 0, ' + '"棉布", 0, 1, 3, 1, 15, 1, 1, 1, 0, 1, 2, 1, 6, +"4,5,6,7", 0, 0, 1, 0, +"9,0,16", 0, 0, 1, 0, 1, 1);', []);

    //麻布
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (12, 0, 1, 0, ' + '"麻布", 0, 1, 3, 1, 10, 1, 1, 1, 0, 1, 1, 1, 5, +"2,3,4,5", 0, 0, 1, 0, +"9,0,16", 0, 0, 1, 0, 0, 0);', []);

    //牛仔
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (13, 0, 1, 0, ' + '"牛仔", 0, 1, 3, 1, 15, 0, 0, 1, 0, 1, 2, 1, 6, +"4,5,6,7", 0, 0, 1, 0, +"9,0,16", 0, 0, 1, 0, 1, 1);', []);

    //羊绒
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (14, 0, 1, 0, ' + '"羊绒", 0, 1, 3, 1, 15, 1, 0, 1, 0, 1, 2, 1, 2, +"2,3,4,5", 0, 0, 0, 0, +"0,0,0", 0, 0, 0, 0, 1, 1);', []);

    //涤纶
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (15, 0, 1, 0, ' + '"涤纶", 0, 1, 3, 1, 10, 1, 0, 1, 0, 1, 1, 1, 4, +"2,3,4,5", 0, 0, 1, 0, +"9,0,16", 0, 0, 0, 0, 1, 0);', []);

    //丝绸
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (16, 0, 1, 0, ' + '"丝绸", 0, 1, 3, 1, 10, 0, 0, 0, 0, 1, 2, 1, 3, +"2,3,4,5", 0, 0, 1, 0, +"9,0,16", 0, 0, 0, 0, 0, 0);', []);

    //雪纺
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (17, 0, 1, 0, ' + '"雪纺", 0, 1, 3, 1, 10, 0, 0, 1, 0, 1, 2, 1, 5, +"3,4,5,6", 0, 0, 1, 0, +"9,0,16", 0, 0, 1, 0, 0, 0);', []);

    //呢绒
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (18, 0, 1, 0, ' + '"呢绒", 0, 1, 3, 1, 15, 0, 0, 1, 0, 1, 2, 1, 5, +"3,4,5,6", 0, 0, 1, 0, +"9,0,16", 0, 0, 1, 0, 1, 1);', []);

    //毛绒玩具
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (19, 0, 1, 0, ' + '"毛绒玩具", 0, 1, 3, 1, 10, 1, 0, 0, 0, 1, 2, 0, 5, +"2,3,4,5", 0, 0, 0, 0, +"0,0,0", 0, 0, 0, 0, 0, 0);', []);

    //智能漂洗
    tx.executeSql('INSERT INTO Models (wash_id, isChoosed, type, isAdd, name, mode, washwl_show, washwl, wash_show, wash, auto_wl_show, auto_wl, checkdirty_show, checkdirty, rinse_show, rinse, drier_show, drier, drier_list, heat_show, heat, waterid_show, waterid, waterid_list, wlwarn_show, wlwarn, shower_show, shower, soak_show, soak ) ' + 'VALUES (20, 0, 1, 0, ' + '"智能漂洗", 0, 0, 2, 0, 10, 0, 0, 1, 1, 1, 2, 1, 4, +"2,3,4,5", 0, 0, 0, 0, +"0,0,0", 0, 0, 0, 0, 0, 0);', []);

    console.log("all config SQL done");

    tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
      + 'version_id INTEGER PRIMARY KEY NOT NULL); ', [], this.successCB, this.errorCB);
  }

  //更新数据库
  updateDatbase (sql) {
    //开启数据库
    db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, results) => {
        console.log(results);
      });
    });
    // db.executeSql(sql);
  }

  //查询数据
  queryEmployees = (tx) => {
    console.log("Executing employee query...");
    tx.executeSql('SELECT * FROM Models', [],
      (tx, results) => {
        Host.storage.get(ModelDefaultObj).then((result) => {
          //存储的数据
          if (this.isNotObjectEmpty(result)) {
            //有数据
          } else {
            //空数据
            let row = results.rows.item(0);
            Host.storage.set(ModelDefaultObj, row);
            this.setState({
              checkdirty: row.checkdirty,
              modelObj: row,
            });
          }
        });
      }, this.errorCB);
  }

  //根据条件查询数据库
  queryEmployeesWithInfo () {
    //开启数据库
    var that = this;
    // //查询数据库
    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM Models WHERE wash_id = ${this.state.wash_id}`, [], (tx, results) => {
        let row = results.rows.item(0);
        Host.storage.set(ModelDefaultObj, row);
        this.setState({
          checkdirty: row.checkdirty,
          modelObj: row,
        });
        if (this.state.isJumpWashModel == true) {
          //设置洗衣mode的回调
          this.setState({
            isJumpWashModel: false,
          });
          this.openWash();
        } else {

        }
      });
    });
  }

  //获取model数据
  //获取列表数据
  queryModeList () {
    //开启数据库
    var that = this;
    db.transaction((tx) => {
      //查询已选中的数据
      tx.executeSql('SELECT * FROM Models WHERE isChoosed = 1;', [], (tx, results) => {
        var choosed_list = [];
        var modeIndex = 0;
        for (var i = 0; i < results.rows.length; i++) {
          if (this.state.wash_id == results.rows.item(i).wash_id) {
            modeIndex = i;
          }
          choosed_list.push(results.rows.item(i));
        }
        this.setState({
          mode_choose_list: choosed_list,
          modelIndex: modeIndex,
          wash_id: choosed_list[modeIndex].wash_id,
          mode: choosed_list[modeIndex].mode,
        });
        this.initModellist();
      }, (error) => {
        if (error.code == 0 || error.code == 5) {
          //数据库为空
          this.loadAndQueryDB();
        }
        console.log("error=" + error);
      });
    }, this.errorCB, () => {
      console.log("Transaction is now finished");
      // this.closeDatabase();
    });
  }

  //界面数据---------------------------------------
  //判断是否为object
  isNotObjectEmpty (obj) {
    for (var key in obj) {
      return true;
    }
    return false;
  }

  //初始化预约时间的数据
  _pickListData () {
    //初始化picker数据
    for (var i = 0; i < 24; i++) {
      pickHour.push(
        { value: i, label: this.pad(i, 2) }
      )
    }
    ;
    for (var j = 0; j < 60; j++) {
      pickMinutes.push(
        { value: j, label: this.pad(j, 2) }
      )
    }
    ;
  }

  //获得模式名字
  getWashModelName (name) {
    switch (name) {
      case "日常": {
        return LocalStrings.DailyWashing;
      }
      case "内衣": {
        return LocalStrings.UnderwearWashing;
      }
      case "婴儿": {
        return LocalStrings.BabyWashing;
      }
      case "单脱": {
        return LocalStrings.OnlyDehydrate;
      }
      case "洁桶": {
        return LocalStrings.BucketCleaning;
      }
      case "棉布": {
        return LocalStrings.CottonFabric;
      }
      case "麻布": {
        return LocalStrings.Linen;

      }
      case "牛仔": {
        return LocalStrings.Jeans;
      }
      case "羊绒": {
        return LocalStrings.Cashmere;
      }
      case "涤纶": {
        return LocalStrings.Polyester;
      }
      case "丝绸": {
        return LocalStrings.Silk;
      }
      case "雪纺": {
        return LocalStrings.Chiffon;
      }
      case "呢绒": {
        return LocalStrings.Wool;
      }
      case "毛绒玩具": {
        return LocalStrings.PlushToy;
      }
      case "智能漂洗": {
        return LocalStrings.SmartRinsing;
      }
      default: {
        return LocalStrings.DailyWashing;
      }

    }
  }

  //初始化model数据
  initModellist () {
    var modelList = [];
    var modelListSel = [];
    for (var i = 0; i < this.state.mode_choose_list.length; i++) {
      var wash_id = this.state.mode_choose_list[i].wash_id;
      switch (parseInt(wash_id)) {
        case 1:
          modelList.push({
            pic: require('../resources/washNomal1.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect1.png'),
            wash_id: wash_id
          })
          break;

        case 2:
          modelList.push({
            pic: require('../resources/washNomal2.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect2.png'),
            wash_id: wash_id
          })
          break;

        case 3:
          modelList.push({
            pic: require('../resources/washNomal3.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect3.png'),
            wash_id: wash_id
          })
          break;

        case 4:
          modelList.push({
            pic: require('../resources/washNomal4.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect4.png'),
            wash_id: wash_id
          })
          break;

        case 6:
          modelList.push({
            pic: require('../resources/washNomal6.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect6.png'),
            wash_id: wash_id
          })
          break;

        case 11:
          modelList.push({
            pic: require('../resources/washNomal11.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect11.png'),
            wash_id: wash_id
          })
          break;

        case 12:
          modelList.push({
            pic: require('../resources/washNomal12.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect12.png'),
            wash_id: wash_id
          })
          break;

        case 13:
          modelList.push({
            pic: require('../resources/washNomal13.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect13.png'),
            wash_id: wash_id
          })
          break;

        case 14:
          modelList.push({
            pic: require('../resources/washNomal14.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect14.png'),
            wash_id: wash_id
          })
          break;

        case 15:
          modelList.push({
            pic: require('../resources/washNomal15.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect15.png'),
            wash_id: wash_id
          })
          break;

        case 16:
          modelList.push({
            pic: require('../resources/washNomal16.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect16.png'),
            wash_id: wash_id
          })
          break;

        case 17:
          modelList.push({
            pic: require('../resources/washNomal17.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect17.png'),
            wash_id: wash_id
          })
          break;

        case 18:
          modelList.push({
            pic: require('../resources/washNomal18.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect18.png'),
            wash_id: wash_id
          })
          break;

        case 19:
          modelList.push({
            pic: require('../resources/washNomal19.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect19.png'),
            wash_id: wash_id
          })
          break;

        case 20:
          modelList.push({
            pic: require('../resources/washNomal20.png'),
            wash_id: wash_id
          });
          modelListSel.push({
            pic: require('../resources/washSelect20.png'),
            wash_id: wash_id
          })
          break;
        default:
          break;
      }
    }

    this.setState(
      {
        modelList: modelList,
        modelListSel: modelListSel,
      })
  }

  //初始化界面的数据
  _initWashData () {
    if (this.state.mode_choose_list.length <= 0) {
      Host.storage.get(ModelDefaultObj).then((result) => {
        console.log(["open>>>>>>>", result]);
        //存储的数据
        if (this.isNotObjectEmpty(result)) {
          //有数据
          this.setState({
            modelObj: result,
            checkdirty: result.checkdirty,
            mode: result.mode,
            wash_id: result.wash_id,
          });
          if (!db) {
            db = SQLite.openDatabase({ name: database_name, location: 'default' },
              () => {
                console.log(['db=', db])
                //获取列表数据
                this.queryModeList();
              }, this.errorCB);
          }
        } else {
          //空数据
          this.loadAndQueryDB();
        }
      });
    }
  }

  onOpenSubPage (modelID, subPageComponent) {
    const that = this;

    function subPage () {
      if (that.state.start != 0) {
        return;
      }
      var wash_id = that.state.mode_choose_list[modelID].wash_id;
      console.log(["wash_id>>>>>>>", wash_id]);

      this.setState({
        modelIndex: modelID,
        wash_id: that.state.mode_choose_list[modelID].wash_id,
        mode: that.state.mode_choose_list[modelID].mode,
      });
      this.queryEmployeesWithInfo();//查询

      if (wash_id == 6) {
        //洁桶模式
        this.showMessageDialog(LocalStrings.Cleanbucketmodeisnoteditable);
        return;
      }

      this.props.navigation.navigate(
        subPageComponent,
        {
          title: LocalStrings.ProgramEdit,
          'modelID': wash_id,
        },
      );
    }

    return subPage;
  }

  //开启洗衣机电源
  openOrCloseWash () {

    var power;
    if (this.state.power == 0) {
      power = 1;
    } else {
      power = 0;
    }
    Device.getDeviceWifi().callMethod('set_power', [power]).then((res) => {

      console.log(res);

    }).catch(err => {
      console.log('error:', err)
    });
  }

  //暂停洗衣机
  pauseWash () {
    if (this.state.power == 1) {
      //洗衣机正在运行
      if (this.state.start == 0) {
        //未启动
        console.log([this.state.modelObj.mode, this.state.modelObj.washwl, this.state.modelObj.wash, this.state.modelObj.rinse, this.state.modelObj.checkdirty, this.state.modelObj.drier, this.state.modelObj.waterid, this.state.modelObj.heat, this.state.modelObj.wlwarn, this.state.modelObj.shower, 0, this.state.modelObj.soak, this.state.modelObj.auto_wl, this.state.ordermin]);
        Device.getDeviceWifi().callMethod('set_wash', [this.state.modelObj.mode, this.state.modelObj.washwl, this.state.modelObj.wash, this.state.modelObj.rinse, this.state.modelObj.checkdirty, this.state.modelObj.drier, this.state.modelObj.waterid, this.state.modelObj.heat, this.state.modelObj.wlwarn, this.state.modelObj.shower, 0, this.state.modelObj.soak, this.state.modelObj.auto_wl, this.state.ordermin]).then((res) => {
          //现在设置洗衣参数会开启洗衣机,
        }).catch(err => {
          console.log('error:', err)
        });
      } else {
        var pause = 0;
        if (this.state.start == 2) {
          //暂停状态,开启洗衣机
          pause = 1;
        } else {
          //运行状态或者预约,故障状态,暂停洗衣机
          pause = 0;
        }
        //暂停或开始洗衣机
        Device.getDeviceWifi().callMethod('pause', [pause]).then((res) => {
        }).catch(err => {
          console.log('error:', err)
        });
      }
    }
  }

  //开启洗衣机
  openWash () {
    if (this.state.power == 0) {
      //洗衣机未开机
      //暂停或开始洗衣机
      Device.getDeviceWifi().callMethod('set_power', [1]).then((res) => {
        console.log(["openWash.set_wash>>>>", this.state.modelObj]);

        //设置洗衣参数
        Device.getDeviceWifi().callMethod('set_wash', [this.state.modelObj.mode, this.state.modelObj.washwl, this.state.modelObj.wash, this.state.modelObj.rinse, this.state.modelObj.checkdirty, this.state.modelObj.drier, this.state.modelObj.waterid, this.state.modelObj.heat, this.state.modelObj.wlwarn, this.state.modelObj.shower, 0, this.state.modelObj.soak, this.state.modelObj.auto_wl, this.state.ordermin,]).then((res) => {
          console.log(res);
          //现在设置洗衣参数会自动开机,不需要再次调用
          // //设置成功
          // Device.getDeviceWifi().callMethod('pause', [1]).then((res) => {
          //   console.log(res);
          //   //启动洗衣机

          // }).catch(err => { console.log(['error:', err]) });


        }).catch(err => {
          console.log(['error:', err])
        });

      }).catch(err => {
        console.log(['error:', err])
      });
    } else {
      //洗衣机已开机
      //设置洗衣参数
      Device.getDeviceWifi().callMethod('set_wash', [this.state.modelObj.mode, this.state.modelObj.washwl, this.state.modelObj.wash, this.state.modelObj.rinse, this.state.modelObj.checkdirty, this.state.modelObj.drier, this.state.modelObj.waterid, this.state.modelObj.heat, this.state.modelObj.wlwarn, this.state.modelObj.shower, 0, this.state.modelObj.soak, this.state.modelObj.auto_wl, this.state.ordermin,]).then((res) => {
        console.log(res);
        //设置成功
        // Device.getDeviceWifi().callMethod('pause', [1]).then((res) => {
        //   //启动洗衣机

        // }).catch(err => { console.log(['error:', err]) });
      }).catch(err => {
        console.log(['error:', err])
      });
    }

  }

  //预定洗衣
  appointmentWash (ordermin) {
    Device.getDeviceWifi().callMethod('set_wash', [this.state.modelObj.mode, this.state.modelObj.washwl, this.state.modelObj.wash, this.state.modelObj.rinse, this.state.modelObj.checkdirty, this.state.modelObj.drier, this.state.modelObj.waterid, this.state.modelObj.heat, this.state.modelObj.wlwarn, this.state.modelObj.shower, 0, this.state.modelObj.soak, this.state.modelObj.auto_wl, ordermin]).then((res) => {
      if (res.code == 0) {
        //预约成功
      }
    }).catch(err => {
      console.log(['error:', err])
    });
  }

  //验证是否已经验证用户协议
  checkAuthor () {
    Service.smarthome.batchGetDeviceDatas([{ did: Device.deviceID, props: ["prop.s_auth_config"] }]).then(res => {
      console.log('batchGetDeviceDatas ', res);
      let alreadyAuthed = false;
      let result = res[Device.deviceID];
      let config;
      if (result && result['prop.s_auth_config']) {
        config = result['prop.s_auth_config']
      }
      if (config) {
        try {
          let authJson = JSON.parse(config);
          console.log('auth config ', authJson)
          alreadyAuthed = authJson.privacyAuthed && true;
        } catch (err) {
          //json解析失败，不处理
        }
      }
      if (alreadyAuthed) {
        //已授权，不再弹窗显示
        return new Promise.resolve("已经授权")
      } else {
        var options = {
          privacyURL: LocalStrings.getLanguage() == "en" ? require('../resources/privacy_en.htm') : require('../resources/privacy_china.htm'),
          agreementURL: LocalStrings.getLanguage() == "en" ? require('../resources/use_en.htm') : require('../resources/use_china.htm'),
          experiencePlanURL: '',
          hideUserExperiencePlan: true,
        };
        return Host.ui.alertLegalInformationAuthorization(options).then(res => {
          console.log('授权结果', res)
          if (res) {
            return Service.smarthome.batchSetDeviceDatas([{
              did: Device.deviceID,
              props: { "prop.s_auth_config": JSON.stringify({ 'privacyAuthed': 'true' }) }
            }])
          } else {
            return new Promise.reject("取消授权")
          }
        })
      }
    }).catch(err => {
      //没能授权成功
      console.log('授权错误', err)
      Package.exit()
    });
  }

  //超过洗衣次数后提示用户进行桶自洁
  _thanWashCountWarn (washCount) {
    Host.storage.get("thanWashCount").then(res => {
      if ((res == null || res == 0) && washCount >= 90) {
        //值为空,是第一次超出洗衣次数
        this.showLoadingDialog(LocalStrings.PleaseCleantheBucket);
        Host.storage.set('thanWashCount', 1);
      } else {
        var thanNum = res + 1;
        if (washCount >= 90 + thanNum * 45) {
          //每隔45次洗衣后再次提醒一下用户进行桶自洁
          this.showLoadingDialog(LocalStrings.PleaseCleantheBucket);
          Host.storage.set('thanWashCount', thanNum);
        }
      }
    }).catch(error => {

    });
  }


  UNSAFE_componentWillMount () {
    //设置授权
    this.checkAuthor();
    //判断是否要跳转到洗衣报告界面
    this.jumpToWashReport();
  }

  componentDidMount () {
    //初始化预约数据
    this._pickListData();

    //删除洗衣数据
    // this.deleteDatabase();

    //延时操作,初始化洗衣模式
    this.timer = setTimeout(this._initWashData.bind(this), 100);
    //洗衣模式界面传值的监听(本地通知)
    this._eventModelDataList = DeviceEventEmitter.addListener("WashModelEvent", () => {
      this.setState({
        isJumpWashModel: true,
      });

      db = SQLite.openDatabase({ name: database_name, location: 'default' },
        () => {
          //查询洗衣模式然后写进
          this.queryEmployeesWithInfo();
        }, this.errorCB);
    });

    //洗衣编辑页面传值的监听(本地通知)
    this._eventEditDataList = DeviceEventEmitter.addListener("WashEditEvent", () => {
      db = SQLite.openDatabase({ name: database_name, location: 'default' },
        () => {
          //获取列表数据
          this.queryModeList();
          //查询洗衣模式然后写进
          this.queryEmployeesWithInfo();
        }, this.errorCB);
    });

    //洗衣报告开启了智能漂洗(本地通知)
    this._eventReportDataList = DeviceEventEmitter.addListener("WashReportCheckDirtyEvent", () => {
      this.setState({
        wash_id: 20,
      });
      db = SQLite.openDatabase({ name: database_name, location: 'default' },
        () => {
          //获取列表数据
          this.queryModeList();
          //查询洗衣模式然后写进
          this.queryEmployeesWithInfo();
        }, this.errorCB);
    });

    //添加设备的属性和事件的监听
    this._msgSubscription = null
    Device.getDeviceWifi().subscribeMessages('prop.child', 'prop.heat', 'prop.mode', 'prop.model', 'prop.ordermin', 'prop.power', 'prop.start', 'prop.status', 'prop.usetime', 'prop.wash_count', 'event.forget', 'event.warn', 'event.wash_result').then(subcription => {
      this._msgSubscription = subcription;
    }).catch(() => {
    });

    //监听 属性变化和事件响应
    this.listener = DeviceEvent.deviceReceivedMessages.addListener(
      (device, messages) => {
        if (messages.has('prop.child')) {
          this.setState({
            child: messages.get('prop.child')[0]
          })
        } else if (messages.has('prop.heat')) {
          this.setState({
            heat: messages.get('prop.heat')[0]
          })
        } else if (messages.has('prop.mode')) {
          this.setState({
            mode: messages.get('prop.mode')[0]
          })
        } else if (messages.has('prop.ordermin')) {
          this.setState({
            ordermin: messages.get('prop.ordermin')[0]
          })
        } else if (messages.has('prop.power')) {
          this.setState({
            power: messages.get('prop.power')[0]
          })
        } else if (messages.has('prop.start')) {
          this.setState({
            start: messages.get('prop.start')[0]
          })
        } else if (messages.has('prop.status')) {
          this.setState({
            status: messages.get('prop.status')[0]
          })
        } else if (messages.has('prop.usetime')) {
          this.setState({
            usetime: messages.get('prop.usetime')[0]
          })
        } else if (messages.has('prop.wash_count')) {
          this.setState({
            wash_count: messages.get('prop.wash_count')[0]
          })
        } else if (messages.has('event.forget')) {
          if (messages.get('event.forget')[0] > 0) {
            //晾晒遗忘
            this.showMessageDialog(LocalStrings.Pleasedryyourclothes);
          }
        } else if (messages.has('event.warn')) {
          if (messages.get('event.warn')[0] > 0) {
            //有警告信息,因为在属性里已处理,故此处不做处理
          }
        } else if (messages.has('event.wash_result')) {
          //洗衣结果
          var washResult = messages.get('event.wash_result');
          if (washResult && washResult.length >= 8) {
            var washReport = {
              mode: washResult[0],
              checkdirty: washResult[1],
              dirty: washResult[2],
              wash: washResult[3],
              washwl: washResult[4],
              rinse: washResult[5],
              shower: washResult[6],
              usetime: washResult[7],
            }
            this.setState({
              wash_result: washReport,
            });
            this.props.navigation.navigate('WasherReport', {
              title: LocalStrings.Washingreport,
              wash_result: washReport,
            });
          }
        }
        //洗衣机启动状态
        if (this.state.start == 4) {
          this.setState({
            showWarn: true,
          })
        } else {
          this.setState({
            showWarn: false,
          })
        }
      });

    //从云端获取洗衣机的数据数据
    Service.smarthome.batchGetDeviceDatas([{
      did: Device.deviceID,
      props: ['prop.child', 'prop.heat', 'prop.mode', 'prop.model', 'prop.ordermin', 'prop.power', 'prop.start', 'prop.status', 'prop.usetime', 'prop.wash_count']
    }]).then(result => {
      var messages = result[Device.deviceID];
      this.setState({
        child: parseInt(messages['prop.child']),
        heat: parseInt(messages['prop.heat']),
        mode: parseInt(messages['prop.mode']),
        ordermin: parseInt(messages['prop.ordermin']),
        power: parseInt(messages['prop.power']),
        start: parseInt(messages['prop.start']),
        status: parseInt(messages['prop.status']),
        usetime: parseInt(messages['prop.usetime']),
        wash_count: parseInt(messages['prop.wash_count']),
      });

      //洗衣机启动状态
      if (this.state.start == 4) {
        this.setState({
          showWarn: true,
        })
      } else {
        this.setState({
          showWarn: false,
        })
      }
      //'您的洗衣次数已经超过90次，请进行洁桶'
      this._thanWashCountWarn(this.state.wash_count);
    });

    // 设置中改名之后，首页title同步改名
    this._deviceNameChangedListener = DeviceEvent.deviceNameChanged.addListener((device) => {
      this.props.navigation.setParams({
        name: device.name
      });
      this.forceUpdate();
    });

    //添加计时器获取云端的洗衣机参数
    this.interval = setInterval(this.getWashInfoWithClould.bind(this), 7000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
    this.setState = () => false;
    this._eventModelDataList && this._eventModelDataList.remove();
    this._eventEditDataList && this._eventEditDataList.remove();
    this._eventReportDataList && this._eventReportDataList.remove();
    this._msgSubscription && this._msgSubscription.remove();
    this.listener && this.listener.remove();
    this._deviceNameChangedListener && this._deviceNameChangedListener.remove();

  }

  //获取云端数据
  getWashInfoWithClould () {
    //加载属性数据， 内部调用get_prop 方法,Android会依据当前环境选择从本地局域网或者云端获取, iOS因获取不到wifi信息，会默认走云端获取，并将返回数据写成{key:value}格式
    Service.smarthome.batchGetDeviceDatas([{
      did: Device.deviceID,
      props: ['prop.child', 'prop.heat', 'prop.mode', 'prop.model', 'prop.ordermin', 'prop.power', 'prop.start', 'prop.status', 'prop.usetime', 'prop.wash_count']
    }]).then(result => {
      var messages = result[Device.deviceID];
      this.setState({
        child: parseInt(messages['prop.child']),
        heat: parseInt(messages['prop.heat']),
        mode: parseInt(messages['prop.mode']),
        ordermin: parseInt(messages['prop.ordermin']),
        power: parseInt(messages['prop.power']),
        start: parseInt(messages['prop.start']),
        status: parseInt(messages['prop.status']),
        usetime: parseInt(messages['prop.usetime']),
        wash_count: parseInt(messages['prop.wash_count']),
      });

    }).catch(error => {
    });
  }

  jumpToWashReport () {
    var extraInfo = Package.entryInfo;
    // console.log(["extraInfo>>>>", extraInfo]);
    if (extraInfo.event == "wash_result") {
      //跳出洗衣结果界面
      if (extraInfo.value.length >= 8) {
        //返回信息齐全,可以直接传值
        var washResult = extraInfo.value;
        var washReport = {
          mode: washResult[0],
          checkdirty: washResult[1],
          dirty: washResult[2],
          wash: washResult[3],
          washwl: washResult[4],
          rinse: washResult[5],
          shower: washResult[6],
          usetime: washResult[7],
        }
        this.setState({
          wash_result: washReport,
        });

        this.props.navigation.navigate('WasherReport', {
          title: LocalStrings.Washingreport,
          wash_result: washReport,
        });

      } else {
        //返回信息不全,需要通过时间戳获取历史信息
        //时间戳
        var timestamp = extraInfo.time;
        var params = {
          did: Device.deviceID,
          key: "wash_result",
          type: "event",
          time_start: timestamp - 200,
          time_end: timestamp + 60,
        };

        Service.smarthome.getDeviceData(params).then(response => {

          if (response.code == 0) {
            //成功
            if (response['result'].length <= 0) {
              return;
            }
            var washResult = JSON.parse(response['result'][0]['value']);
            var washReport = {
              mode: washResult[0],
              checkdirty: washResult[1],
              dirty: washResult[2],
              wash: washResult[3],
              washwl: washResult[4],
              rinse: washResult[5],
              shower: washResult[6],
              usetime: washResult[7],
            }

            this.setState({
              wash_result: washReport,
            });

            this.props.navigation.navigate('WasherReport', {
              title: LocalStrings.Washingreport,
              wash_result: washReport,
            });
          }
        }).catch(error => {
        });

      }
    }
  }


}

var styles;
styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F7F9FA',
    alignItems: 'center',
  },

  //警告界面
  warnCenterBack: {
    marginLeft: 23 * ratio,
    marginTop: 148 * ratio,
    marginRight: 23 * ratio,
    // height:186*ratio,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    // flexDirection: 'column',
    alignItems: 'center',

  },

  warnTitle: {
    marginTop: 36 * ratio,
    fontSize: 14 * ratio,
    color: '#333',

  },

  warnSecTitle: {
    marginTop: 19 * ratio,
    fontSize: 13 * ratio,
    color: '#18c0ee',

  },

  warnConOne: {
    marginTop: 11 * ratio,
    fontSize: 12 * ratio,
    color: '#939393',
  },

  warnConSec: {
    marginTop: 6 * ratio,
    fontSize: 12 * ratio,
    color: '#939393',
  },

  //预约视图
  appointmentBack: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    top: 0,
    left: 0,
  },

  pickCenterBack: {
    marginLeft: 23 * ratio,
    marginTop: 148 * ratio,
    marginRight: 23 * ratio,
    height: 186 * ratio,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },

  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // height: window.height < 500? 100 : 180 * ratio,
    height: 130 * ratio,
    width: ScreenWidth - 46 * ratio,
    overflow: 'hidden',
    backgroundColor: '#fff',

  },
  picker: {
    width: 100 * ratio,
    fontSize: 37,
  },

  pickCenter: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 37,
    marginTop: -5,
  },

  buttonAllBack: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    // flex: 1,
    // height:55*ratio,
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
    width: (ScreenWidth - 46 * ratio) / 2.0,
    alignItems: 'center',
    marginTop: 19.5 * ratio,
  },

  // 更多的视图
  moreBaseBack: {
    marginLeft: 0,
    marginRight: 0,
    height: 48 * ratio,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#E1E2E4',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },

  moreBaseText: {
    marginLeft: 58 * ratio,
    fontSize: 14 * ratio,
    color: '#333',
  },

  topBack: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#D9DADB',
    height: 72.0 * Dimensions.get('window').width / 375,
    width: Dimensions.get('window').width,
  },

  topBase: {
    //Dimensions.get('window').height,
    backgroundColor: '#F7F9FA',
    marginTop: 1,
    marginBottom: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: (Dimensions.get('window').width - 3.0) / 4.0,
    alignItems: 'center',
  },


  timeTitle: {
    marginTop: isIPad ? 60.0 * Dimensions.get('window').height / 667 : 89.0 * Dimensions.get('window').height / 667,
    alignItems: 'center',
    color: '#787878',
    fontSize: 14.0 * ratio,
  },
  timeSub: {
    marginTop: 13.0 * Dimensions.get('window').height / 667,
    alignItems: 'center',
    fontSize: 42.0 * Dimensions.get('window').height / 667,
    color: '#787878',
  },

  timeDownBack: {
    marginTop: 14,
    width: ScreenWidth,
    height: 15 * ratio,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  timeDownLeft: {
    // marginLeft:118*ratio,
    fontSize: 13 * ratio,
    color: '#b4b4b4',

  },

  timeDownRight: {
    marginLeft: 38 * ratio,
    fontSize: 13 * ratio,
    color: '#b4b4b4',
  },

  switchBack: {
    marginTop: isIPad ? 90.0 * Dimensions.get('window').height / 667 : 114.0 * Dimensions.get('window').height / 667,
    height: 73.0 * ratio,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  switchBaseOne: {

    position: 'absolute',
    top: 20 * ratio + iphonexTop,
    right: 20 * ratio,
    width: 50.0 * (Dimensions.get('window').width - 3.0) / 375,
    height: 73.0 * ratio,
    alignItems: 'center',

  },

  switchBaseTitle: {
    marginTop: 0 * ratio,
    color: '#A7A8A9',
    fontSize: 12 * ratio,
  },

  switchBaseOneImage: {
    marginTop: 8 * Dimensions.get('window').height / 667,
    // width: 56.0*(Dimensions.get('window').width-3.0)/375,
    // height: 45.0*ratio,
    width: 25.0 * ratio,
    height: 25.0 * ratio,
  },


  switchBaseSec: {
    marginLeft: 12.0 * ratio,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    width: 112.0 * (Dimensions.get('window').width - 3.0) / 375,
    height: 73.0 * ratio,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    alignItems: 'center',
  },

  switchBaseSecTitleNomal: {
    marginTop: 15 * Dimensions.get('window').height / 667,
    color: '#b4b4b4',
    fontSize: 10 * Dimensions.get('window').height / 667,

  },

  switchBaseSecTitleSel: {
    marginTop: 15 * Dimensions.get('window').height / 667,
    color: '#27d1f0',
    fontSize: 10 * Dimensions.get('window').height / 667,

  },


  switchBaseSecCon: {
    width: 56 * ratio,
    height: 25 * ratio,
    borderWidth: 1,
    borderRadius: 12.5 * ratio,
    borderColor: '#27d1f0',
    // backgroundColor: '#F7F9FA',
    backgroundColor: '#27d1f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11 * ratio,
    // fontSize:11,
    overflow: 'hidden',
  },


  modelBack: {
    marginTop: 6 * ratio,
    height: 133.0 * ratio,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    // flexDirection:'row',
    // backgroundColor:'#ffffff',
  },

  modeImageBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 133.0 * ratio,
    width: Dimensions.get('window').width,
  },

  modelBase: {
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: 83 * Dimensions.get('window').width / 375,
    height: 95.0 * ratio,
    alignItems: 'center',
  },

  modelBaseImage: {
    marginTop: 22 * ratio,
    width: 61 * ratio,
    height: 61 * ratio,
  },


  bottomBack: {
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  bottomBase: {
    marginTop: 0,
    flexDirection: 'column',
    // justifyContent:'space-around',
    width: 81 * ratio,
    height: 105.0 * ratio,
    alignItems: 'center',
  },

  bottomBaseImage: {
    marginTop: 18 * ratio,
    width: 35 * ratio,
    height: 35.0 * ratio,
  },

  bottomBaseTitle: {
    marginTop: 15 * ratio,

  }
});
