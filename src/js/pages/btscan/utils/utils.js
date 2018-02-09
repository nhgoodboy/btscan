export function goTo(_this, name, params) {
    _this.$router.open({
        name: name,
        type: 'PUSH',
        params: params
    })
}

export function back(_this, length) {
    _this.$router.back({
        length: length || 1,
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

export function transIcon(icon) {
    if(!icon){
        return "空";
    };
    icon = icon.replace("&#x",'');
    return String.fromCharCode(parseInt(icon, 16).toString(10));
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
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}

export class DevicesMap {
    constructor(_this) {
        this.map = {};
        this.page = _this;
        this.init();
    }

    alert(msg) {
        this.page.$notice.toast({
            message: msg
        })
    }

    init() {
        let tempMap = this.page.$storage.getSync('devicesMap');
        this.map = tempMap ? tempMap : {};
    }

    put(device) {
        if(!this.containsKey(device.mac)){
            this.map[device.mac] = device;
            return true;
        } else {
            return false;
        }
    }

    save() {
        this.page.$storage.setSync('devicesMap', this.map);
    }

    update(device) {
        if(this.containsKey(device.mac)){
            this.map[device.mac] = device;
            return true;
        } else {
            return false;
        }
    }

    deleteByKey(key) {
        delete this.map[key];
        this.save();
    }

    search(text) {
        if(!text.trim()){
            return this.map;
        }else {
            let result = {};
            for(let key in this.map) {
                if(key.indexOf(text) >= 0 || this.map[key].alias.indexOf(text) >= 0) {
                    result[key] = this.map[key];
                }
            }
            return result;
        }
    }

    updateBattery(mac, battery) {
        this.map[mac].battery = battery;
    }

    containsKey(mac) {
        return this.map[mac] ? true : false;
    }

    getAliasByMac(mac) {
        return this.map[mac] ? this.map[mac].alias : mac;
    }

    getAll() {
        let tempMap = this.page.$storage.getSync('devicesMap');
        this.map = tempMap ? tempMap : {};
        return this.map;
    }
}

export class Device {
    constructor(mac, alias, battery) {
        this.alias = alias ? alias : "---";
        this.mac = mac;
        this.battery = (battery <= 100 && battery >= 0) ? battery : '---';
        this.lastChangeTime = formatDateTime(new Date());
    }

    updateTime() {
        this.lastChangeTime = formatDateTime(new Date());
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
    constructor(taskName, devices, remark, operator) {
        this.taskName = taskName || '临时任务';
        this.time = formatDateTime(new Date());
        // this.time = '2018-01-01 18:16';
        this.devices = devices;
        this.devNum = Object.keys(devices).length;
        this.remark = remark || '';
        this.operator = operator;
    }
}

export class TasksList {
    constructor(_this) {
        this.list = [];
        this.page = _this;
        this.init();
    }

    init() {
        let tempList = this.page.$storage.getSync('tasksList');
        this.list = tempList ? tempList : [];
    }

    save() {
        this.page.$storage.set('tasksList', this.list).then(resData => {}, error => {})
    }

    add(task) {
        this.list.push(task);
    }

    search(text) {
        if(!text.trim()){
            return this.list;
        }else {
            let result = [];
            for(let item of this.list) {
                if(item.taskName.indexOf(text) >= 0) {
                    result.push(item);
                }
            }
            return result;
        }
    }
}
