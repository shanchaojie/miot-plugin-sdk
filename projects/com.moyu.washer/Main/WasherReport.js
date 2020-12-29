'use strict';

import React from 'react'
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
  DeviceEventEmitter,
  TouchableOpacity,

} from 'react-native';


import { Device, Package, Host, DeviceEvent, Service } from "miot";
import TitleBar from 'miot/ui/TitleBar';
import { localStrings as LocalStrings } from './MHLocalizableString.js';
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';

var window = Dimensions.get('window');
var ratio = window.width / 375;
var ScreenWidth = window.width;
var ScreenHeight = window.height;

import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "mijia.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;
let db;

var thatOBJ;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default class WasherReport extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      wash_result: {},
      modelObj: {},//智能漂洗
      power: 0,//开关机
      start: 0,//暂停或启动，0未启动 1启动 2暂停 3预约中 4故障
      status: 0,
      isStartWash: false,
      showCheckDrity: false,
    };
  }

  render () {
    return (
      <View style={styles.container} >
        <StatusBar barStyle='default' />
        <View style={styles.scrBack}>
          <ScrollView>
            <View style={styles.topBack}>
              <Image style={styles.backImage} source={require('../resources/washReportBackgroup.png')} resizeMode={'stretch'}></Image>
              <Image style={styles.iconTop} source={this.state.wash_result.dirty == 1 ? require('../resources/reportSad.png') : require('../resources/reportFace.png')} resizeMode={'stretch'}></Image>
              <Text style={styles.titleTop}>{this.state.wash_result.dirty == 1 ? LocalStrings.Detergentresidue : LocalStrings.Noresidueofdetergent}</Text>
              <Text style={styles.detailTop}>{this.state.wash_result.dirty == 1 ? LocalStrings.Therinsingdidnotmeetthewashing : LocalStrings.Totalrinsing + (this.state.wash_result.mode == 3 ? 0 : this.state.wash_result.rinse) + LocalStrings.Times + "," + LocalStrings.Therinsingmeetsthewashingstandard}</Text>
              {this.state.wash_result.dirty == 1 ? (<TouchableOpacity style={styles.listBtn} onPress={() => {
                this.setState({
                  showCheckDrity: true,
                })
              }}>
                <Text style={styles.listBtnText}>{LocalStrings.SmartRinsing}</Text>
              </TouchableOpacity>) : null}
            </View>
            {/* </Image> */}

            <View style={styles.listBack}>
              <View style={styles.listTopBack}>
                <Image style={styles.listIcon} source={require('../resources/reportWater.png')} resizeMode={'stretch'}></Image>
                <View style={styles.listMidBack}>
                  <Text style={styles.listMidTitle}>{LocalStrings.Watersaving}</Text>
                  <Text style={styles.listMidCon}>{this.getWaterSave().water_save}L</Text>
                </View>
                <View style={styles.saveWaterBack}>
                  <Text style={styles.listRightSecText}>{Math.round(this.getWaterSave().water_save / 0.5)}{LocalStrings.Bottlesofmineralwater}</Text>
                  <Image style={styles.listRightIcon} source={require('../resources/reportMineral.png')} resizeMode={'stretch'}></Image>
                </View>
              </View>
              <View style={{ backgroundColor: '#E6E7E8', width: Dimensions.get('window').width, height: 1 }}></View>
            </View>
            <View style={styles.listBack}>
              <View style={styles.listTopBack}>
                <Image style={styles.listIcon} source={require('../resources/reportOneWater.png')} resizeMode={'stretch'}></Image>
                <View style={styles.listMidBack}>
                  <Text style={styles.listMidTitle}>{LocalStrings.Useofwater}</Text>
                </View>
                <View style={styles.listRightOneBack}>
                  <Text style={styles.listRightOneText}>{this.getWaterSave().water_user}L</Text>
                </View>

              </View>
              <View style={{ backgroundColor: '#E6E7E8', width: Dimensions.get('window').width, height: 1 }}></View>
            </View>
            <View style={styles.listBack}>
              <View style={styles.listTopBack}>
                <Image style={styles.listIcon} source={require('../resources/reportTime.png')} resizeMode={'stretch'}></Image>
                <View style={styles.listMidBack}>
                  <Text style={styles.listMidTitle}>{LocalStrings.Time}</Text>
                </View>
                <View style={styles.listRightOneBack}>
                  <Text style={styles.listRightOneText}>{this.state.wash_result.usetime}MIN</Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#E6E7E8', width: Dimensions.get('window').width, height: 1 }}></View>
            </View>
          </ScrollView>
        </View>
        {this.showCheckDrityView()}
      </View>
    );
  }

  showCheckDrityView () {
    if (this.state.showCheckDrity) {
      //显示智能漂洗界面
      return (
        <View style={styles.appointmentBack}>
          <View style={[styles.appointmentBack, { backgroundColor: '#333', opacity: 0.5 }]}></View>
          <View style={styles.warnCenterBack}>
            <Text style={styles.warnTitle}>{LocalStrings.Whethertostartsmartrinsing}</Text>
            {/*原因*/}
            <Text style={styles.warnSecTitle}>{LocalStrings.Detectingimpurities}</Text>

            {/*按钮*/}
            <View style={[styles.buttonAllBack, { height: 55 * ratio, marginTop: 35 * ratio, borderTopColor: '#939393', }]}>
              <TouchableOpacity onPress={this.goheckdirty.bind(this)}>
                <View style={styles.buttonBack}>
                  <Text style={{ fontSize: 15 * ratio, color: '#18c0ee', }}>{LocalStrings.Set}</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.buttonDivMid, { backgroundColor: '#939393' }]}></View>
              <TouchableOpacity onPress={() => {
                this.setState({
                  showCheckDrity: false,
                })
              }}>
                <View style={styles.buttonBack}>
                  <Text style={{ fontSize: 15 * ratio, color: '#383939' }}>{LocalStrings.Cancel}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      return null;
    }
  }


  //进行智能漂洗
  goheckdirty () {

    this.setState({
      showCheckDrity: false,
    })

    if (this.isNotObjectEmpty(this.state.modelObj)) {
      //已经存在智能漂洗的参数
      this.openWash();

    } else {
      //不存在智能漂洗的参数
      this.setState({
        isStartWash: true,
      })

      this.queryEmployeesWithInfo();
    }
  }

  isNotObjectEmpty (obj) {

    for (var key in obj) {
      return true;
    }

    return false;
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


  //根据条件查询数据库
  queryEmployeesWithInfo () {
    //开启数据库
    var that = this;
    //打开数据库
    db = SQLite.openDatabase({ name: database_name, location: 'default' },
      () => {
        // //查询数据库
        db.transaction((tx) => {
          //更新数据库信息
          db.executeSql(`UPDATE Models SET isChoosed = 1 WHERE wash_id = 20`);
          //查询数据库信息
          tx.executeSql(`SELECT * FROM Models WHERE wash_id = 20`, [], (tx, results) => {
            let row = results.rows.item(0);
            thatOBJ.setState({
              modelObj: row,
            });
          });

          if (thatOBJ.state.isStartWash) {
            thatOBJ.setState({
              isStartWash: false,
            });
          }
          //回调监听
          DeviceEventEmitter.emit('WashReportCheckDirtyEvent');
          thatOBJ.openWash();
        });
      }, this.errorCB);
  }

  //开启洗衣机
  openWash () {
    //界面返回前一个界面
    this.props.navigation.goBack();
    Device.getDeviceWifi().callMethod('set_power', [1]).then((res) => {
      console.log(res);
      Device.getDeviceWifi().callMethod('set_wash', [this.state.modelObj.mode, this.state.modelObj.washwl, this.state.modelObj.wash, this.state.modelObj.rinse, this.state.modelObj.checkdirty, this.state.modelObj.drier, this.state.modelObj.waterid, this.state.modelObj.heat, this.state.modelObj.wlwarn, this.state.modelObj.shower, 0, this.state.modelObj.soak, this.state.modelObj.auto_wl, 0,]).then((res) => {
        console.log(res);
        //现在设置洗衣参数会自动开机,所以不需要再次开启
        // Device.getDeviceWifi().callMethod('pause', [1]).then((res) => {
        //   console.log(res);
        // }).catch(err => { console.log('error:', err) });
      }).catch(err => { console.log('error:', err) });
    }).catch(err => { console.log('error:', err) });
  }

  //获取节水量
  getWaterSave () {

    if (this.state.wash_result.mode == 3) {
      return {
        water_user: 0,
        water_save: 0,
      }
    }

    var rinse = this.state.wash_result.rinse;
    let rjs = [0, 14, 17.6, 21, 26];
    var wash = this.state.wash_result.wash > 0 ? 1 : 0;
    var shower;
    if (this.state.wash_result.shower) {
      shower = 1;
      rinse--;
    } else {
      shower = 0;
    }

    var water_user = (wash + rinse) * rjs[this.state.wash_result.washwl] + shower * 8;
    var water_save = water_user * 0.17;

    return {
      water_user: water_user,
      water_save: water_save.toFixed(2),
    };
  }


  componentDidMount () {

    thatOBJ = this;

    this.setState({
      wash_result: this.props.navigation.state.params.wash_result,
    });

    console.log(["dirty>>>>>>>", this.props.navigation.state.params.wash_result]);
    if (this.state.wash_result.dirty == 1) {
      //需要进行智能漂洗
      this.queryEmployeesWithInfo();

    } else {

    }

    Service.smarthome.batchGetDeviceDatas([{ did: Device.deviceID, props: ['prop.power', 'prop.start', 'prop.status'] }]).then(result => {
      var messages = result[Device.deviceID];
      this.setState({
        power: parseInt(messages['prop.power']),
        start: parseInt(messages['prop.start']),
        status: parseInt(messages['prop.status']),
      });

    }).catch(error => {
      console.log(["error>>>>>>>", error]);
    });

    //监听属性
    //订阅消息
    this.msgSubscription = null
    Device.getDeviceWifi().subscribeMessages("prop.power", "prop.start", "prop.status").then((subcription) => {
      this.msgSubscription = subcription;
    }).catch((error) => {

    });

    this.listener = DeviceEvent.deviceReceivedMessages.addListener(
      (device, messages) => {
        if (messages.has('prop.power')) {
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
        }
      });
  }

  componentWillUnmount () {
    this.msgSubscription && this.msgSubscription.remove();
    this.listener && this.listener.remove();
  }
}



