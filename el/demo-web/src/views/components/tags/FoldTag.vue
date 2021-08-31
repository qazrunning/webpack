<script>
export default {
  name: 'FoldTag',
  props: {
    TagData: {
      type: Array,
      required: true
    },
    ShowTagNum: {
      type: Number,
      required: true
    },
    Place: {
      type: String
    }
  },
  data () {
    return {
      data: []
    }
  },
  mounted () {
  },
  render (h) {
    const _this = this;
    const tempData = JSON.parse(JSON.stringify(this.TagData));
    tempData.forEach((item, index) => {
      item.id = index;
    })
    let fullShowTag = [];
    let foldShowTag = [];
    if (this.ShowTagNum) {
      fullShowTag = tempData.splice(0, this.ShowTagNum);
    }
    foldShowTag = tempData;
    const childNodes = [];
    fullShowTag.forEach(item => {
      childNodes.push(
        h(
          'Tag',
          {
            props: {
              color: item.color
            }
          },
          item.label
        )
      )
    });
    foldShowTag.forEach(item => {
      childNodes.push(
        h(
          'Tooltip',
          {
            props: {
              content: item.tooltip,
              placement: _this.Place || 'left'
            }
          },
          [
            h(
              'Tag',
              {
                props: {
                  color: item.color
                },
                class: 'fold-tag'
              }
            )
          ]
        )
      )
    });
    return h(
      'div',
      {
        class: 'tag-container'
      },
      childNodes
    );
  }
}
</script>

<style lang="scss" scoped>
.tag-container {
  .ivu-tag {
    border-radius: 0;
    margin: 2px 0 2px 0;
    cursor: pointer;
  }
  .ivu-tag-default {
    background-color: #f7f7f7 !important;
  }
  .fold-tag {
    width: 12px;
    padding: 0;
    // box-shadow: 1px 0px 10px 0px #ffffff;
  }
  .ivu-tooltip {
    cursor: pointer;
    width: 12px;
  }
}

</style>