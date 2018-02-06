export function goTo(_this, name, params) {
    _this.$router.open({
        name: name,
        type: 'PUSH',
        params: params
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
