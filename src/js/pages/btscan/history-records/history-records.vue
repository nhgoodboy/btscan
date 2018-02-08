<template>
    <div>
        <div class="top-box">
            <button text="30天前" @buttonClick="beforeMonth"></button>
            <button text="30天内" @buttonClick="inMonth"></button>
        </div>

        <div class="searchBar-box">
            <text class="text-small">共{{tasks.length}}项</text>
            <search-bar :inputWidth="'400px'" :placeholder="'请输入任务名称'" @search="search"></search-bar>
        </div>

        <div class="list-head">
            <text class="left-text">任务名称</text>
            <text class="middle-text">清点时间</text>
            <text class="right-text">设备数</text>
        </div>

        <list class="list">
            <cell v-for="(item, index) in tasks" :key="index" @click="goTo(item)">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#90D8FF' : 'white'}">
                    <text class="common-style text-taskName">{{item.taskName}}</text>
                    <text class="common-style text-time">{{item.time}}</text>
                    <text class="common-style text-devNum" >{{item.devNum}}</text>
                    <text class="common-style copy-icon" @click="copyDev(item)">&#xe85e;</text>
                </div>
            </cell>
        </list>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { button, searchBar } from '../components/index';
    import { TasksList, goTo } from '../utils/utils';

    const moment = require('../utils/moment');

    let _this;
    let tasksList;

    export default {
        data() {
            return {
                tasks: [{taskName: '123', time: '2018-03-05 15:12', devNum: 12},{taskName: '123', time: '2018-03-05 15:12', devNum: 12},
                    {taskName: '123', time: '2018-03-05 15:12', devNum: 12},{taskName: '123', time: '2018-03-05 15:12', devNum: 12},],
            }
        },

        components: {
            button,
            searchBar,
        },

        mounted() {
            _this = this;
            tasksList = new TasksList(this);
            this.tasks = tasksList.list;
        },

        methods: {
            goTo(item) {
                goTo(this, 'detail-list', item);
            },

            copyDev(task) {

            },

            beforeMonth() {
                let tempList = [];
                tasksList.list.forEach(item => {
                    let countDays = moment().diff(moment(item.time), 'hours') / 24;
                    if(countDays > 30){
                        tempList.push(item);
                    }
                });
                this.tasks = tempList;
            },

            inMonth() {
                let tempList = [];
                tasksList.list.forEach(item => {
                    let countDays = moment().diff(moment(item.time), 'hours') / 24;
                    if(countDays <= 30){
                        tempList.push(item);
                    }
                });
                this.tasks = tempList;
            },

            search(text) {
                this.tasks = tasksList.search(text);
            }
        }
    }


</script>

<style lang="sass" src="./history-records.scss" scoped></style>
