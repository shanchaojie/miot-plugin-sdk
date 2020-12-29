import LocalizedStrings from '../CommonModules/LocalizedStrings';
import IntlMessageFormat from 'intl-messageformat';
import 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/zh-Hans.js';
import 'intl/locale-data/jsonp/zh-Hant.js';
import 'intl/locale-data/jsonp/ko-KR.js';
export const strings = {
  'en': {
    NUM_PHOTOS: 'You have {numPhotos, plural, ' +
      '=0 {no photos.}' +
      '=1 {one photo.}' +
      'other {# photos.}}',
    t1: 'tttttttt',
    t2: ['tl{1}'],
    t3: ['tt{1},{2}', [0, 'zero'], [1, 'one'], [2, 'two,{2}', 1], [v => v > 100, 'more']],
    t4: {
      t5: [() => 'akjasdkljflkasdjf'],
      t6: ['yyy{1}'],
    },
    setting: "setting",
    featureSetting: "Shortcut settings",
    commonSetting: "Common settings",
    deviceName: "Device name",
    locationManagement: "Locations",
    shareDevice: "Share device",
    ifttt: "Automation",
    firmwareUpgrate: "Check for firmware updates",
    moreSetting: "Additional settings",
    addToDesktop: "Add to Home screen",
    resetDevice: "Remove device",
    licenseAndPolicy: "User Agreement & Privacy Policy",

    License: "License",
    Policy: "Policy",
    //Smart Baby
    MoyuSmartBaby: "Moyu Washing Machine",
    TimeLeft: "Time Left",
    OperatingMode: "Operating Mode",
    ChildLock: "Child Lock",
    Reservation: "Reservation",
    Power: "Power",
    Start: "Start",
    Pause: "Pause",
    Set: "Set",
    Cancel: "Cancel",
    ProgramEdit: "Program Edit",
    GeneralSetting: "General Setting",
    UseHelp: "Use Help",

    WaitingToStart: "Waiting to Start",
    Waitingforpower: "Waiting for power",
    Pausing: "Pausing",
    Waring: "Waring",

    Standby: "Standby",
    FuzzyWeighing: "Fuzzy Weighing",
    SoakingOperation: "Soaking Operation",
    Washing: "Washing",
    Rinsing: "Rinsing",
    Dehydrating: "Dehydrating",
    Reservation1: "Reservation",
    WashingCompleted: "Washing Completed",
    Pausing1: "Pausing",

    // ProgramEdit:"Program Edit",
    DailyWashing: "Daily",
    UnderwearWashing: "Undies",
    BabyWashing: "Baby",
    OnlyDehydrate: "Only Dehy",
    BucketCleaning: "Clean Bucket",
    CottonFabric: "Cotton",
    Linen: "Linen",
    Jeans: "Jeans",
    Cashmere: "Cashmere",
    Polyester: "Polyester",
    Silk: "Silk",
    Chiffon: "Chiffon",
    Wool: "Wool",
    PlushToy: "Plush Toy",
    SmartRinsing: "Smart Rinse",
    Smart: "Smart",

    WaterLevel: "Water level",
    Level: "Level",
    SmallMediummLarge: "Small Mediumm Large",
    Washingtime: "Washing time",
    Minute: "Minute",
    Rinsetimes: "Rinse times",
    Dehydrationtime: "Dehydration time",
    Heatingtemperature: "Heating temperature",
    Washingstrength: "Washing strength",
    Soakbeforewashing: "Soak before washing",
    Hightemperaturesterilization: "High temperature sterilization",
    Automaticwaterlevel: "Automatic water level",
    Dripping: "Dripping",

    Whethertostartsmartrinsing: "Whether to start smart rinsing",
    Detectingimpurities: "Smart rinsing: Detecting impurities in the water through a dirt sensor until the water meets the cleanliness criteria and stops rinsing",
    Pleasecallournationalservicehotline: "Please call our national service hotline",
    Erroroccured: "Error occured",
    Errorcause: "Error cause",
    Aproblemwiththeheater: "A problem with the heater sensor",
    Methodofexclusion: "Method of exclusion",
    Canceltheheatingoperation: "Cancel the heating operation after 10 seconds of alarm",
    Callforwarranty: "Call 400-620-1306 for warranty",
    Thefaucetisnotturnedon: "The faucet is not turned on",
    Inletvalveblocked: "Inlet valve blocked",
    Waterpressureistoolow: "Water pressure is too low",
    Openthefaucet: "Open the faucet, then open the door and close it",
    Cleantheinletvalve: "Clean the inlet valve,then open the door and close",
    Reusewhenthewaterpressure: "Re-use when the water pressure reaches the allowable value",
    Solved: "Solved",
    Unsolved: "Unsolved",
    Whetherthedrainputdown: "Whether the drain put down",
    Whetherthedrainblocked: "Whether the drain blocked",
    Putdownthedrain: "Put down the drain, then open the door and close",
    Removeforeignobjects: "Remove foreign objects, then open the door and close",
    Clothingdeviation: "Clothing deviation",
    Whetherthewashingmachineistilted: "Whether the washing machine is tilted",
    Rearrangetheclothesandclosethedoor: "Rearrange the clothes and close the door",
    Placethewashingmachine: "Place the washing machine horizontally, open the door and close",
    Doorisnotclosed: "Door is not closed",
    Closethedoor: "Close the door",
    Abnormalwaterlevelsensor: "Abnormal water level sensor or poor contact",
    Replugthepower: "Re-plug the power after power off",
    Aproblemwiththetemperature: "A problem with the temperature sensor",
    Automaticallycanceltheheating: " Automatically cancel the heating operation after 10 seconds of alarm",
    Calledforrepairs: "Called for repairs",
    Heaterdryburning: "Heater dry burning",
    Turnoffthepowerandrestart: "Turn off the power and restart",
    Thisalarmstilloccursafterrestarting: "This alarm still occurs after restarting",
    Thefuzzyvalueislessthan: "The fuzzy value is less than 5 or greater than 100",
    Restartafterturningoffthepower: "Restart after turning off the power",
    Thereisaproblem: "There is a problem with the external crystal circuit",
    Call: "Call",

    Next: "Next",
    Time: "Time",
    Washingreport: "Washing report",
    Noresidueofdetergent: "No residue of detergent",
    Totalrinsing: "Total rinsing",
    Times: "times",
    Therinsingmeetsthewashingstandard: "The rinsing meets the washing standard",
    Detergentresidue: "Detergent residue",
    Therinsingdidnotmeetthewashing: "The rinsing did not meet the washing standards, it is recommended to use intelligent rinsing.",
    Bottlesofmineralwater: "bottles",

    MakingAppointments: "Making Appointments",
    Watertemperature: "Water temperature",
    onnwarning: "non-warning",
    Inflowovertimealarm: "Inflow overtime alarm ",
    Drainingovertimealarm: "Draining overtime alarm",
    Coveropeningalarm: "Cover opening alarm",
    Dehydrationunbalancealarm: "Dehydration unbalance alarm",
    Abnormalalarmofwaterlevelsensor: "Abnormal alarm of water level sensor",
    Childrenlockalarm: "Children lock alarm",
    Fuzzyanomalyalarm: "Fuzzy anomaly alarm",
    Turbiditysensorfailure: "Turbidity sensor failure",
    Heatingsensorfailure: "Heating sensor failure",
    Heatingpipefailure: "Heating pipe failure",
    Dryburningfailure: "Dry burning failure",
    Longpressentersetup: "Long press enter setup",

    Coveropening: "Cover opening",
    Openthecoverwithin5seconds: "Open the cover within 5 seconds,  close the cover",
    Openthecovermorethan5seconds: "Open the cover more than 5 seconds, turn off the power and restart",
    Pleasecalltheservicehotline: "Please call the service hotline",
    Thereservationtimeshouldbemorethan2hours: "The reservation time should be more than 2 hours",
    Failedcalling: "Failed calling",

    Weak: "Weak",
    Mid: "Mid",
    Strong: "Strong",
    Optional: "Optional",
    Existing: "Existing",
    Complete: "Complete",
    Watersaving: "Water saving",
    Useofwater: "Use of water",
    Theappointmenttime: "The appointment time must be more than 2 hours!",
    Thechildlockbutton: "The child lock button can be activated only when the washing machine is running!",
    PleaseCleantheBucket: "Your laundry has been more than 90 times, please clean the bucket",
    Pleasedryyourclothes: "Please dry your clothes",
    Cleanbucketmodeisnoteditable: "Clean bucket mode is not editable",
  },
  'zh': {
    NUM_PHOTOS: 'Usted {numPhotos, plural, ' +
      '=0 {no tiene fotos.}' +
      '=1 {tiene una foto.}' +
      'other {tiene # fotos.}}',
    t1: 'tttttttt',
    t2: ['tt{1}'],
    t3: ['tt{1},{2}', [0, 'zero'], [1, 'one'], [2, 'two,{2}', 1], [v => v > 100, 'more']],
    t4: {
      t5: [() => 'akjasdkljflkasdjf'],
      t6: ['yyy{1}'],
    },
    setting: "设置",
    featureSetting: "功能设置",
    commonSetting: "通用设置",
    deviceName: "设备名称",
    locationManagement: "位置管理",
    shareDevice: "设备共享",
    ifttt: "智能",
    firmwareUpgrate: "检查固件升级",
    moreSetting: "更多设置",
    addToDesktop: "添加到桌面",
    resetDevice: "删除设备",
    licenseAndPolicy: "使用条款和隐私政策",

    License: "使用条款",
    Policy: "隐私政策",
    MoyuSmartBaby: "摩鱼智能母婴洗衣机",
    TimeLeft: "剩余时间 ",
    OperatingMode: "工作模式",
    ChildLock: "童锁",
    Reservation: "预约",
    Power: "电源",
    Start: "启动",
    Pause: "暂停",
    Set: "确定",
    Cancel: "取消",
    ProgramEdit: "程序编辑",
    GeneralSetting: "通用设置",
    UseHelp: "使用帮助",

    WaitingToStart: "等待开启",
    Waitingforpower: "等待电源",
    Pausing: "暂停中",
    Waring: "报警",

    Standby: "待机状态",
    FuzzyWeighing: "模糊称重中",
    SoakingOperation: "浸泡运行中",
    Washing: "洗涤运行中",
    Rinsing: "漂洗运行中",
    Dehydrating: "脱水运行中",
    Reservation1: "预约运行中",
    WashingCompleted: "洗涤完成",
    Pausing1: "暂停状态",

    // ProgramEdit:"Program Edit",
    DailyWashing: "日常",
    UnderwearWashing: "内衣",
    BabyWashing: "婴儿",
    OnlyDehydrate: "单脱",
    BucketCleaning: "桶自洁",
    CottonFabric: "棉布",
    Linen: "麻布",
    Jeans: "牛仔",
    Cashmere: "羊绒",
    Polyester: "涤纶",
    Silk: "丝绸",
    Chiffon: "雪纺",
    Wool: "呢绒",
    PlushToy: "毛绒玩具",
    SmartRinsing: "智能漂洗",
    Smart: "智能漂洗",

    WaterLevel: "水位选择",
    Level: "档",
    SmallMediummLarge: "1档 2档 3档",
    Washingtime: "洗涤时间",
    Minute: "分钟",
    Rinsetimes: "漂洗次数",
    Dehydrationtime: "脱水时间",
    Heatingtemperature: "加热温度",
    Washingstrength: "洗涤强度",
    Soakbeforewashing: "洗前浸泡",
    Hightemperaturesterilization: "高温杀菌",
    Automaticwaterlevel: "自动水位",
    Dripping: "淋漂",

    Whethertostartsmartrinsing: "是否启动智能漂洗",
    Detectingimpurities: "智能漂洗：通过污浊度感应器检测水中的杂质，直至水质符合洁净标准后停止漂洗",
    Pleasecallournationalservicehotline: "请拨打全国服务热线",
    Erroroccured: "出现故障",
    Errorcause: "故障原因",
    Aproblemwiththeheater: "加热传感器故障",
    Methodofexclusion: "排除方法",
    Canceltheheatingoperation: "报警10秒后取消加热运行",
    Callforwarranty: "拨打400-620-1306进行保修",
    Thefaucetisnotturnedon: "水龙头未打开",
    Inletvalveblocked: "进水阀堵塞",
    Waterpressureistoolow: "水压过低",
    Openthefaucet: "打开水龙头，打开门盖再合上",
    Cleantheinletvalve: "清理进水阀，打开门盖再合上",
    Reusewhenthewaterpressure: "等水压达到允许值时再使用",
    Solved: "已解决",
    Unsolved: "未解决",
    Whetherthedrainputdown: "排水管是否放下",
    Whetherthedrainblocked: "排水管是否堵塞",
    Putdownthedrain: "放下排水管，打开门盖再合上",
    Removeforeignobjects: "清除异物，打开门盖再合上",
    Clothingdeviation: "衣物放偏",
    Whetherthewashingmachineistilted: "洗衣机是否倾斜",
    Rearrangetheclothesandclosethedoor: "重新整理衣物，盖上门盖",
    Placethewashingmachine: "洗衣机水平放置，打开门盖再关上",
    Doorisnotclosed: "门盖未关",
    Closethedoor: "合上门盖",
    Abnormalwaterlevelsensor: "水位传感器异常或接触不良",
    Replugthepower: "断电后重新插上电源",
    Aproblemwiththetemperature: "温度传感器有问题",
    Automaticallycanceltheheating: "报警10秒后自动取消加热运行",
    Calledforrepairs: "已报修",
    Heaterdryburning: "加热器干烧",
    Turnoffthepowerandrestart: "关闭电源，关电重启",
    Thisalarmstilloccursafterrestarting: "重启后仍然出现此种报警",
    Thefuzzyvalueislessthan: "模糊值小于5或大于100",
    Restartafterturningoffthepower: "关断电源后重启",
    Thereisaproblem: "外部晶振电路有问题",
    Call: "拨打",

    Next: "下一步",
    Time: "时间",
    Washingreport: "洗涤报告",
    Noresidueofdetergent: "洗涤剂无残留",
    Totalrinsing: "共漂洗",
    Times: "次",
    Therinsingmeetsthewashingstandard: "本次漂洗达到洗涤标准",
    Detergentresidue: "洗涤剂残留",
    Therinsingdidnotmeetthewashing: "本次漂洗未达到洗涤标准，建议使用智能漂洗",
    Bottlesofmineralwater: "瓶矿泉水",

    MakingAppointments: "预约时间",
    Watertemperature: "水温",
    onnwarning: "无报警",
    Inflowovertimealarm: "进水超时报警",
    Drainingovertimealarm: "排水超时报警",
    Coveropeningalarm: "开盖报警",
    Dehydrationunbalancealarm: "脱水不平衡报警",
    Abnormalalarmofwaterlevelsensor: "水位传感器异常报警",
    Childrenlockalarm: "童锁报警",
    Fuzzyanomalyalarm: "模糊异常报警",
    Turbiditysensorfailure: "污浊度传感器故障",
    Heatingsensorfailure: "加热传感器故障",
    Heatingpipefailure: "加热管失效",
    Dryburningfailure: "干烧故障",
    Longpressentersetup: "长按进入设置模式",

    Coveropening: "门盖打开",
    Openthecoverwithin5seconds: "门盖打开5秒以内，合上门盖",
    Openthecovermorethan5seconds: "门盖打开5秒以上，关电重启",
    Pleasecalltheservicehotline: "请拨打全国服务热线",
    Thereservationtimeshouldbemorethan2hours: "预约时间需大于2个小时",
    Failedcalling: "拨打电话失败",

    Weak: "弱",
    Mid: "中",
    Strong: "强",
    Optional: "可选功能",
    Existing: "已有功能",
    Complete: "完成",
    Watersaving: "节水量",
    Useofwater: "用水量",
    Theappointmenttime: "预约时间需大于2个小时!",
    Thechildlockbutton: "洗衣机运行状态下才能启用童锁按钮!",
    PleaseCleantheBucket: "您的洗衣次数已经超过90次，请进行洁桶",
    Pleasedryyourclothes: "请晾晒您的衣物",
    Cleanbucketmodeisnoteditable: "洁桶模式不可编辑",
  },
  'zh-tw': {
    NUM_PHOTOS: 'You have {numPhotos, plural, ' +
      '=0 {no photos.}' +
      '=1 {one photo.}' +
      'other {# photos.}}',
    setting: "设置",
    featureSetting: "功能设置",
    commonSetting: "通用设置",
    deviceName: "设备名称",
    locationManagement: "位置管理",
    shareDevice: "设备共享",
    ifttt: "智能",
    firmwareUpgrate: "检查固件升级",
    moreSetting: "更多设置",
    addToDesktop: "添加到桌面",
    resetDevice: "删除设备",
    licenseAndPolicy: "使用条款和隐私政策",

    License: "使用条款",
    Policy: "隐私政策",
    MoyuSmartBaby: "摩鱼智能母婴洗衣机",
    TimeLeft: "剩余时间 ",
    OperatingMode: "工作模式",
    ChildLock: "童锁",
    Reservation: "预约",
    Power: "电源",
    Start: "启动",
    Pause: "暂停",
    Set: "确定",
    Cancel: "取消",
    ProgramEdit: "程序编辑",
    GeneralSetting: "通用设置",
    UseHelp: "使用帮助",

    WaitingToStart: "等待开启",
    Waitingforpower: "等待电源",
    Pausing: "暂停中",
    Waring: "报警",

    Standby: "待机状态",
    FuzzyWeighing: "模糊称重中",
    SoakingOperation: "浸泡运行中",
    Washing: "洗涤运行中",
    Rinsing: "漂洗运行中",
    Dehydrating: "脱水运行中",
    Reservation1: "预约运行中",
    WashingCompleted: "洗涤完成",
    Pausing1: "暂停状态",

    // ProgramEdit:"Program Edit",
    DailyWashing: "日常",
    UnderwearWashing: "内衣",
    BabyWashing: "婴儿",
    OnlyDehydrate: "单脱",
    BucketCleaning: "桶自洁",
    CottonFabric: "棉布",
    Linen: "麻布",
    Jeans: "牛仔",
    Cashmere: "羊绒",
    Polyester: "涤纶",
    Silk: "丝绸",
    Chiffon: "雪纺",
    Wool: "呢绒",
    PlushToy: "毛绒玩具",
    SmartRinsing: "智能漂洗",
    Smart: "智能漂洗",

    WaterLevel: "水位选择",
    Level: "档",
    SmallMediummLarge: "1档 2档 3档",
    Washingtime: "洗涤时间",
    Minute: "分钟",
    Rinsetimes: "漂洗次数",
    Dehydrationtime: "脱水时间",
    Heatingtemperature: "加热温度",
    Washingstrength: "洗涤强度",
    Soakbeforewashing: "洗前浸泡",
    Hightemperaturesterilization: "高温杀菌",
    Automaticwaterlevel: "自动水位",
    Dripping: "淋漂",

    Whethertostartsmartrinsing: "是否启动智能漂洗",
    Detectingimpurities: "智能漂洗：通过污浊度感应器检测水中的杂质，直至水质符合洁净标准后停止漂洗",
    Pleasecallournationalservicehotline: "请拨打全国服务热线",
    Erroroccured: "出现故障",
    Errorcause: "故障原因",
    Aproblemwiththeheater: "加热传感器故障",
    Methodofexclusion: "排除方法",
    Canceltheheatingoperation: "报警10秒后取消加热运行",
    Callforwarranty: "拨打400-620-1306进行保修",
    Thefaucetisnotturnedon: "水龙头未打开",
    Inletvalveblocked: "进水阀堵塞",
    Waterpressureistoolow: "水压过低",
    Openthefaucet: "打开水龙头，打开门盖再合上",
    Cleantheinletvalve: "清理进水阀，打开门盖再合上",
    Reusewhenthewaterpressure: "等水压达到允许值时再使用",
    Solved: "已解决",
    Unsolved: "未解决",
    Whetherthedrainputdown: "排水管是否放下",
    Whetherthedrainblocked: "排水管是否堵塞",
    Putdownthedrain: "放下排水管，打开门盖再合上",
    Removeforeignobjects: "清除异物，打开门盖再合上",
    Clothingdeviation: "衣物放偏",
    Whetherthewashingmachineistilted: "洗衣机是否倾斜",
    Rearrangetheclothesandclosethedoor: "重新整理衣物，盖上门盖",
    Placethewashingmachine: "洗衣机水平放置，打开门盖再关上",
    Doorisnotclosed: "门盖未关",
    Closethedoor: "合上门盖",
    Abnormalwaterlevelsensor: "水位传感器异常或接触不良",
    Replugthepower: "断电后重新插上电源",
    Aproblemwiththetemperature: "温度传感器有问题",
    Automaticallycanceltheheating: "报警10秒后自动取消加热运行",
    Calledforrepairs: "已报修",
    Heaterdryburning: "加热器干烧",
    Turnoffthepowerandrestart: "关闭电源，关电重启",
    Thisalarmstilloccursafterrestarting: "重启后仍然出现此种报警",
    Thefuzzyvalueislessthan: "模糊值小于5或大于100",
    Restartafterturningoffthepower: "关断电源后重启",
    Thereisaproblem: "外部晶振电路有问题",
    Call: "拨打",

    Next: "下一步",
    Time: "时间",
    Washingreport: "洗涤报告",
    Noresidueofdetergent: "洗涤剂无残留",
    Totalrinsing: "共漂洗",
    Times: "次",
    Therinsingmeetsthewashingstandard: "本次漂洗达到洗涤标准",
    Detergentresidue: "洗涤剂残留",
    Therinsingdidnotmeetthewashing: "本次漂洗未达到洗涤标准，建议使用智能漂洗",
    Bottlesofmineralwater: "瓶矿泉水",

    MakingAppointments: "预约时间",
    Watertemperature: "水温",
    onnwarning: "无报警",
    Inflowovertimealarm: "进水超时报警",
    Drainingovertimealarm: "排水超时报警",
    Coveropeningalarm: "开盖报警",
    Dehydrationunbalancealarm: "脱水不平衡报警",
    Abnormalalarmofwaterlevelsensor: "水位传感器异常报警",
    Childrenlockalarm: "童锁报警",
    Fuzzyanomalyalarm: "模糊异常报警",
    Turbiditysensorfailure: "污浊度传感器故障",
    Heatingsensorfailure: "加热传感器故障",
    Heatingpipefailure: "加热管失效",
    Dryburningfailure: "干烧故障",
    Longpressentersetup: "长按进入设置模式",

    Coveropening: "门盖打开",
    Openthecoverwithin5seconds: "门盖打开5秒以内，合上门盖",
    Openthecovermorethan5seconds: "门盖打开5秒以上，关电重启",
    Pleasecalltheservicehotline: "请拨打全国服务热线",
    Thereservationtimeshouldbemorethan2hours: "预约时间需大于2个小时",
    Failedcalling: "拨打电话失败",

    Weak: "弱",
    Mid: "中",
    Strong: "强",
    Optional: "可选功能",
    Existing: "已有功能",
    Complete: "完成",
    Watersaving: "节水量",
    Useofwater: "用水量",
    Theappointmenttime: "预约时间需大于2个小时!",
    Thechildlockbutton: "洗衣机运行状态下才能启用童锁按钮!",
    PleaseCleantheBucket: "您的洗衣次数已经超过90次，请进行洁桶",
    Pleasedryyourclothes: "请晾晒您的衣物",
    Cleanbucketmodeisnoteditable: "洁桶模式不可编辑",
  },
  'zh-hk': {
    NUM_PHOTOS: 'You have {numPhotos, plural, ' +
      '=0 {no photos.}' +
      '=1 {one photo.}' +
      'other {# photos.}}',
    setting: "设置",
    featureSetting: "功能设置",
    commonSetting: "通用设置",
    deviceName: "设备名称",
    locationManagement: "位置管理",
    shareDevice: "设备共享",
    ifttt: "智能",
    firmwareUpgrate: "检查固件升级",
    moreSetting: "更多设置",
    addToDesktop: "添加到桌面",
    resetDevice: "删除设备",
    licenseAndPolicy: "使用条款和隐私政策",

    License: "使用条款",
    Policy: "隐私政策",
    MoyuSmartBaby: "摩鱼智能母婴洗衣机",
    TimeLeft: "剩余时间 ",
    OperatingMode: "工作模式",
    ChildLock: "童锁",
    Reservation: "预约",
    Power: "电源",
    Start: "启动",
    Pause: "暂停",
    Set: "确定",
    Cancel: "取消",
    ProgramEdit: "程序编辑",
    GeneralSetting: "通用设置",
    UseHelp: "使用帮助",

    WaitingToStart: "等待开启",
    Waitingforpower: "等待电源",
    Pausing: "暂停中",
    Waring: "报警",

    Standby: "待机状态",
    FuzzyWeighing: "模糊称重中",
    SoakingOperation: "浸泡运行中",
    Washing: "洗涤运行中",
    Rinsing: "漂洗运行中",
    Dehydrating: "脱水运行中",
    Reservation1: "预约运行中",
    WashingCompleted: "洗涤完成",
    Pausing1: "暂停状态",

    // ProgramEdit:"Program Edit",
    DailyWashing: "日常",
    UnderwearWashing: "内衣",
    BabyWashing: "婴儿",
    OnlyDehydrate: "单脱",
    BucketCleaning: "桶自洁",
    CottonFabric: "棉布",
    Linen: "麻布",
    Jeans: "牛仔",
    Cashmere: "羊绒",
    Polyester: "涤纶",
    Silk: "丝绸",
    Chiffon: "雪纺",
    Wool: "呢绒",
    PlushToy: "毛绒玩具",
    SmartRinsing: "智能漂洗",
    Smart: "智能漂洗",

    WaterLevel: "水位选择",
    Level: "档",
    SmallMediummLarge: "1档 2档 3档",
    Washingtime: "洗涤时间",
    Minute: "分钟",
    Rinsetimes: "漂洗次数",
    Dehydrationtime: "脱水时间",
    Heatingtemperature: "加热温度",
    Washingstrength: "洗涤强度",
    Soakbeforewashing: "洗前浸泡",
    Hightemperaturesterilization: "高温杀菌",
    Automaticwaterlevel: "自动水位",
    Dripping: "淋漂",

    Whethertostartsmartrinsing: "是否启动智能漂洗",
    Detectingimpurities: "智能漂洗：通过污浊度感应器检测水中的杂质，直至水质符合洁净标准后停止漂洗",
    Pleasecallournationalservicehotline: "请拨打全国服务热线",
    Erroroccured: "出现故障",
    Errorcause: "故障原因",
    Aproblemwiththeheater: "加热传感器故障",
    Methodofexclusion: "排除方法",
    Canceltheheatingoperation: "报警10秒后取消加热运行",
    Callforwarranty: "拨打400-620-1306进行保修",
    Thefaucetisnotturnedon: "水龙头未打开",
    Inletvalveblocked: "进水阀堵塞",
    Waterpressureistoolow: "水压过低",
    Openthefaucet: "打开水龙头，打开门盖再合上",
    Cleantheinletvalve: "清理进水阀，打开门盖再合上",
    Reusewhenthewaterpressure: "等水压达到允许值时再使用",
    Solved: "已解决",
    Unsolved: "未解决",
    Whetherthedrainputdown: "排水管是否放下",
    Whetherthedrainblocked: "排水管是否堵塞",
    Putdownthedrain: "放下排水管，打开门盖再合上",
    Removeforeignobjects: "清除异物，打开门盖再合上",
    Clothingdeviation: "衣物放偏",
    Whetherthewashingmachineistilted: "洗衣机是否倾斜",
    Rearrangetheclothesandclosethedoor: "重新整理衣物，盖上门盖",
    Placethewashingmachine: "洗衣机水平放置，打开门盖再关上",
    Doorisnotclosed: "门盖未关",
    Closethedoor: "合上门盖",
    Abnormalwaterlevelsensor: "水位传感器异常或接触不良",
    Replugthepower: "断电后重新插上电源",
    Aproblemwiththetemperature: "温度传感器有问题",
    Automaticallycanceltheheating: "报警10秒后自动取消加热运行",
    Calledforrepairs: "已报修",
    Heaterdryburning: "加热器干烧",
    Turnoffthepowerandrestart: "关闭电源，关电重启",
    Thisalarmstilloccursafterrestarting: "重启后仍然出现此种报警",
    Thefuzzyvalueislessthan: "模糊值小于5或大于100",
    Restartafterturningoffthepower: "关断电源后重启",
    Thereisaproblem: "外部晶振电路有问题",
    Call: "拨打",

    Next: "下一步",
    Time: "时间",
    Washingreport: "洗涤报告",
    Noresidueofdetergent: "洗涤剂无残留",
    Totalrinsing: "共漂洗",
    Times: "次",
    Therinsingmeetsthewashingstandard: "本次漂洗达到洗涤标准",
    Detergentresidue: "洗涤剂残留",
    Therinsingdidnotmeetthewashing: "本次漂洗未达到洗涤标准，建议使用智能漂洗",
    Bottlesofmineralwater: "瓶矿泉水",

    MakingAppointments: "预约时间",
    Watertemperature: "水温",
    onnwarning: "无报警",
    Inflowovertimealarm: "进水超时报警",
    Drainingovertimealarm: "排水超时报警",
    Coveropeningalarm: "开盖报警",
    Dehydrationunbalancealarm: "脱水不平衡报警",
    Abnormalalarmofwaterlevelsensor: "水位传感器异常报警",
    Childrenlockalarm: "童锁报警",
    Fuzzyanomalyalarm: "模糊异常报警",
    Turbiditysensorfailure: "污浊度传感器故障",
    Heatingsensorfailure: "加热传感器故障",
    Heatingpipefailure: "加热管失效",
    Dryburningfailure: "干烧故障",
    Longpressentersetup: "长按进入设置模式",

    Coveropening: "门盖打开",
    Openthecoverwithin5seconds: "门盖打开5秒以内，合上门盖",
    Openthecovermorethan5seconds: "门盖打开5秒以上，关电重启",
    Pleasecalltheservicehotline: "请拨打全国服务热线",
    Thereservationtimeshouldbemorethan2hours: "预约时间需大于2个小时",
    Failedcalling: "拨打电话失败",

    Weak: "弱",
    Mid: "中",
    Strong: "强",
    Optional: "可选功能",
    Existing: "已有功能",
    Complete: "完成",
    Watersaving: "节水量",
    Useofwater: "用水量",
    Theappointmenttime: "预约时间需大于2个小时!",
    Thechildlockbutton: "洗衣机运行状态下才能启用童锁按钮!",
    PleaseCleantheBucket: "您的洗衣次数已经超过90次，请进行洁桶",
    Pleasedryyourclothes: "请晾晒您的衣物",
    Cleanbucketmodeisnoteditable: "洁桶模式不可编辑",
  },
  'ko': {
    NUM_PHOTOS: 'You have {numPhotos, plural, ' +
      '=0 {no photos.}' +
      '=1 {one photo.}' +
      'other {# photos.}}',
    featureSetting: '바로가기 설정',
    commonSetting: '일반 설정',
    deviceName: '기기 이름',
    locationManagement: '위치',
    shareDevice: '기기 공유',
    ifttt: '자동화',
    firmwareUpgrate: '펌웨어 업데이트 확인',
    moreSetting: '추가 설정',
    addToDesktop: '홈 화면에 추가',
    resetDevice: '기기 초기화',
    licenseAndPolicy: '이용 약관 & 개인 정보 보호 정책',
  },
};
export const localStrings = new LocalizedStrings(strings);

export function getString (key, obj = null) {
  if (obj) {
    return new IntlMessageFormat(localStrings[key], localStrings.language).format(obj);
  } else {
    return localStrings[key];
  }
}