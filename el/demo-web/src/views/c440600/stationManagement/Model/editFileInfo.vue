//上传站点证件
<template>
    <div style="height: 522px; overflow: hidden auto">
        <viewer :images="imgList">
            <Row>
            <i-col
                :sm="12"
                :md="8"
                :lg="6"
                v-for="(item, index) in imgList"
                :key="index"
            >
                <div class="fx__bgcolor" style="padding: 18px; margin: 6px">
                    <i-circle
                        v-show="progress"
                        :size="100"
                        :percent="progress"
                        :stroke-color="color"
                        style="
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            margin-left: -50px;
                            margin-top: -84px;
                        "
                    >
                        <Icon
                            v-if="progress == 100"
                            type="ios-checkmark"
                            style="color: #5cb85c"
                        ></Icon>
                        <span v-else style="font-size: 24px"
                            >{{ progress }}%</span
                        >
                    </i-circle>
                    <img
                        class="img_div"
                        :src="
                            item.HasPhoto
                                ? item.FullFileName &&
                                  item.FullFileName.indexOf(':') == -1
                                    ? item.FullFileName
                                    : 'data:image/jpg;base64,' + item.Bytes
                                : error_img
                        "
                        @error="onError($event)"
                    />
                    <label class="img_title">{{ item.CodeName }}</label>
                    <Button
                        @click="addPhoto(item)"
                        type="success"
                        long
                        icon="ios-cloud-upload-outline"
                        >上传图片</Button
                    >
                </div>
            </i-col>
            </Row>
        </viewer>
        <input
            type="file"
            @change="picUpload($event)"
            style="display: none"
            ref="filElem"
            accept="image/*,application/pdf"
        />
    </div>
</template>
<script>
let error_img = require("../../../../../public/hj/img/error.gif");
import { ImageZip } from "../../../../utils/tools";
export default {
    props: {
        StationCode: {
            type: String,
            default: "0",
        },
    },
    data() {
        return {
            progress: 0,
            error_img: error_img, //无图片时显示的默认图片
            imgList: [],
            selData: {},
        };
    },
    computed: {
        color() {
            let color = "#2db7f5";
            if (this.percent == 100) {
                color = "#5cb85c";
            }
            return color;
        },
    },
    methods: {
        arrayBufferToBase64(buffer) {
            //buffer 转base64方法
            var binary = "";
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },
        onError(event) {
            event.target.src = "static/img/imgError.png";
        },
        addPhoto(item) {
            //添加图片
            this.selData = item;
            this.$refs.filElem.dispatchEvent(new MouseEvent("click")); //触发file方法
        },
        picUpload(event) {
            //获取上传图片
            const self = this;
            let files = event.target.files[0];
            self.upLoads(files);

            //  ImageZip(files, function(baseData) {
            //     self.upLoads(baseData);
            //   });
        },
        async upLoads(files) {
            const self = this;
            let { Bytes, ...paramsData } = this.selData;
            let formData = new FormData();
            formData.append("uploadType", "1");
            formData.append("selData", JSON.stringify(paramsData));
            formData.append("file", files);
            const res = await this.$curl.post("api/hj/uploadImage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    var complete =
                        ((progressEvent.loaded / progressEvent.total) * 100) |
                        0;
                    this.progress = complete; //赋值，进度条变化，通过值或者其他事件还可以用showp使得进度条是否隐藏
                    if (this.progress == 100) this.progress = 0;
                },
            });
            if (res.state) {
                this.$Message.success(res.msg);
                this.imgList.forEach((t) => {
                    if (t.CodeValue != res.newData.type) return;
                    t = Object.assign(t, res.newData); //重新赋值
                    t["HasPhoto"] = t.FullFileName || t.Bytes ? 1 : 0;
                    if (t.FullFileName && t.FullFileName.indexOf(":") != -1)
                        t["Bytes"] = self.arrayBufferToBase64(t.Bytes.data);
                });
                this.$refs.filElem.value = ""; //上传成功，清除input里的file,这样可以重复选择
            } else {
                this.$Message.warning(res.msg);
                return;
            }
        },
        async searchFileInfo() {
            const self = this;
            const params = { stationID: this.StationCode };
            let result = await this.$curl.get("api/hj/getStationimg", {
                stationID: this.StationCode,
            });
            if (result.state) {
                result.data.forEach((t) => {
                    t.StationCode = self.StationCode;
                    if (t.ID) {
                        //是否有图片
                        t["HasPhoto"] = t.FullFileName || t.Bytes ? 1 : 0;
                    } else t["HasPhoto"] = false;
                    if (t.FullFileName && t.FullFileName.indexOf(":") != -1)
                        t["Bytes"] = self.arrayBufferToBase64(t.Bytes.data);
                });
                if (result.data) this.imgList = result.data;
            } else {
                this.$Notice.warning({
                    title: "提示",
                    desc: "获取图片失败!",
                });
            }
        },
        ruleValidate() {
            const self = this;
            let titleArr = [];
            for (var i = 0; i < self.imgList.length; i++) {
                if (!self.imgList[i].FullFileName && self.imgList[i].Must) {
                    titleArr.push(self.imgList[i].CodeName + "不能为空！");
                }
            }
            this.$emit("ruleFileInfo", titleArr);
        },
    },
    watch: {
        StationCode: {
            handler(newval, oldval) {
                if (newval == oldval) return;
                this.searchFileInfo();
            },
            immediate: true,
        },
    },
    mounted() {},
};
</script>
<style scoped>
.img_div {
    height: 240px;
    width: 100%;
}
.img_title {
    display: block;
    text-align: center;
}
</style>
