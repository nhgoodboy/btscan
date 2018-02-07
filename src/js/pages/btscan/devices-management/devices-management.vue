<template>
    <div>
        <div class="top-box">
            <button :text="'添加'" @buttonClick="addClick"></button>
            <button :text="'粘贴CSV'" @buttonClick="pasteCSV"></button>
            <button :text="'按电量排序'" @buttonClick="orderByBattery"></button>
        </div>

        <div class="searchBar-box">
            <text class="text-small">共{{devicesLength()}}项</text>
            <search-bar :inputWidth="'400px'" :placeholder="'请输入设备标签或名称'" @search="search"></search-bar>
        </div>

        <div class="list-head">
            <text class="left-text">设备标签</text>
            <text class="middle-text">设备名称</text>
            <text class="right-text">电量</text>
        </div>

        <list class="list">
            <cell v-for="(item, key, index) in devices" :key="index" @click="modifyDev(item, key)">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#90D8FF' : 'white'}">
                    <text class="common-style text-key">{{key}}</text>
                    <text class="common-style text-alias" >{{item.alias}}</text>
                    <text class="common-style text-battery">{{item.battery}}%</text>
                    <text class="common-style delete-icon" @click="deleteDev(key)">&#xe634;</text>
                </div>
            </cell>
        </list>

        <wxc-popup :show="isTopShow" pos="top" height="400" width="750"
                   :animation="{timingFunction:'ease-out'}" @wxcPopupOverlayClicked="popupOverlayTopClick">
            <div class="popup-box">
                <div class="popup-inner-box">
                    <text class="text-small">设备标签</text>
                    <input class="input" type="text" v-model="dev.mac" maxlength="20" :disabled="isModifyDev"/>
                </div>
                <div class="popup-inner-box">
                    <text class="text-small">设备名称</text>
                    <input class="input" type="text" v-model="dev.alias" maxlength="20"/>
                </div>
            </div>
            <div class="popup-button-box">
                <div class="popup-button popup-left-button" @click="clickPopupButotn('cancel')">
                    <text class="text-small">取消</text>
                </div>
                <div class="popup-button popup-right-button" @click="clickPopupButotn(isModifyDev ? 'modify' : 'add')">
                    <text class="text-small colorBase">{{isModifyDev ? '修改' : '添加'}}</text>
                </div>
            </div>
        </wxc-popup>

    </div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { button, searchBar } from '../components/index';
    import { DevicesMap, alert, Device } from '../utils/utils';
    import { WxcPopup } from 'weex-ui/index';

    const clipboard = weex.requireModule("clipboard");

    let _this;
    let devicesMap;

    export default {
        data() {
            return {
                dev: {mac: '', alias: ''},
                isModifyDev: false,
                isTopShow: false,
                devices: {},
            }
        },

        components: {
            button,
            searchBar,
            WxcPopup
        },

        mounted() {
            _this = this;
            devicesMap = new DevicesMap(this);
            this.devices = devicesMap.map;
        },

        methods: {
            orderByBattery() {
                let tempDev = this.devices;
                let tempArray = [];
                for(let key in tempDev) {
                    let item = {};
                    item.mac = key;
                    item.alias = tempDev[key].alias;
                    item.battery = tempDev[key].battery;
                    tempArray.push(item);
                }
                let resultArray = [];
                resultArray = tempArray.sort((a, b)=> {
                    let x = typeof a['battery'] === 'number' ? a['battery'] : -1;
                    let y = typeof b['battery'] === 'number' ? b['battery'] : -1;
                    return y - x;
                });
                this.devices = {};
                for(let item of resultArray) {
                    this.devices[item.mac] = {alias: item.alias, battery: item.battery};
                }
            },

            pasteCSV() {
                clipboard.getString(ret => {
                    if (ret.result === 'success' && ret.data.trim() !== '') {
                        let data = ret.data.split('\r\n');
                        let msg = '';
                        for (let key in data) {
                            let arr = data[key].split(',');
                            if(!devicesMap.put(new Device(arr[0], arr[1], Number(arr[2])))) {
                                msg += '设备 ' + arr[0] + ' 已存在\n';
                            }
                        }
                        if (msg === '') {
                            msg += '全部导入成功';
                        }else {
                            msg += '其余导入成功';
                        }
                        this.$notice.alert({
                            message: msg
                        });
                        devicesMap.save();
                        this.devices = devicesMap.getAll();
                    } else {
                        this.$notice.alert({
                            message: '格式错误，请重新获取正确的数据再粘贴'
                        })
                    }
                });
            },

            modifyDev(item, mac){
                this.isTopShow = true;
                this.isModifyDev = true;
                this.dev.mac = mac;
                this.dev.alias = item.alias;
                this.dev.battery = item.battery;
            },

            clickPopupButotn(text) {
                if(text === 'add') {
                    if(this.dev.mac.length !== 12){
                        this.$notice.alert({
                            title: '温馨提示',
                            message: '请输入正确的12位设备标签,例如: A1B2C3D4E5F6'
                        });
                    }else {
                        let tempMac = this.dev.mac.substr(0, 2) + ':'
                            + this.dev.mac.substr(2, 2) + ':'
                            + this.dev.mac.substr(4, 2) + ':'
                            + this.dev.mac.substr(6, 2) + ':'
                            + this.dev.mac.substr(8, 2) + ':'
                            + this.dev.mac.substr(10, 2);

                        if(devicesMap.put(new Device(tempMac, this.dev.alias))) {
                            devicesMap.save();
                            this.dev = {mac: '', alias: ''};
                            this.isTopShow = false;
                            this.$tools.resignKeyboard();
                        }else {
                            this.$notice.toast({
                                message: '设备已存在'
                            })
                        }
                    }
                }else if(text === 'modify') {
                    if(devicesMap.update(new Device(this.dev.mac, this.dev.alias, this.dev.battery))) {
                        devicesMap.save();
                        this.dev = {mac: '', alias: ''};
                        this.isTopShow = false;
                        this.$tools.resignKeyboard();
                        this.$notice.toast({message: '修改成功'});
                    }else {
                        this.$notice.toast({message: '修改失败'});
                    }
                }else {
                    this.isTopShow = false;
                    this.$tools.resignKeyboard();
                }
            },

            addClick() {
                this.isTopShow = true;
            },

            popupOverlayTopClick() {
                this.isTopShow = false;
            },

            search(text) {
                this.devices = devicesMap.search(text);
            },

            devicesLength() {
                return Object.keys(this.devices).length;
            },

            deleteDev(key) {
                this.$notice.confirm({
                    title: '温馨提示',
                    message: '删除后记录将消失，是否删除?',
                    okTitle: '是',
                    cancelTitle: '否',
                    okCallback() {
                        Vue.delete(_this.devices, key);
                        devicesMap.deleteByKey(key);
                    },
                    cancelCallback() {}
                });
            }
        }
    }


</script>

<style lang="sass" src="./devices-management.scss" scoped></style>
