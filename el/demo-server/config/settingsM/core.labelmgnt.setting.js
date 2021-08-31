const path = require("path");
require("colors");

module.exports = (app) => {
  // let target = path.join(__dirname, setingFilePath);
  const setingFilePath = path.join(path.resolve(), "../cfgs/core.labelmgnt.setting.json");

  return {
    setingFilePath,
    filetype: "json",
    label: "标签管理",
    async onLoad(cfg) {
      return {
        labelgroup1: {
          title: "标签测试1",
          database: "fx",
          G_tablename: "demo_labelgroup",
          R_tablename: "demo_labelr",
          D_tablename: "demo_labelobj",
          display: 'page',
          dConfig: {
            IDField: "id",
            NameField: "name",
          },
        },
        labelgroup2: {
          title: "标签测试2",
          database: "fx",
          G_tablename: "demo_labelgroup",
          R_tablename: "demo_labelr",
          D_tablename: "demo_labelobj2",
          dConfig: {
            IDField: "ID",
            NameField: "Name",
          },
        }
      };

    },
    // onSave: async function (ctx, next, { data }) {
    //   this.reLoad(data);
    //   await next();
    // }
  };
};
