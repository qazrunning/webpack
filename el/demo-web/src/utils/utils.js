import app from '@skyland/core';
import axios from 'axios';

export const changeTitle = {
    methods: {
        changeTitle(route) {
            if (route.name == 'core-modulesNav') {
                this.$app.helper.core.setModuleTitle(route.meta.title + '—' + app.ProjSetting.title)
                return
            }
            // if(app.ProjSetting)
            if (app.menusDict[route.name])
                this.$app.helper.core.setModuleTitle(app.menusDict[route.name].text + '—' + app.ProjSetting.title)
        }
    },
    watch: {
        "$route": {
            handler(route) {
                if(app.ProjSetting.isTitle) 
                this.changeTitle(route);
            },
            deep: true
        }
    }
}

