<template>
<DynamicScroller
  ref="dynamicScroller"
  :items="paragraphs"
  :min-item-size="54"
  class="logger scroller"
  :style="{ color: fgColor, backgroundColor: bgColor }"
>
  <!-- 每一个DynamicScrollerItem都代表着一个段落 -->
  <template v-slot="{ item : paragraph, index, active }">
    <DynamicScrollerItem
      :item="paragraph"
      :active="active"
      :size-dependencies="[
        paragraph.inlines.length,
      ]"
      :data-index="index"
    >
      <!--
        之所以这里需要添加一个空格，是因为DynamicScrollerItem不能准确计算无内容元素的高度。
        如果不添加，将导致显示上的BUG。
      -->
      <span v-if="paragraph.inlines.length === 0">&nbsp;</span>
      <template v-else v-for="span of paragraph.inlines">
        <span v-if="span.style !== undefined" :style="span.style" :key="span.id" v-html="span.text"></span>
        <span v-else :key="span.id" v-html="span.text"></span>
      </template>
    </DynamicScrollerItem>
  </template>
</DynamicScroller>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

class IDGenerator {
  constructor () {
    this.id = 0;
  }

  generate () {
    return this.id++;
  }
}

var MAX_LOG_COUNT = 4000;

export default {
    name: 'Logger',
    beforeCreate () {
      this.idGenerator = new IDGenerator();
    },

    props: {
      autoScroll: {
        type: Boolean,
        default: false
      },
      fgColor: {
        type: String,
        default: 'white'
      },
      bgColor: {
        type: String,
        default: 'black'
      },
    },

    data () {
      return {
        paragraphs: [
          this.createNewParagraph()
        ]
      }
    },

    methods: {
      checkArgs (strText, objStyle) {
        if (typeof strText !== 'string') {
          throw new Error('第一个参数为你要打印到日志窗口上的文本，应当是字符串');
        }
        if (objStyle !== undefined && (typeof objStyle === null || typeof objStyle !== "object")) {
          throw new Error('第二个参数定义了文本的样式，它应当是一个普通对象');
        }
      },
      /**
       * @param strText {string} 要打印在日志窗口上的字符串
       * @param objStyle {{ [prop: string] : string }} 字符串的样式，为一个CSS字符串
       * 
       * 我们可以把日志输入窗口看作一篇“文章”，它由一系列“段落”组成。每个段落占据一整行。
       * 从输入字符串的角度来说，一个回车符的出现，代表我们需要新建一个段落。一个段落由
       * 若干个“行内元素”组成，每个行内元素有自己的样式。
       */
      log (strText, objStyle) {
        this.checkArgs(strText, objStyle);
        let i = 0;
        
        // 输入空字符串不会对日志窗口产生任何影响，可以将其忽略。
        if (strText === "") {
          return; 
        }

        // 这个生成器将遍历输入的字符串，寻找其中的每一个回车，并依次返回它们的下标。
        let indiceOfEveryReturnChars = findIndexOfReturnChars(strText);

        // 一下的代码大意如下：
        // 我们使用一个“回车符遍历器”，在字符串中不停寻找回车符。每当我们找到一个回车符后，我们将
        // 这次遍历被扫描过的文本加到最后一行的末尾（这些文本不会包含回车符），然后，我们新建一个
        // 段落。
        let inlineStart = 0;
        let inlineEnd = 0;
        for (let index of indiceOfEveryReturnChars) {
          inlineEnd = index;
          if (inlineStart !== inlineEnd) {
            this.appendTextToTheLastParagraph(strText.slice(inlineStart, inlineEnd), objStyle);
          }
          this.appendEmptyParagraph();
          inlineStart = inlineEnd + 1;
        }

        // 如果文本的最后一个回车符后面，还有额外的字符，我们需要将他们添加到最后一个段落的末尾。
        // 同样，如果文本不包含回车符，我们也需要将这些文本添加到最后一个段落的末尾。
        if (inlineStart < strText.length) {
          this.appendTextToTheLastParagraph(strText.slice(inlineStart, strText.length), objStyle);
        }

        if (this.paragraphs.length >= MAX_LOG_COUNT) {
          console.log("DELETE OLD LOGS");
          this.paragraphs.splice(0, this.paragraphs.length - MAX_LOG_COUNT / 2);
          console.log(this.paragraphs.length)
        }

        if (this.autoScroll) {
          this.$refs.dynamicScroller.scrollToBottom(); 
        }

        function *findIndexOfReturnChars (str) {
          let reg = /\n/g;
          let result = reg.exec(str);
          while (result !== null) {
            yield result.index;
            result = reg.exec(str);
          }

          return null;
        }
      },

    
      clear () {
          this.paragraphs = [
              this.createNewParagraph()
          ]
      },

      copyAllLogs () {
        return this.paragraphs.reduce((acc, para) => acc + "\n" + this._paragraphToString(para), '');
      },

      _paragraphToString (para) {
        return para.inlines.reduce((acc, inline) => acc + inline.text, '');
      },

      appendTextToTheLastParagraph (text, style) {
        let newInline = this.createInline(text, style);
        this.paragraphs[this.paragraphs.length - 1].inlines.push(newInline);
      },

      appendEmptyParagraph () {
          this.paragraphs.push(this.createNewParagraph());
      },

      isEmptyLine (line) {
        return line.inlines.length === 0;
      },

      createInline (text, style) {
        return {
          id: this.idGenerator.generate(),
          text,
          style
        };
      },

      createNewParagraph () {
        return {
          id: this.idGenerator.generate(),
          inlines: []
        }
      }
    },

    components: {
      DynamicScroller, DynamicScrollerItem
    }
}
</script>

<style>
.logger {
  height: 500px;
  font-size: 16px;
  line-height: 1;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
}

/** Logger下所有元素的字体颜色，与背景颜色，都来自Logger根元素 */
.logger * {
  color: inherit;
  background-color: inherit;
}

/** 上面设置white-space: pre-wrap会导致多出一行，使用如下Hack将其抵消 */
.logger:first-line {
  font-size: 0;
}

.log-input {
  padding: 10px;
  font-size: 16px;
  height: 200px;
  width: 80%;
}
</style>