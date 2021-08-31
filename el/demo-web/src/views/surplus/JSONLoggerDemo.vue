<template>
<div class="demo">
    <div style="margin-bottom: 15px;">
        <section style="display: flex; align-items: center;">
            <h2 style="display: inline">请选择插入文本的颜色：</h2>
            <div class="color-palette">
                <div
                    class="color"
                    v-for="(color, index) of colors"
                    :key="index"
                    :style="{ backgroundColor: color.enName }"
                    @click="pickColor(color)"
                ></div>
            </div>
            <div v-if="currentColor !== null" :style="{ color: currentColor.enName, marginLeft: '15px', fontSize: '20px' }">您选择了{{ currentColor.zhName }}</div>
        </section>
        <section style="margin-top: 15px;display: flex; align-items: center">
            自动滚动&nbsp;<Checkbox v-model="autoScroll" />&nbsp;
            定时打印&nbsp;<Checkbox v-model="periodicallyPrintLog" />&nbsp;
            显示时间&nbsp;<Checkbox v-model="shouldShowTime" />&nbsp;
            JSON数组插入&nbsp;<Checkbox v-model.number="shouldUseJSONArray" />&nbsp;
            日志条数&nbsp;<Input v-model.number="printNumber" style="width: 100px" />&nbsp;
            打印速度&nbsp;<Slider v-model.number="interval" :min="250" :max="2000" style="width: 200px" :tip-format="(val) => val + '毫秒'"/>&nbsp;
        </section>
        <section style="margin-top: 15px;">
            <h2>输入日志内容&nbsp;</h2>
            <Input type="textarea" v-model="log" />
        </section>
        <section style="margin-top: 15px;">
            <Button @click="logMessage">添加日志</Button>&nbsp;
            <Button @click="copy">拷贝</Button>&nbsp;
            <Button @click="clear">清空</Button>&nbsp;
        </section>
    </div>
    <JSONLogger ref="logger" :autoScroll="autoScroll" />
</div>
</template>

<script>
import JSONLogger from './Logger/JSONLogger';

function debounce(fn, wait) {
  let timeout;
  return function () {
    let that = this;
    let arg = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(that, arg)//使用apply改变this指向
    }, wait);
  }
}

let timer = null;

export default {
    data () {
        return {
            currentColor: null,
            autoScroll: false,
            periodicallyPrintLog: false,
            shouldShowTime: false,
            shouldUseJSONArray: false,
            printNumber: 1,
            interval: 1500,
            log: "",
            colors: [
                { enName: 'white', zhName: '白色' },
                { enName: 'black', zhName: '黑色' },
                { enName: 'red', zhName: '红色' },
                { enName: 'blue', zhName: '蓝色' },
                { enName: 'yellow', zhName: '黄色' },
                { enName: 'green', zhName: '绿色' },
                { enName: 'magenta', zhName: '品红' },
                { enName: 'cyan', zhName: '青色' }
            ]
        }
    },

    methods: {
        resetLogPrinting: debounce(function (newVal, oldVal) {
            console.log(newVal, oldVal)
            if (timer !== null) {
                clearInterval(timer);
            };
            timer = setInterval(() => {
                this.logMessage();
            }, this.interval);
        }, 30),

        pickColor (color) {
            this.currentColor = color;
        },

        clear () {
            this.$refs.logger.clear();
        },

        async copy () {
            let logs = this.$refs.logger.copyAllLogs();
            await window.navigator.clipboard.writeText(logs);
            this.$Notice.success({
                title: "日志已成功复制到剪切板"
            });
        },
        
        logMessage () {
            var logs = [];
            for (var i = 0; i < this.printNumber; i++) {
                let log = {};
                if (this.shouldShowTime) {
                    log.t = Date.now();
                }
                log.v = this.log;

                if (this.currentColor === null) {
                    log.rgb = this.colors[0].enName;
                } else {
                    log.rgb = this.currentColor.enName;
                }
                logs.push(log)
            }

            let logData;
            if (this.shouldUseJSONArray) {
                logData = JSON.stringify(logs);
            } else {
                logData = logs.map(JSON.stringify);
            }

            console.log(logData);
            this.$refs.logger.log(logData);
        }
    },

    watch: {
        periodicallyPrintLog (newVal, oldVal) {
            if (newVal === oldVal) return;
            if (newVal === true) {
                timer = window.setInterval(() => {
                    this.logMessage();
                }, this.interval);
            } else {
                window.clearInterval(timer);
                timer = null;
            }
        },

        interval (newVal, oldVal) {
            console.log(newVal, oldVal)
            this.resetLogPrinting(this, newVal, oldVal);
        }
    },
    
    components: { JSONLogger },
}
</script>

<style scoped>
.demo {
    margin: 30px;
}
.color-palette {
    display: inline-flex;
}

.color-palette .color {
    width: 30px;
    height: 30px;
    cursor: pointer;
}
</style>