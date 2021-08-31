<template>
    <div class="tag">
        <Tag color="warning">黄</Tag>
        <Tag color="gray">烟</Tag>
         <Tag color="red">0</Tag>
        <!-- <Tag color="black">黑</Tag>
        <Tag color="purple">柴</Tag> -->
    </div>
</template>
<script>
export default {
    name:'VehicleTag',
    data(){
        return {
            name:this.name
        }
    },
    props:{
        name: {
            type: String,
          //  default: '0'
        }
    },
    methods:{

    },
    mounted(){
    }
}
</script>
<style lang="less">
</style>
