<template>
<div>
    <Tooltip placement="top">
        <Button>Multiple lines</Button>
        <div slot="content">
            <p>Display multiple lines of information</p>
            <p><i>Can customize the style</i></p>
        </div>
    </Tooltip>
    &nbsp;
    <Tooltip placement="top" content="Can disable text prompts" :disabled="disabled">
        <Button @click="disabled = true">Click to close</Button>
    </Tooltip>
 &nbsp;
     <Tooltip placement="top" content="Tooltip text" :delay="1000">
        <Button @click="disabled = true">Delay 1 second to show</Button>
    </Tooltip>
 &nbsp;
    <Tooltip content="content of tooltip">
        <Button>Dark(default)</Button>
    </Tooltip>
     &nbsp;
    <Tooltip content="content of tooltip" theme="light">
        <Button>Light</Button>
    </Tooltip>
 &nbsp;
    <Tooltip max-width="200" content="Steven Paul Jobs was an American entrepreneur and business magnate. He was the chairman, chief executive officer, and a co-founder of Apple Inc.">
        <Button>Long Content</Button>
    </Tooltip>
    </div>
</template>
<script>
    export default {
         data () {
            return {
                disabled: false
            }
        }
    }
</script>