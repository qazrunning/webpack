<template>
<div>
    <Rate v-model="value" />
    <Rate allow-half v-model="valueHalf" />
    <br><br>
     <Row>
        <Col span="12">
            <Rate show-text v-model="valueText" />
        </Col>
        <Col span="12">
            <Rate show-text allow-half v-model="valueCustomText">
                <span style="color: #f5a623">{{ valueCustomText }}</span>
            </Rate>
        </Col>
    </Row>
    <br><br>
    <Rate disabled v-model="valueDisabled" />
    <br><br>
    <Rate clearable v-model="value1" /> clearable: true
    <Rate v-model="value2" /> clearable: false
    <br><br>
     <Rate v-model="value3" character="A" />
    <Rate v-model="value4" character="好" />
    <Rate v-model="value5" icon="ios-heart" />
    <Upload action="//jsonplaceholder.typicode.com/posts/">
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload>
</div>
</template>
<script>
    export default {
        data () {
            return {
                value: 0,
                valueHalf: 2.5,
                valueText: 3,
                valueCustomText: 3.8,
                valueDisabled: 2,
                value1: 3,
                value2: 3,
                 value3: 3,
                value4: 3,
                value5: 3
            }
        }
    }
</script>