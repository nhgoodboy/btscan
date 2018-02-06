export function goTo(_this, name, params) {
    _this.$router.open({
        name: name,
        type: 'PUSH',
        params: params
    })
}

export function back(_this) {
    _this.$router.back({
        length: 1,
        type: 'PUSH',
    })
}

export function alert(_this, msg, title) {
    _this.$notice.alert({
        title: title || '提示',
        message: 'typeof: ' + typeof msg + '\nvalue: ' + String(msg),
        okTitle: '确认',
        callback() {
            //TODO
        }
    })
}

export function formatDateTime(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    // let second = date.getSeconds();
    // second = second < 10 ? ('0' + second) : second;
//                return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}

export class DevicesMap {
    constructor(_this) {
        this.page = _this;
        this.init();
    }

    alert(msg) {
        this.$notice.alert({
            title: '提示',
            message: msg,
            okTitle: '确认',
            callback() {

            }
        })
    }

    init() {
        this.page.$storage.get('devicesMap').then(resData => {
            this.map = resData;
        }, error => {
            this.map = {};
        })
    }

    put(device) {
        if(!this.containsKey(device.mac)){
            this.map[device.mac] = device;
        } else {
            this.alert('设备已存在！')
        }
    }

    save() {
        this.page.$storage.set('devicesMap', this.map).then(resData => {}, error => {});
    }

    update(device) {
        if(this.containsKey(device.mac)){
            this.map[device.mac] = device;
        } else {
            this.alert('设备不存在！')
        }
    }

    search(subKey) {
        let result = [];
        let _this = this;
        for(let key in this.map) {
            if(key.indexOf(subKey) >= 0 || this.map[key].alias.indexOf(subKey) >= 0) {
                result.push(JSON.parse(JSON.stringify(_this.map[key])));
            }
        }
        return result;
    }

    updateBattery(mac, battery) {
        this.map[mac].battery = battery;
    }

    containsKey(mac) {
        return this.map[mac] ? true : false;
    }

    getAliasByMac(mac) {
        if(this.map[mac]){
            return this.map[mac].alias;
        } else {
            return mac;
        }
    }
}

export class Device {
    constructor(mac, alias, battery) {
        this.alias = alias ? alias : "unknowed";
        this.mac = mac;
        this.battery = (battery <= 100 && battery >= 0) ? battery : '---';
        this.lastChangeTime = new Date().toISOString();
    }

    updateTime() {
        this.lastChangeTime = new Date().toISOString();
    }

    setAlias(alias) {
        this.alias = alias;
        this.updateTime();
    }

    updateBattery(battery) {
        this.battery = battery;
        this.updateTime();
    }
}

export class Task {
    constructor(taskName, devicesList, remark, operator) {
        this.taskName = taskName;
        this.time = new Date().toISOString();
        this.deviceList = devicesList;
        this.devNum = devicesList.length;
        this.remark = remark ? remark : '';
        this.operator = operator;
    }
}

export class TasksList {
    constructor(_this) {
        this.page = _this;
        this.init();
    }

    init() {
        this.page.$storage.get('tasksList').then(resData => {
            this.list = resData;
        }, error => {
            this.list = [];
        })
    }

    save() {
        this.page.$storage.set('tasksList', this.list).then(resData => {}, error => {})
    }

    add(obj) {
        this.list.push(obj);
    }
}
