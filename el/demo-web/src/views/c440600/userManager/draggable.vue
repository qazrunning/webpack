<template>
  <div style="display:flex;">
    <!-- 分组拖拽排序 -->
    <div style="flex:1;" v-if="groupRankArr.length !== 0">
      <span>部门排序</span>
      <draggable v-model="groupRankArr" v-bind="dragOptions" :group="{put: groupDrag}" @start="drag = true; userDrag = false" @end="drag = false; userDrag = true" tag="ul">
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li class="list-group-item fx__item" v-for="(element,index) in groupRankArr" :key="element.name + index">
            {{element.title}}
          </li>
        </transition-group>
      </draggable>
    </div>

    <!-- 用户拖拽排序 -->
    <div style="flex:1;"  v-if="userRankArr.length !== 0">
      <span>用户排序</span>
      <draggable v-model="userRankArr" v-bind="dragOptions" :group="{put: userDrag}"  @start="drag = true; groupDrag = false" @end="drag = false; groupDrag = true" tag="ul">
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li class="list-group-item fx__item" v-for="(element,index) in userRankArr" :key="element.UserID + ''+index">
            {{element.title}}
          </li>
        </transition-group>
      </draggable>
    </div>

  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      groupDrag: true,
      userDrag: true,
      userRankArr: this.userArr.map(p=> ({
        UserID: p.UserID,
        name: p.name,
        title: p.title
      })),
      groupRankArr: this.groupArr.map(p=> ({
        name: p.name,
        title: p.title
      }))
    };
  },
  props: {
    groupArr: {
      type: Array,
      default: null
    },
    userArr: {
      type: Array,
      default: null
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #515a6e;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
  list-style: none;
  padding: 5px 15px;
}

.list-group-item i {
  cursor: pointer;
}
</style>
