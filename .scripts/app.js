window.app = {"version":"1.0.0","resources":[{"name":"table-data","type":"restful","uri":"http://39.105.230.7/mock/5f642d3ba107ca0020321882/example/table"},{"name":"nav","type":"static","value":[{"key":"infras","label":"基础设施","menus":[{"key":"infras","label":"概览","path":"/preview"},{"key":"solution","label":"解决方案","path":"/solutions"},{"key":"pipeline","label":"工作流","path":"/pipeline"}]},{"key":"project","label":"项目","menus":[{"key":"project","label":"项目","path":"/project"},{"key":"build","label":"构建","path":"/build"}]}]}],"authorization":{"type":"jwt","key":"access","unlogin":{"redirect":"login"}},"externals":[{"type":"script","uri":"//onepaas.oss-cn-beijing.aliyuncs.com/antd/antd.min.js"},{"type":"style","uri":"//onepaas.oss-cn-beijing.aliyuncs.com/antd/antd.min.css"}],"components":[{"name":"nav-layout","source":{"type":"uri","uri":"http://oss.onelaas.com/ux/lnm-nav-layout/1.0.6/dist/main-1.0.6.min.js","path":"@lnm/nav-layout"}},{"name":"form","source":{"type":"uri","uri":"http://onepaas.oss-cn-beijing.aliyuncs.com/ux/lnm-form/1.0.6/dist/main-1.0.6.min.js","path":"@lnm/form"}},{"name":"login","source":{"type":"uri","uri":"http://onepaas.oss-cn-beijing.aliyuncs.com/ux/lnm-login/1.0.2/dist/main-1.0.2.min.js","path":"@lnm/login"}},{"name":"datatable","source":{"type":"uri","uri":"http://onepaas.oss-cn-beijing.aliyuncs.com/ux/lnm-table/1.0.3/dist/main-1.0.3.min.js","path":"@lnm/table"}}],"pages":[{"name":"home","path":"/home","layout":{"name":"nav-layout","resource-deps":["nav"],"statics":{"logoSrc":"https://circleci.com/docs/assets/img/logos/logo-wordmark.svg","navType":"slot","activeNav":"project","activeMenu":"build"}},"resources":[{"name":"table-columns","type":"restful","uri":"http://39.105.230.7/mock/5f642d3ba107ca0020321882/example/table-columns"}],"resource-deps":["table-data"],"components":[{"name":"datatable","slot":"project","resource-deps":[{"dataSource":"table-data"},{"columns":"table-columns"}],"links":[{"detail":"one-detail"}]}]},{"name":"login","path":"/","components":[{"name":"login","slot":"content","statics":{"submit":"http://39.105.230.7/mock/5f642d3ba107ca0020321882/example/form"},"resources":["form"],"links":["home"]}]},{"name":"detail","path":"/detail-form","layout":{"name":"nav-layout","resource-deps":["nav"],"statics":{"logoSrc":"https://circleci.com/docs/assets/img/logos/logo-wordmark.svg","navType":"slot","activeNav":"project","activeMenu":"project"}},"resources":[{"name":"fomr-detail-fields","type":"restful","uri":"http://39.105.230.7/mock/5f642d3ba107ca0020321882/example/detail-form-fields"},{"name":"form-detail","type":"restful","uri":"http://39.105.230.7/mock/5f642d3ba107ca0020321882/example/detail-form"}],"components":[{"name":"form","slot":"project","resource-deps":[{"data":"form-detail"},{"fields":"fomr-detail-fields"}],"links":[{"back":"home"}]}]}]}
