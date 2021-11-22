const settingsConfig = {
    layout          : {
        style : 'layout1', // layout-1 layout-2 layout-3
        config: {
            rightSidePanel: {
                display: false
            },
            navbar: {
                folded: true
            },
            footer: {
                display: false
            },
            userNavbarHeader: {
                display: false
            }
        } // checkout layout configs at app/fuse-configs/layout-1/Layout1Config.js
    },
    customScrollbars: true,
    theme           : {
        main   : 'default',
        navbar : 'mainThemeDark',
        toolbar: 'mainThemeLight',
        footer : 'mainThemeDark'
    }
};

export default settingsConfig;
