export function goTo(_this, name) {
    _this.$router.open({
        name: name,
        type: 'PUSH',
    })
}

export function alert(_this, title, msg) {
    _this.$notice.alert({
        title: title || '提示',
        message: msg,
        okTitle: '确认',
        callback() {
            //TODO
        }
    })
}
