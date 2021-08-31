<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
</style>
<template>
  <div>
    <Timeline>
      <TimelineItem>
        <p class="time">1976年</p>
        <p class="content">Apple I 问世</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">1984年</p>
        <p class="content">发布 Macintosh</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2007年</p>
        <p class="content">发布 iPhone</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2010年</p>
        <p class="content">发布 iPad</p>
      </TimelineItem>
      <TimelineItem>
        <p class="time">2011年10月5日</p>
        <p class="content">史蒂夫·乔布斯去世</p>
      </TimelineItem>
    </Timeline>

    <Timeline>
      <TimelineItem color="yellow">发布1.0版本</TimelineItem>
      <TimelineItem color="green">发布2.0版本</TimelineItem>
      <TimelineItem color="red">严重故障</TimelineItem>
      <TimelineItem color="blue">发布3.0版本</TimelineItem>
    </Timeline>

    <Time :time="time1" />
    <br />
    <Time :time="time2" />
    <br />
    <Time :time="time3" :interval="1" />
    <br />
    <Time :time="time2" />
    <br />
    <Time :time="time2" type="date" />
    <br />
    <Time :time="time2" type="datetime" />
    <br />
    <Time :time="time2" hash="#hash" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      time1: new Date().getTime() - 60 * 3 * 1000,
      time2: new Date().getTime() - 86400 * 3 * 1000,
      time3: new Date()
    };
  }
};
</script>