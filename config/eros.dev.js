// appBoard，mediator 不建议进行修改 如果修改了 也请对应修改
module.exports = {
    'exports': [
        //btscan
        "js/pages/btscan/home/home.vue",
        "js/pages/btscan/devices-check/devices-check.vue",
        "js/pages/btscan/devices-search/devices-search.vue",
        "js/pages/btscan/devices-management/devices-management.vue",
        "js/pages/btscan/history-records/history-records.vue",
        "js/pages/btscan/about/about.vue",

        "js/pages/btscan/index/test.js",
        "js/pages/btscan/index/index.vue",
        "js/pages/btscan/history-results/history-results.vue",
        "js/pages/btscan/manage-devices/manage-devices.vue",
        "js/pages/btscan/detail-list/detail-list.vue",

        // appBoard
        'js/config/index.js',
        // mediator
        'js/mediator/index.vue',
        // home
        'js/pages/demo/index.vue',
        'js/pages/demo/lifecycle/index.vue',
        'js/pages/demo/assets/index.vue',
        'js/pages/demo/globalAttr/index.vue',
        'js/pages/demo/inputExtend/index.vue',
        'js/pages/demo/refresh/index.vue',
        'js/pages/demo/storage/index.vue',
        'js/pages/demo/navigator/index.vue',
        'js/pages/demo/tools/index.vue',
        'js/pages/demo/router/index.vue',
        'js/pages/demo/router/home.vue',
        'js/pages/demo/event/a.vue',
        'js/pages/demo/event/b.vue',
        'js/pages/demo/notice/index.vue',
        'js/pages/demo/font/index.vue',
        'js/pages/demo/coms/index.vue',
        'js/pages/demo/image/index.vue',
        'js/pages/demo/bmchart/index.vue',
        'js/pages/demo/bmrichtext/index.vue',
        'js/pages/demo/bmcalendar/index.vue',
        'js/pages/demo/other/waterfall.vue',
        'js/pages/demo/other/weex-ui/tab-page/index.vue',
    ],
    'alias': {
        'Components': 'js/components',
        'Common': 'js/common',
        'Config': 'js/config',
        'Widget': 'js/widget',
        'Pages': 'js/pages',
        'Utils': 'js/utils'
    },
    'eslint': false,
    'diff': {
        'pwd': '/Users/yangmingzhe/Work/opensource/eros-diff-folder',
        'proxy': 'https://app.weex-eros.com/source'
    },
    'server': {
        'path': './',
        'port': 8889
    },
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    }
}
