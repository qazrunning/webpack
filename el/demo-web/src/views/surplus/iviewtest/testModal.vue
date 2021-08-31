<template>
  <div>
    <Button type="primary" @click="modal1 = true">Display dialog box</Button>
    <Modal v-model="modal1" title="Common Modal dialog box title" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
    <br />
    <br />
    <Button @click="modal2 = true">Custom header and footer</Button>
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>Delete confirmation</span>
      </p>
      <div style="text-align:center">
        <p>After this task is deleted, the downstream 10 tasks will not be implemented.</p>
        <p>Will you delete it?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>
      </div>
    </Modal>
    <Button @click="modal3 = true">No title bar</Button>
    <Modal v-model="modal3">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
    <Button @click="modal4 = true">Internationalization</Button>
    <Modal v-model="modal4" title="Modal Title" ok-text="OK" cancel-text="Cancel">
      <p>Something...</p>
      <p>Something...</p>
      <p>Something...</p>
    </Modal>
    <Button @click="modal5 = true">Set the width</Button>
    <Modal v-model="modal5" title="Custom width" width="300">
      <p>Customize width, unit px, default 520px.</p>
      <p>
        The width of the dialog box is responsive, and the width becomes
        <code>auto</code> when the screen size is less than 768px.
      </p>
    </Modal>

    <br />
    <br />
    <Button @click="modal7 = true">Disable upper right corner (including Esc key)</Button>
    <Modal title="Title" v-model="modal7" :closable="false">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
    <Button @click="modal8 = true">Disable mask layer closure</Button>
    <Modal title="Title" v-model="modal8" :mask-closable="false">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
    <br />
    <br />
    <Button @click="modal11 = true">Open a fullscreen modal</Button>
    <Modal v-model="modal11" fullscreen title="Fullscreen Modal">
      <div>This is a fullscreen modal</div>
    </Modal>
    <br />
    <br />
    <Button @click="modal12 = true">Open the first modal</Button>
    <Button @click="modal13 = true">Open the second modal</Button>
    <Modal v-model="modal12" draggable scrollable title="Modal 1">
      <div>This is the first modal</div>
    </Modal>
    <Modal v-model="modal13" draggable scrollable title="Modal 2">
      <div>This is the second modal</div>
    </Modal>
    <br />
    <br />
    <Button @click="instance('info')">Info</Button>
    <Button @click="instance('success')">Success</Button>
    <Button @click="instance('warning')">Warning</Button>
    <Button @click="instance('error')">Error</Button>
    <br />
    <br />
    <p>Name: {{ value }}</p>
    <p>
      <Button @click="handleRender">Custom content</Button>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      modal1: false,
      modal2: false,
      modal_loading: false,
      modal3: false,
      modal4: false,
      modal5: false,
      modal7: false,
      modal8: false,
      modal11: false,
      modal12: false,
      modal13: false
    };
  },
  methods: {
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    del() {
      this.modal_loading = true;
      setTimeout(() => {
        this.modal_loading = false;
        this.modal2 = false;
        this.$Message.success("Successfully delete");
      }, 2000);
    },
    instance(type) {
      const title = "Title";
      const content = "<p>Content of dialog</p><p>Content of dialog</p>";
      switch (type) {
        case "info":
          this.$Modal.info({
            title: title,
            content: content
          });
          break;
        case "success":
          this.$Modal.success({
            title: title,
            content: content
          });
          break;
        case "warning":
          this.$Modal.warning({
            title: title,
            content: content
          });
          break;
        case "error":
          this.$Modal.error({
            title: title,
            content: content
          });
          break;
      }
    },
    handleRender() {
      this.$Modal.confirm({
        render: h => {
          return h("Input", {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: "Please enter your name..."
            },
            on: {
              input: val => {
                this.value = val;
              }
            }
          });
        }
      });
    }
  }
};
</script>