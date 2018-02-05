package com.benmu.wx.utils;

import android.bluetooth.BluetoothAdapter;
import android.util.Log;
import android.widget.Toast;

import com.benmu.wx.App;
import com.skybeacon.sdk.RangingBeaconsListener;
import com.skybeacon.sdk.ScanServiceStateCallback;
import com.skybeacon.sdk.locate.SKYBeacon;
import com.skybeacon.sdk.locate.SKYBeaconManager;
import com.skybeacon.sdk.locate.SKYRegion;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by 12755 on 2017/9/9.
 */

public class ScanUtil extends WXModule {

    private Map<String, iBeaconView> map = new HashMap<>();
    private SKYBeaconManager manager = SKYBeaconManager.getInstance();
    private BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter(); //蓝牙适配器
    private Date date = new Date();

    @JSMethod
    public void checkBluetooth(final JSCallback checkCallBack){
        if (bluetoothAdapter != null && bluetoothAdapter.isEnabled()) {
            checkCallBack.invokeAndKeepAlive(true);
        }else{
            checkCallBack.invokeAndKeepAlive(false);
        }
    }

    @JSMethod
    public void startRanging(String str, final JSCallback dataCallback) {

        manager.setBroadcastKey("AB11221498756731BCD7D8E239E765AD52B7139DE87654DAB27394BCD7D792A");
        manager.init(App.getmContext());
        //设置数据缓存时间，单位毫秒，默认缓存5000毫秒的数据
        manager.setCacheTimeMillisecond(5000);
        //设置返回数据时间间隔，单位毫秒，默认为1200毫秒返回一次
        manager.setScanTimerIntervalMillisecond(1200);

        manager.startScanService(new ScanServiceStateCallback() {
            @Override
            public void onServiceDisconnected() {
                Toast.makeText(mWXSDKInstance.getContext(), "启动扫描服务失败", Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onServiceConnected() {
                manager.startRangingBeacons(null);
            }
        });

        manager.setRangingBeaconsListener(new RangingBeaconsListener() {
            @Override
            public void onRangedBeacons(SKYRegion beaconRegion, @SuppressWarnings("rawtypes") List beaconList) {
                Log.i("mytest", "Listener" + new Date() + "");
                date = new Date();
                setBeaconMapUnFind(map);
                for (int i = 0; i < beaconList.size(); i++) {
                    String mac = ((SKYBeacon) beaconList.get(i)).getDeviceAddress();
                    map.put(mac, copyProperties(beaconList, i));
                }
//                    stateCallback.invokeAndKeepAlive(true);
                dataCallback.invokeAndKeepAlive(new ArrayList<>(map.values()));
            }

            @Override
            public void onRangedBeaconsMultiIDs(SKYRegion beaconRegion, @SuppressWarnings("rawtypes") List beaconMultiIDsList) {
                // TODO Auto-generated method stub
            }

            @Override
            public void onRangedNearbyBeacons(SKYRegion skyRegion, List list) {
                // TODO Auto-generated method stub
            }
        });
    }

    @JSMethod
    public void stopRanging(JSCallback callback) {
        manager.stopScanService();
        manager.stopRangingBeasons(null);
    }

    @JSMethod
    public void clearList(JSCallback callback) {
        map.clear();
        callback.invoke(true);
    }

    @JSMethod
    public void initScanUtil(final JSCallback callback) {

        new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Thread.sleep(2000);
                        long difference = Math.abs(new Date().getTime() - date.getTime());
                        if (difference > 3000) {
                            setBeaconMapUnFind(map);
                            callback.invokeAndKeepAlive(new ArrayList<>(map.values()));
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    @JSMethod
    public void setAlias(String mac, String alias, JSCallback callback) {
        if (map.get(mac) != null) {
            // map
            map.get(mac).alias = alias;
            // sharedPre
            SharedPrefsUtil.putValue(App.getmContext(), mac, alias);
        }
        callback.invoke(new ArrayList<>(map.values()));
    }

    private void setBeaconMapUnFind(Map<String, iBeaconView> map) {
        for (String key : map.keySet()) {
            map.get(key).isFind = false;
        }
    }

    private iBeaconView copyProperties(@SuppressWarnings("rawtypes") List beaconList, int i) {
        java.text.DecimalFormat   df=new   java.text.DecimalFormat("#.##");
        String mac = ((SKYBeacon) beaconList.get(i)).getDeviceAddress();
        iBeaconView beacon = new iBeaconView();

        //别名
        beacon.alias = SharedPrefsUtil.getValue(App.getmContext(), mac, "");

        beacon.isFind = true;
        //beacon.isMultiIDs = false;
        beacon.mac = ((SKYBeacon) beaconList.get(i)).getDeviceAddress();
        //rssi - ：场强，dBm
        beacon.rssi = ((SKYBeacon) beaconList.get(i)).getRssi();
        //distance - ：距离，m
        beacon.distance = ((SKYBeacon) beaconList.get(i)).getDistance();
        //电量
        beacon.battery = ((SKYBeacon) beaconList.get(i)).getBattery();
        Log.i("yjz", "battery" + ((SKYBeacon) beaconList.get(i)).getBattery()  + "");
        beacon.name = null;
        beacon.proximityUUID = null;
        beacon.uuidReplaceName = null;

//        beacon.major = null;
//        beacon.minir = null;

//        beacon.version = String.valueOf(((SKYBeacon) beaconList.get(i)).getHardwareVersion()) + "."
//                + String.valueOf(((SKYBeacon) beaconList.get(i)).getFirmwareVersionMajor()) + "."
//                + String.valueOf(((SKYBeacon) beaconList.get(i)).getFirmwareVersionMinor());
        return beacon;
    }

}