var styles;
styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  scrBack: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 64,
    flexDirection: 'column',
  },

  topBack: {
    width: Dimensions.get('window').width,
    height: 350 * Dimensions.get('window').height / 667,
    marginTop: 0,
    alignItems: 'center',
  },

  backImage: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: 350 * Dimensions.get('window').height / 667,
  },

  iconTop: {
    marginTop: 73 * ratio,
    width: 42 * ratio,
    height: 42 * ratio,

  },

  titleTop: {
    marginTop: 25 * ratio,
    fontSize: 15 * ratio,
    color: '#fff',
  },

  detailTop: {
    marginTop: 18 * ratio,
    fontSize: 14 * ratio,
    color: '#fff',

  },

  weathBack: {
    marginTop: 99 * Dimensions.get('window').height / 667,
    width: Dimensions.get('window').width,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',

  },

  topTemperature: {
    marginLeft: 42 * Dimensions.get('window').width / 375,
    fontSize: 45,
    color: '#ffffff',
  },

  topWeather: {
    marginLeft: 9 * Dimensions.get('window').width / 375,
    fontSize: 12,
    color: '#ffffff',
  },

  topTip: {
    marginTop: 15 * Dimensions.get('window').height / 667,
    marginLeft: 42 * Dimensions.get('window').width / 375,
    fontSize: 12,
    color: '#ffffff',
  },

  topSecBack: {
    marginTop: 97 * Dimensions.get('window').height / 667,
    marginBottom: 0,
    width: Dimensions.get('window').width,
    // height:80*Dimensions.get('window').height/667,
    backgroundColor: '#666666',
    opacity: 0.5,
    flexDirection: 'row',
    alignItems: 'center',

  },

  secBase: {
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent:'space-around',
    width: Dimensions.get('window').width / 3.0,
    height: 80 * Dimensions.get('window').height / 667,

  },

  listBack: {
    width: Dimensions.get('window').width,
    height: 62 * Dimensions.get('window').height / 667,
    backgroundColor: '#ffffff',

  },

  listTopBack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 62 * Dimensions.get('window').height / 667 - 1,
  },

  listIcon: {
    marginLeft: 30 * Dimensions.get('window').width / 375,
    width: 23.0,
    height: 23.0,
  },

  listMidBack: {
    // alignItems:'center',
    marginLeft: 22 * Dimensions.get('window').width / 375,
    width: 101 * Dimensions.get('window').width / 375,
    height: 62 * Dimensions.get('window').height / 667 - 1,
    marginRight: 80 * Dimensions.get('window').width / 375,

  },

  listMidTitle: {
    marginTop: 19 * Dimensions.get('window').height / 667,
    fontSize: 14,
    color: '#333333',

  },

  ListMidSecTitle: {

    marginTop: 5 * Dimensions.get('window').height / 667,
    fontSize: 14,
    color: '#333333',

  },

  listMidCon: {
    marginTop: 5 * Dimensions.get('window').height / 667,
    marginBottom: 3 * Dimensions.get('window').height / 667,
    fontSize: 10,
    color: '#9B9C9D'

  },

  saveWaterBack: {
    marginRight: 27 * Dimensions.get('window').width / 375,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 100,
  },

  listRightIcon: {
    // marginRight: 27 * Dimensions.get('window').width / 375,
    width: 13,
    height: 28,

  },

  listRightSecText: {
    // marginRight: 8 * Dimensions.get('window').width / 375,
    fontSize: 12,
    color: '#79D5F3',
  },

  listRightOneBack: {
    width: 90 * Dimensions.get('window').width / 375,
    marginRight: 31 * Dimensions.get('window').width / 375,
    alignItems: 'flex-end',
  },

  listRightOneText: {
    // marginRight:31*Dimensions.get('window').width/375,
    fontSize: 12,
    color: '#79D5F3',
  },

  listRightBtn: {
    marginRight: 19 * Dimensions.get('window').width / 375,

  },

  listBtn: {
    marginTop: 23 * ratio,
    width: 98 * Dimensions.get('window').width / 375,
    height: 33 * Dimensions.get('window').width / 375,
    backgroundColor: '#fff',
    // marginRight:19*Dimensions.get('window').width/375,
    borderRadius: 16.5 * Dimensions.get('window').width / 375,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 10 * ratio,
  },

  listBtnText: {
    color: '#27C6F0',
    fontSize: 13 * Dimensions.get('window').width / 375,
  },

  //智能漂洗弹出窗
  //预约视图
  appointmentBack: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight - 64,
    top: 0,
    left: 0,
  },

  //警告界面
  warnCenterBack: {
    marginLeft: 23 * ratio,
    marginTop: 148 * ratio,
    marginRight: 23 * ratio,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    // flexDirection:'row',
    alignItems: 'center',

  },

  warnTitle: {
    marginTop: 36 * ratio,
    fontSize: 14 * ratio,
    color: '#333',
  },

  warnSecTitle: {
    marginTop: 19 * ratio,
    marginLeft: 15 * ratio,
    marginRight: 15 * ratio,
    fontSize: 11 * ratio,
    color: '#777777',

  },

  buttonAllBack: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
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



});


