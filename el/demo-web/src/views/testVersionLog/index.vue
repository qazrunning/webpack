<template>
    <div style="height:100%;overflow:auto">
             <mavon-editor v-model="htmlMD" :editable='false' :subfield='false'   :codeStyle='"dark"' :toolbarsFlag='false' :defaultOpen="'preview'" />
    </div>
</template>
<script>
const url = `static/markdown/versionLog.md`; //如果用于发布自己项目版本信息 推荐将文档融入代码一部分 放在public/static里面
export default {
    components: {
    },
    data () {
        return {
            htmlMD:''
        }
    },
    methods: {
        init(){
            this.$curl.get(url).then((res) => {
            　　this.htmlMD = res
            　　});
        }
    },
    mounted () {
        this.init()
    }
}
</script>