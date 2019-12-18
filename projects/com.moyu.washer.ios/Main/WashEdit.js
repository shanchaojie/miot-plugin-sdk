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
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  DeviceEventEmitter,
  TextInput,
} from 'react-native';

var thatOBJ;

var window = Dimensions.get('window');
var ratio = window.width / 375;
var ScreenWidth = window.width;
var ScreenHeight = window.height;

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


// const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const isIPad = ScreenWidth >= 768 ? true : false;
const iphonexTop = isIphoneX() ? 24 : 0;

export default class MainPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEdit: 0,//正在编辑
      mode_list: [],//mode数组
      mode_choose_list: [],//已选中mode
      mode_not_list: [],//未选中mode列表
      mode_del_list: [],//删除mode的列表
      choosedMode: {},
      newViewText: "",
      showNewView: false,
      showDeleteView: true,
    };
  }

  render () {
    return (
      <View style={styles.container} >
        <StatusBar barStyle='default' />
        <Text style={styles.modeTitle}>{LocalStrings.Existing}</Text>
        {this._editChoosedBaseView()}
        <Text style={styles.modeTitle}>{LocalStrings.Optional}</Text>
        {this._editNotChoosedBaseView()}
        <TouchableOpacity style={styles.buttonBack} onPress={() => {
          this.props.navigation.goBack();
        }}>
          <View style={styles.buttonBack}>
            <Text style={styles.buttonText}>{LocalStrings.Complete}</Text>
          </View>
        </TouchableOpacity>
        {/*{this._showNewViewInfo()}*/}
        {/*{this._showDeleteViewInfo()}*/}
      </View>
    );
  }

  //已有功能
  _editChoosedBaseView () {
    var chooseViewArr = [];
    for (var i = 0; i < this.state.mode_choose_list.length; i++) {
      var viewData;
      viewData = this.state.mode_choose_list[i]
      chooseViewArr.push(
        <View style={styles.modeBaseBack} key={i}>
          <Text style={styles.modeBaseText}>{this.getWashModelName(viewData.name)}</Text>
          <TouchableOpacity style={styles.modeBaseIcon} onPress={this._choosedTouch(i).bind(this)}>
            <Image style={styles.modeBaseIcon} source={viewData.type == 0 ? require('../resources/modeEditNoCan.png') : require('../resources/modeEditRemove.png')}
              resizeMode={'stretch'}
              pointerEvents={viewData.type == 0 ? 'none' : 'auto'}></Image>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.modeAllBack}>
        {chooseViewArr.map((elem, index) => {
          return elem;
        })}
      </View>
    )
  }

  //可选功能
  _editNotChoosedBaseView () {
    var chooseViewArr = [];
    for (var i = 0; i < this.state.mode_not_list.length; i++) {
      var viewData;
      viewData = this.state.mode_not_list[i];
      chooseViewArr.push(
        <View style={styles.modeBaseBack} key={i}>
          <Text style={styles.modeBaseText}>{this.getWashModelName(viewData.name)}</Text>
          <TouchableOpacity style={styles.modeBaseIcon} onPress={this._notChoosedTouch(i).bind(this)}>
            <Image style={styles.modeBaseIcon} source={viewData.type == 0 ? require('../resources/modeEditNoCan.png') : require('../resources/modeEditAdd.png')}
              resizeMode={'stretch'}
              pointerEvents={(this.state.isEdit == 1 && viewData.type == 0) ? 'none' : 'auto'}></Image>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.modeAllBack}>
        {chooseViewArr.map((elem, index) => {
          return elem;
        })}
      </View>
    )
  }

  //显示新视图
  _showNewViewInfo () {
    if (this.state.showNewView) {
      return (
        <View style={styles.viewBack}>
          <View style={styles.viewCenterBack}>
            <View style={styles.viewContainer}>
              <TextInput style={styles.inputBack}>
              </TextInput>
            </View>
            {/*按钮*/}
            <View style={styles.buttonAllBack}>
              <TouchableOpacity onPress={this.nextOnClick.bind(this)}>
                <View style={styles.buttonBaseBack}>
                  <Text style={{ fontSize: 15 * ratio, color: '#383939' }}>{LocalStrings.Next}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.buttonDivMid}></View>
              <TouchableOpacity onPress={this.buttonOffClick.bind(this)}>
                <View style={styles.buttonBaseBack}>
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

  //显示删除视图
  _showDeleteViewInfo (data) {
    if (this.state.showDeleteView) {
      return (
        <View style={styles.viewBack}>
          <View style={[styles.viewCenterBack]}>
            <View style={[styles.viewContainer, { alignItems: 'center' }]}>
              <Text style={styles.viewCenTitle}>确定删除此程序?</Text>
              <View style={styles.viewCenName}>
                <Text style={{
                  fontSize: 13 * ratio,
                  color: '#fff', marginTop: 13 * ratio
                }}>{data.name}</Text>
              </View>

            </View>
            {/*按钮*/}
            <View style={styles.buttonAllBack}>
              <TouchableOpacity onPress={this.deleteOnClick.bind(this)}>
                <View style={styles.buttonBaseBack}>
                  <Text style={{ fontSize: 15 * ratio, color: '#383939' }}>确定</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.buttonDivMid}></View>
              <TouchableOpacity onPress={this.buttonOffClick.bind(this)}>
                <View style={styles.buttonBaseBack}>
                  <Text style={{ fontSize: 15 * ratio, color: '#383939' }}>取消</Text>
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

      } case "牛仔": {
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

  //已有功能
  _choosedTouch (index) {
    function modelSub () {
      var modeObj = this.state.mode_choose_list[index];
      if (this.state.isEdit == true) {
        //可编辑模式
        if (modeObj.type == 1) {
          //非基础类型
          this.setState({
            choosedMode: modeObj,
            showDeleteView: true,
          })
        }

      } else {
        //不可编辑模式
        if (modeObj.type == 0) {

        } else {
          //
          //减去mode
          var sql = `UPDATE Models SET isChoosed = 0 WHERE wash_id = '${modeObj.wash_id}'`;
          this.updateDatbase(sql);
        }
      }
      this.queryModeList();
    }
    return modelSub;
  }

  //可选功能
  _notChoosedTouch (index) {
    function modelSub () {

      var modeObj = this.state.mode_not_list[index];
      if (this.state.isEdit == true) {
        //可编辑模式
        if (modeObj.type == 1) {
          //非基础类型
          //删除mode
          var sql = `DELETE FROM  Models WHERE wash_id = '${modeObj.wash_id}'`;
          this.updateDatbase(sql);
        }

      } else {
        //不可编辑模式
        //加mode
        var sql = `UPDATE Models SET isChoosed = 1 WHERE wash_id = '${modeObj.wash_id}'`;
        this.updateDatbase(sql);
      }
      this.queryModeList();
    }
    return modelSub;
  }

  //下一步按钮的响应事件
  nextOnClick () {
    var show = this.state.showNewView;
    this.setState({
      showNewView: false,
    })

    this.queryModeList();

  }

  //删除按钮的响应事件
  deleteOnClick () {
    var show = this.state.showDeleteView;
    this.setState({
      showDeleteView: false,
    })
    //删除mode
    var sql = `DELETE FROM  Models WHERE wash_id = '${this.state.choosedMode.wash_id}'`;
    this.updateDatbase(sql);
    this.queryModeList();

  }

  //取消按钮的响应事件
  buttonOffClick () {
    this.setState({
      showNewView: false,
      showDeleteView: false,
    })
  }


  //跳转到编辑程序的响应事件
  _onOpenSubPage (modelID, subPageComponent) {
    function subPage () {
      var wash_id = thatOBJ.state.mode_choose_list[modelID].wash_id;
      this.setState({
        modelIndex: modelID,
        wash_id: thatOBJ.state.mode_choose_list[modelID].wash_id,
        mode: thatOBJ.state.mode_choose_list[modelID].mode,
      });
      this.queryEmployeesWithInfo(modelID);//查询
      this.props.navigation.navigate(
        subPageComponent,
        {
          modelID: wash_id,
        },
      );
    }
    return subPage;
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


  //获取列表数据
  queryModeList () {
    //开启数据库
    var that = this;
    //查询数据库
    db.transaction((tx) => {
      //查询已选中的数据
      tx.executeSql(`SELECT * FROM Models WHERE isChoosed = 1`, [], (tx, results) => {

        var choosed_list = [];
        for (var i = 0; i < results.rows.length; i++) {
          choosed_list.push(results.rows.item(i));
        }
        thatOBJ.setState({
          mode_choose_list: choosed_list,
        });

      });
      //查询未选中的数据
      tx.executeSql(`SELECT * FROM Models WHERE isChoosed = 0`, [], (tx, results) => {
        var notChoose_list = [];
        for (var i = 0; i < results.rows.length; i++) {
          notChoose_list.push(results.rows.item(i));
        }
        thatOBJ.setState({
          mode_not_list: notChoose_list,
        });
        console.log("notIsChoosed>>>>>>>>>>> ", thatOBJ.state.mode_not_list);
      });
    });
  }

  //查询数据库
  queryEmployees (tx) {
    var that = this;
    console.log("Executing employee query");
    tx.executeSql("SELECT * FROM Models").then(([tx, results]) => {
      console.log("Query completed");
      let row = results.rows.item(0);
      console.log("results==== ", results.rows.item(0));
    }).catch((error) => {
      console.log(error);
    });
  }

  //根据条件查询数据库
  queryEmployeesWithInfo (modeId) {
    //开启数据库
    var that = this;
    // //查询数据库
    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM Models WHERE wash_id = ${modeId}`, [], (tx, results) => {
        let row = results.rows.item(0);

      });

    });

  }


  componentWillMount () {
    thatOBJ = this;
    // this.deleteDatabase();
    //打开数据库
    db = SQLite.openDatabase({ name: database_name, location: 'default' },
      () => {
        this.queryModeList();
      }, this.errorCB);

  }

  componentDidMount () {
    //视图加载完成
  }

  componentWillUnmount () {
    this.closeDatabase();
    DeviceEventEmitter.emit('WashEditEvent');

  }
}

var styles;
styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F1F2F4',
  },

  modeTitle: {
    marginTop: 18 * ratio + iphonexTop,
    marginLeft: 9 * ratio,
    fontSize: 14 * ratio,
    color: '#A8A9AB',
  },

  mode_not_listTitle: {
    marginTop: 32 * ratio,
    marginLeft: 9 * ratio,
    fontSize: 14 * ratio,
    color: '#A8A9AB',
  },


  modeAllBack: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 7 * ratio,
    width: ScreenWidth - 14 * ratio,
    marginTop: 0,
    alignItems: 'center',
  },

  modeBaseBack: {
    marginTop: 10 * ratio,
    borderRadius: 5 * ratio,
    borderWidth: 1.5 * ratio,
    borderColor: '#F1F2F4',
    width: (ScreenWidth - 14 * ratio) / 3.0,
    height: 40 * ratio,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  modeBaseIcon: {
    width: 30 * ratio,
    height: 30 * ratio,
    marginRight: 6 * ratio,
  },

  modeBaseText: {
    fontSize: 14 * ratio,
    color: '#333',
    // marginRight:
  },


  modeShadowBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 118 * ratio,
    height: 40 * ratio,
    shadowColor: '#333',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5 * ratio,
  },

  buttonBack: {
    borderColor: '#909192',
    borderTopWidth: 1,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: isIphoneX ? 34 : 0,
    height: 56 * ratio,
    alignItems: 'center',
  },

  buttonText: {
    marginTop: 20 * ratio,
    fontSize: 15 * ratio,
    color: '#333',
  },

  //预约视图
  viewBack: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight - 64,
    backgroundColor: '#333333',
    top: 0,
    left: 0,
  },

  viewCenterBack: {
    marginLeft: 23 * ratio,
    marginTop: 148 * ratio,
    marginRight: 23 * ratio,
    height: 186 * ratio,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },

  inputBack: {
    marginLeft: 24 * ratio,
    marginRight: 24 * ratio,
    marginTop: 50 * ratio,
    height: 38 * ratio,
    borderRadius: 19 * ratio,
    borderColor: '#C4C5C7',
    borderWidth: 1 * ratio,
    overflow: 'hidden',

  },

  viewCenTitle: {
    marginTop: 35 * ratio,
    fontSize: 15 * ratio,
    color: '#333',
  },

  viewCenName: {
    marginTop: 16 * ratio,
    backgroundColor: '#F22933',
    width: 118 * ratio,
    height: 40,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
  },

  viewContainer: {
    height: 130 * ratio,
    width: ScreenWidth - 46 * ratio,

  },

  buttonAllBack: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },

  buttonDivMid: {
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    width: 1,
    backgroundColor: '#97999A',
  },

  buttonBaseBack: {
    height: 54 * ratio,
    width: (ScreenWidth - 46 * ratio) / 2.0,
    alignItems: 'center',
    marginTop: 19.5 * ratio,
  },


});


