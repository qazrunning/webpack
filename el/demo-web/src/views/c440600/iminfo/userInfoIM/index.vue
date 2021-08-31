<template>
  <div style="width:100%;height:100%;" ref="main">
    <div class="searchDom">
      <Input v-model="searchParam.name" placeholder="账号/用户名..." style="width: 300px" />
      <Input v-model="searchParam.Phone" placeholder="手机号..." style="width: 300px;margin-left:10px;" />
      <Input v-model="MAI_Name" placeholder="维修厂" style="width:300px;;margin-left:10px;" />
      <Button type="primary" style="margin-left:10px;" @click="getUserData">检索</Button>
      <!-- <Button type="primary" style="margin-left:10px;" @click="addUserInfo">新增用户</Button> -->
    </div>
    <!-- 表格 -->
    <div>
      <Table stripe :columns="userList" :data="userData" :loading="loading" :height="height">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="editUserData(index)">编辑</Button>
          <Button type="error" size="small" @click="showDeleteModal(index)">删除</Button>
        </template>
      </Table>
    </div>
    <!-- 分页器 -->
    <div class="bottomPage">
      <Page :total="total" show-total @on-change="handleData" @on-page-size-change="getPageSize" />
    </div>
    <!-- modal框 -->
    <Modal v-model="isShow" @on-ok="saveModal=!saveModal" @on-cancel="cancel">
      <Form ref="formInline" :model="formData" inline>
        <Row>
          <Col span="12">
            <FormItem label="账号:" prop="EnName">
              <Input v-model="formData.EnName" placeholder="账号..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="密码:" prop="PWD">
              <Input type="password" v-model="formData.PWD" placeholder="密码..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户名:" prop="CnName">
              <Input v-model="formData.CnName" placeholder="用户名..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="手机号:" prop="Phone">
              <Input v-model="formData.Phone" placeholder="手机号..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="注册时间:" prop="CnName">
              <DatePicker type="datetime" :value="formData.CreateTime" disabled></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态:" prop="Status">
              <Select v-model="formData.Status">
                <Option v-for="item in Status" :value="item.CodeValue" :key="item.CodeValue">{{ item.CodeName }}</Option>
              </Select>
            </FormItem>
          </Col>
              <Col v-if="isAdd" span="12">
            <FormItem label="企业密钥:" prop="EntKey">
              <Input v-model="formData.EntKey" placeholder="维修厂密钥..."></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 确定框 -->
    <Modal v-model="saveModal" @on-ok="saveData">
      <p style="fontSize:20px;">确定保存修改?</p>
    </Modal>
      <!-- 确认删除 -->
    <Modal v-model="deleteModal" @on-ok="remove">
   <p style="fontSize:20px;margin:0 auto;">确定删除用户：<span style="fontSize:22px;color:#4682B4;">{{formData.CnName}}</span></p>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: 0,
      value: '',
      searchParam: {
        name: '',
        Phone: ''
      },
      loading: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      MAI_Name: '',
      AllFactory: [],
      isShow: false,
      saveModal: false,
      deleteModal:false,
      isAdd:false,
      formData: {
      },
      userList: [
        {
          title: '用户ID',
          key: 'UserID',
          align: 'center',
        },
        {
          title: '账号',
          key: 'EnName',
          align: 'center',
        },
        {
          title: '用户名',
          key: 'CnName',
          align: 'center',
        },
        {
          title: '手机号',
          key: 'Phone',
          align: 'center',
        },
        {
          title: '注册时间',
          key: 'CreateTime',
          align: 'center',
        },
        {
          title: '所属维修厂',
          key: 'MAI_Name',
          align: 'center',
        },
        {
          title: '状态',
          key: 'Status',
          align: 'center',
          render: (h, params) => {
            let valueName = ``;
            const valueCode = params.row.Status;
            if (valueCode && valueCode == '0') valueName = "停止"
            if (valueCode && valueCode == '1') valueName = "启动"
            return h('span', {
            }, valueName)
          }


        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      userData: [],
      Status: [{ CodeValue: '1', CodeName: '启动' },
      { CodeValue: '0', CodeName: '不启动' }]
    }
  },
  methods: {
    //   编辑
    editUserData(index) {
      this.isShow = true;
      this.formData = JSON.parse(JSON.stringify(this.userData[index]));
    },
    // 删除
    remove(index) {
      const param ={
          UserID:this.formData.UserID
      };
      this.$curl.get('api/hj/deleteUserInfo',param).then(res=>{
          if(res.code==1){this.$Message.success(res.msg)}else{this.$Message.error(res.msg)};
      });
      this.getUserData();
    },
    showDeleteModal(index){
        this.deleteModal=true;
        this.formData = JSON.parse(JSON.stringify(this.userData[index]));
    },
    saveData() {
      this.$curl.get('api/hj/editUserData', this.formData).then(res => {
        if (res.code == 1) {
          this.$Message.success(res.msg);        }
        else { this.$Message.error(res.msg) };
      });
      this.getUserData();
    },
    // 新增
    addUserInfo(){
  this.isShow = true;
  this.isAdd=true;
  this.formData={};
    },
    cancel() { },
    //获取所有维修厂名称
    getUserData() {
      let EntKey = '', param = {};
      if (this.MAI_Name) {
        this.AllFactory.forEach(item => {
          if (item.MAI_Name.indexOf(this.MAI_Name) > -1) {
            EntKey = item.EntKey;
          } else {
            EntKey = item.MAI_Name;
          }
        })
      };
      param = {
        ...this.searchParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        EntKey: EntKey
      };
      this.loading = true;
      this.$curl.get('api/hj/getIMUserInfo', param).then(res => {
        if (res.code == 0) {
          this.$Message.error(res.msg);
        } else {
          const { total, list } = res.data;
          this.total = total;
          this.userData = list.map(e => {
            this.AllFactory.forEach(i => {
              if (e.EntKey == i.EntKey) {
                Object.assign(e, { MAI_Name: i.MAI_Name });
              }
            });
            return e;
          });

        }
      });

      this.loading = false;
    },
    getAllFactoryName(MAI_Name) {
      let params = {};
      if (MAI_Name) {
        params.MAI_Name = MAI_Name;
      }
      this.$curl.get('api/hj/getUserFactory', params).then(res => {
        this.AllFactory = res.data;
      });
    },
    handleData(index) {
      this.pageIndex = index;
      this.getUserData();
    },
    getPageSize() {
    },
    asyncOK() { },
    //过滤数据
    returncodename(namelist, codevalue) {
      if (namelist.length == 0) return codevalue;
      let CodeName = "";
      namelist.forEach((item) => {
        if (item.CodeValue == codevalue) CodeName = item.CodeName;
      });
      return CodeName;
    },
    setHeight(){
        this.height=this.$refs.main.offsetHeight-100;
    }

  },
  mounted() {
    this.$nextTick(() => {
      this.setHeight();
    })
      window.addEventListener("resize",this.setHeight);
    this.getAllFactoryName();
    this.getUserData();
  },
    destroyed() {
    window.removeEventListener("resize", this.setHeight);
  }
}
</script>

<style lang="less" scoped>
.searchDom {
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.bottomPage{
    padding: 10px;
}
/deep/.ivu-form-item-content {
  display: flex;
  align-items: center;
}
/deep/.ivu-modal-content {
  width: 580px;
}
</style>