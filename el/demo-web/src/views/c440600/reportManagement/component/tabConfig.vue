<template>
  <div class="tabconfig">
    <div class="tabconfig-ItemAll">
      <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
    </div>
    <draggable class="tabconfig-draggable" v-model="checkList" @end="onEnd">
      <div class="tabconfig-Item" v-for="(item,index) in checkList" :key="index">
        <Checkbox class="checkInfo" v-model="item.Ischecked"  @on-change="handleArr">{{item.title}}</Checkbox>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'TabConfig',
  props: {
    columnsCopy: {
      type: Array,
      default: []
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      indeterminate: true,
      checkAll: true,
      checkList:[],
      checkAllGroup: [],
      drapAfterArr:[]
    }
  },
  mounted() {

  },
  watch: {
    columnsCopy: {
      handler(newValue, oldValue) {
        this.checkList=newValue.map(item=>{
          item.Ischecked=true
          return item
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCheckAll() {
      this.checkAll=!this.checkAll
      if(this.checkAll){
        this.checkList=this.checkList.map(item=>{
          item.Ischecked=true
          return item
        })
        const emitArr=this.checkList.filter(item=>item.Ischecked==true)
      // to do emit father event
        this.$emit('columnsEvent',emitArr)
      }else{
        this.checkList=this.checkList.map(item=>{
          item.Ischecked=false
          return item
        })
        const emitArr=this.checkList.filter(item=>item.Ischecked==true)
      // to do emit father event
        this.$emit('columnsEvent',emitArr)
      }
    },
    onEnd() {
      const emitArr=this.checkList.filter(item=>item.Ischecked==true)
      // to do emit father event
      this.$emit('columnsEvent',emitArr)
    },
    handleArr(){
      const emitArr=this.checkList.filter(item=>item.Ischecked==true)
      this.$emit('columnsEvent',emitArr)
      // to do emit father event
    }
  }
}
</script>

<style lang="scss" scoped>
.tabconfig {
  width: 300px;
  margin: 16px;
  .tabconfig-draggable {
    .tabconfig-Item {
      border: 1px solid #dddddd;
      margin: 1px 0;
    }
  }
}
</style>
