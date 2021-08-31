<template>
  <div>
    <Select v-model="model1" style="width:200px">
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <br />
    <br />
    <Select v-model="model5" disabled style="width:200px">
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <br />
    <br />
    <Select v-model="model6" style="width:200px">
      <Option value="beijing">New York</Option>
      <Option value="shanghai" disabled>London</Option>
      <Option value="shenzhen">Sydney</Option>
    </Select>
    <br />
    <br />
    <Select v-model="model8" clearable style="width:200px">
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <br />
    <br />
    <Select v-model="model7" style="width:200px">
      <OptionGroup label="Hot Cities">
        <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </OptionGroup>
      <OptionGroup label="Other Cities">
        <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </OptionGroup>
    </Select>
    <br />
    <br />

    <Select v-model="model9" style="width:200px">
      <Option value="New York" label="New York">
        <span>New York</span>
        <span style="float:right;color:#ccc">America</span>
      </Option>
      <Option value="London" label="London">
        <span>London</span>
        <span style="float:right;color:#ccc">U.K.</span>
      </Option>
      <Option value="Sydney" label="Sydney">
        <span>Sydney</span>
        <span style="float:right;color:#ccc">Australian</span>
      </Option>
    </Select>
    <br />
    <br />
    <Select v-model="model10" multiple style="width:260px">
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <br />
    <br />
    <Select v-model="model15" prefix="ios-home" style="width:200px">
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>&nbsp;
    <Select v-model="model15" style="width:200px">
      <Avatar
        src="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
        slot="prefix"
        size="small"
      />
      <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
     <br />
    <br />
    <Row>
      <Col span="12" style="padding-right:10px">
        <Select
          v-model="model13"
          filterable
          remote
          :remote-method="remoteMethod1"
          :loading="loading1"
        >
          <Option
            v-for="(option, index) in options1"
            :value="option.value"
            :key="index"
          >{{option.label}}</Option>
        </Select>
      </Col>
      <Col span="12">
        <Select
          v-model="model14"
          multiple
          filterable
          remote
          :remote-method="remoteMethod2"
          :loading="loading2"
        >
          <Option
            v-for="(option, index) in options2"
            :value="option.value"
            :key="index"
          >{{option.label}}</Option>
        </Select>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      cityList1: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        }
      ],
      cityList2: [
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model7: "",
      model1: "",
      model5: "",
      model6: "",
      model8: "",
      model9: "",
      model10: [],
      model15: "",
      model13: "",
      loading1: false,
      options1: [],
      model14: [],
      loading2: false,
      options2: [],
      list: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New hampshire",
        "New jersey",
        "New mexico",
        "New york",
        "North carolina",
        "North dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode island",
        "South carolina",
        "South dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West virginia",
        "Wisconsin",
        "Wyoming"
      ]
    };
  },
  methods: {
    remoteMethod1(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          const list = this.list.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.options1 = list.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          );
        }, 200);
      } else {
        this.options1 = [];
      }
    },
    remoteMethod2(query) {
      if (query !== "") {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          const list = this.list.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.options2 = list.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          );
        }, 200);
      } else {
        this.options2 = [];
      }
    }
  }
};
</script>