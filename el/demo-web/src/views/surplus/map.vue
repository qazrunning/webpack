<template>
    <div>
        <p v-if="num%2==0">{{num}}</p>
    </div>
</template>

<script>
    export default {
        name: 'tree',
        props: {
            num: Number
        },
        computed: {
            n: function () {
                var s = this.num - 1;
                return s;
            }
        }
    } 
</script>