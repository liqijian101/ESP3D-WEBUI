export default store => {
    store.on("@init", () => ({
        content: [],
        showTerminal: false,
        showFiles: false,
        activePage: 2,
        activeSetting: 1,
        dialogData: [],
        showPage: false,
        showDialog: false,
        notifificationBottom: "50px",
    }))

    store.on("monitor/set", ({ content }, newcontent) => {
        return { content: newcontent }
    })
    store.on("panel/showterminal", ({ showTerminal }, newstate) => {
        return { showTerminal: newstate }
    })
    store.on("panel/showfiles", ({ showFiles }, newstate) => {
        return { showFiles: newstate }
    })
    store.on("displayPage", ({ showPage }, newstate) => {
        return { showPage: newstate }
    })
    store.on("displayDialog", ({ showDialog }, newstate) => {
        return { showDialog: newstate }
    })
    store.on("setPage", ({ activePage }, newstate) => {
        return { activePage: newstate }
    })
    store.on("setSettingTab", ({ activeSetting }, newstate) => {
        return { activeSetting: newstate }
    })
    store.on("setDialog", ({ dialogData }, newdata) => {
        return { dialogData: newdata }
    })
    store.on("setNotificationBottom", ({ notifificationBottom }, newvalue) => {
        return { notifificationBottom: newvalue }
    })
}
