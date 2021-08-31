<template>
<div>
    <Row>
        <Col span="12">
            <TimePicker type="time" placeholder="Select time" style="width: 168px"></TimePicker>
        </Col>
        <Col span="12">
            <TimePicker type="timerange" placement="bottom-end" placeholder="Select time" style="width: 168px"></TimePicker>
        </Col>
    </Row>
    <br><br>
    <Row>
        <Col span="12">
            <TimePicker
                :disabled-hours="[1,5,10]"
                :disabled-minutes="[0,10,20]"
                placeholder="Select time"
                style="width: 168px"></TimePicker>
        </Col>
        <Col span="12">
            <TimePicker
                hide-disabled-options
                :disabled-hours="[1,5,10]"
                :disabled-minutes="[0,10,20]"
                placeholder="Select time"
                style="width: 168px"></TimePicker>
        </Col>
    </Row>
    <br><br>
    <Row>
        <Col span="12">
            <TimePicker confirm placeholder="Select time" style="width: 168px"></TimePicker>
        </Col>
        <Col span="12">
            <TimePicker confirm type="timerange" placement="bottom-end" placeholder="Select time" style="width: 168px"></TimePicker>
        </Col>
    </Row>
    </div>
</template>
<script>
    export default {
        
    }
</script>