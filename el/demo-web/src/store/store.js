export default {
    name: "demo",
    module: {
        state: {
            title: "这是业务项目vuex演示",
            scrolls: {},
        },
        getters: {

        },
        mutations: {
            setScrolls(state, elem) {
                let { key, value } = elem;
                state.scrolls[key] = value
                // console.log(state.scrolls)
            }
        },
        actions: {

        }
    }
}