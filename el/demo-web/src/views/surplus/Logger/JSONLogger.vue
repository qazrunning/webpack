<template>
<Logger ref="logger" :autoScroll="autoScroll" />
</template>

<script>
import Logger from "./Logger.vue";

// The Color Code means a code like #ABCDEF, or a CSS color name, e.g red. 
const REG_MATCH_COLOR_CODE = /^\s*(#[\dABCDEF]{6})|([A-Z_\-]+)\s*$/i;

function hasProp (o, p) {
    return Object.prototype.hasOwnProperty.call(o, p);
}

function isFieldsValid (json) {
    if (json === null || typeof json !== "object") {
        return false;
    }

    if (hasProp(json, "t")) {
        if (typeof json.t !== 'number') {
            return false;
        }
        if (!moment(json.t).isValid()) {
            return false;
        }
    }

    if (hasProp(json, "rgb")) {
        if (typeof json.rgb !== "string") {
            return false;
        }

        if (!REG_MATCH_COLOR_CODE.test(json.rgb)) {
            return false;
        }
    }

    if (hasProp(json, "v")) {
        if (typeof json.v !== "string") {
            return false;
        }
    }

    return true;
}

export default {
    name: "JSONLogger",

    props: {
        // 是否允许自动滚动。若是，当有新内容添加到末尾时，日志窗口
        // 将自动滚动到底部。
        autoScroll: {
            type: Boolean,
            default: false
        },

        // 定义时间的格式，使用moment.js的时间字符串
        // 详见：https://momentjs.com/docs/#/displaying/format/
        dateString: {
            type: String,
            default: "YYYY-MM-DD HH:mm:ss"
        },

        // 用于分割时间与日志内容的字符串
        timeSeperator: {
            type: String,
            default: "->"
        },

        // 默认字体颜色
        fgColor: {
            type: String,
            default: "white"
        },

        // 默认背景颜色
        bgColor: {
            type: String,
            default: "black"
        }
    },

    methods: {
        /**
         * @param arrOrStr {string | string[]} The JSON to be output. It could be a single JSON or an array of JSON.
         */
        log (arrOrStr) {
            if (typeof arrOrStr === "string") {
                this._logJSON(arrOrStr);
            } else if (Array.isArray(arrOrStr)) {
                for (let json of arrOrStr) {
                    this._logJSON(json);
                }
            }
        },

        copyAllLogs () {
            return this.$refs.logger.copyAllLogs();
        },

        clear () {
            this.$refs.logger.clear();
        },

        // PRIVATE
        _logJSON (str) {
            let json = JSON.parse(str);
            if (Array.isArray(json)) {
                for (let o of json) {
                    this._logObject(o);
                }
            } else {
                this._logObject(json);
            }
        },

        _logObject (json) {
            if (isFieldsValid(json)) {
                let text = json.v || "";
                let color = json.rgb || "white";
                let time = json.t !== undefined
                    ?  moment(json.t).format(this.dateString) + this.timeSeperator
                    : "";
                
                this.$refs.logger.log(time, { color });
                this.$refs.logger.log(text, { color });
            }
        }
    },

    components: {
        Logger
    }
}
</script>
