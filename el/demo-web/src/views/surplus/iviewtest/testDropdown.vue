<template>
  <div>
    <Dropdown>
      <a href="javascript:void(0)">
        下拉菜单
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem disabled>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown style="margin-left: 20px">
      <Button type="primary">
        下拉菜单
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem disabled>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <Dropdown placement="bottom-start">
      <a href="javascript:void(0)">
        菜单(左)
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown style="margin-left: 20px">
      <a href="javascript:void(0)">
        菜单(居中)
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown style="margin-left: 20px" placement="bottom-end">
      <a href="javascript:void(0)">
        菜单(右)
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem>豆汁儿</DropdownItem>
        <DropdownItem>冰糖葫芦</DropdownItem>
        <DropdownItem>北京烤鸭</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <br />
    <br />
    <Dropdown>
      <a href="javascript:void(0)">
        北京小吃
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem>驴打滚</DropdownItem>
        <DropdownItem>炸酱面</DropdownItem>
        <DropdownItem>豆汁儿</DropdownItem>
        <Dropdown placement="right-start">
          <DropdownItem>
            北京烤鸭
            <Icon type="ios-arrow-forward"></Icon>
          </DropdownItem>
          <DropdownMenu slot="list">
            <DropdownItem>挂炉烤鸭</DropdownItem>
            <DropdownItem>焖炉烤鸭</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <DropdownItem>冰糖葫芦</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <br><br>
     <Breadcrumb>
            <BreadcrumbItem to="/">Home</BreadcrumbItem>
            <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
            <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
          </Breadcrumb>


          <Breadcrumb>
            <BreadcrumbItem to="/">
              <Icon type="ios-home-outline"></Icon>Home
            </BreadcrumbItem>
            <BreadcrumbItem to="/components/breadcrumb">
              <Icon type="logo-buffer"></Icon>Components
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Icon type="ios-cafe"></Icon>Breadcrumb
            </BreadcrumbItem>
          </Breadcrumb>
  </div>
</template>
<script>
export default {};
</script>