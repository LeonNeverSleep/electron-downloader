const { dialog } = require("electron");
exports.openDialog = function (defaultpath, callback) {
    dialog.showOpenDialog({
        defaultPath: defaultpath,
        properties: [
            'openFile',
        ],
        filters: [
            { name: 'All, extensions: [' * '] },
        ]
    }, function (res) {
        callback(res[0])
    })
}