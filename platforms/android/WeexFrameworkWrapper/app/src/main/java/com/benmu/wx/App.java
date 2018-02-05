package com.benmu.wx;

import android.app.Application;
import android.content.Context;

import com.benmu.framework.BMInitConfig;
import com.benmu.framework.BMWXApplication;
import com.benmu.framework.BMWXEngine;
import com.benmu.wx.utils.ScanUtil;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.common.WXException;

/**
 * Created by Carry on 2017/8/23.
 */

public class App extends BMWXApplication {
    public Application mInstance;

    //btscan
    private static Context mContext;

    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;

        //btscan
        mContext = getApplicationContext();
        try {
            WXSDKEngine.registerModule("scanUtil", ScanUtil.class);
        } catch (WXException e) {
            e.printStackTrace();
        }


    }

    //btscan
    public static Context getmContext() {
        return mContext;
    }

}
