
import React from 'react';
import { Device, Entrance, Host, Package, PackageEvent } from "miot";
import App from "./Main";
PackageEvent.packageAuthorizationCancel.addListener(() => {
    // 用户撤销授权,需要清除缓存
    console.log("packageAuthorizationCancel");
    let licenseKey = "license-" + Device.deviceID;
    Host.storage.set(licenseKey, false);
    Package.exit();
})
PackageEvent.packageViewWillAppear.addListener(() => { console.log("packageViewWillAppear") });
PackageEvent.packageWillLoad.addListener(() => { console.log("packageWillLoad") });
PackageEvent.packageDidLoaded.addListener(() => { console.log("packageDidLoaded") });
PackageEvent.packageDidResume.addListener(() => { console.log("packageDidResume") });
PackageEvent.packageWillPause.addListener(() => { console.log("packageWillPause") });
PackageEvent.packageWillExit.addListener(() => { console.log("packageWillExit") });
// Package.disableAutoCheckUpgrade = true;
Package.entry(App, _ => {
});

