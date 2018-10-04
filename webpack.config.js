var path = require('path');

module.exports = {
    entry: "./project/static/scripts/jsx/main.jsx",
    watch: true,
    output: {
        path: path.join(__dirname, 'project/static/scripts/js'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            }
        ],
    }
};