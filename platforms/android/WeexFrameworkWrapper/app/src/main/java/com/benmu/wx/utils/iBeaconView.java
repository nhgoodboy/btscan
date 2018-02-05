package com.benmu.wx.utils;

public class iBeaconView {
	public String mac = "";
	public int rssi = -1;
	public String detailInfo;
	public boolean isMultiIDs = false;
	public int battery = 100;

	public String name = "";
	public String alias = "";
	public double distance;
	public String version;
	public String proximityUUID;
	public String uuidReplaceName;
	public int major;
	public int minir;

	public boolean isFind = false;

	public void reset(iBeaconView beacon) {
		this.mac = beacon.mac;
		this.rssi = beacon.rssi;
		this.detailInfo = beacon.detailInfo;
		this.isMultiIDs = beacon.isMultiIDs;

		this.name = beacon.name;
		this.alias = beacon.alias;
		this.distance = beacon.distance;
		this.version = beacon.version;
		this.proximityUUID = beacon.proximityUUID;
		this.uuidReplaceName = beacon.uuidReplaceName;
		this.major = beacon.major;
		this.minir = beacon.minir;
		this.isFind = beacon.isFind;
		this.battery = beacon.battery;
	}
}
