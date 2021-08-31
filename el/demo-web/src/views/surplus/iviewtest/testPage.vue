<template>
  <div>
    <Page :total="100" />
    <br />
    <br />
    <Page :total="100" show-sizer />
    <br />
    <br />
    <Page :total="100" show-elevator />
    <br />
    <br />
    <Page :total="100" show-total />
    <br />
    <br />
    <Page :current="2" :total="50" simple />
    <br />
    <br />
    <Page :total="100" prev-text="Previous" next-text="Next" />
  </div>
</template>
<script>
export default {};
</script>