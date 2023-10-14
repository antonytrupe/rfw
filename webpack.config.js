const path = require('path');
const fs = require('fs');

module.exports = {
    //watch:true,
    entry: './src/client/clientEntryPoint.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
        //clean:true
    },
    optimization: {
        minimize: false
    },
    devtool: 'source-map',
    //plugins: [ new HtmlWebpackPlugin() ],
    module: {

        rules: [
            {
                test: /\.css$/,
                use: 'style!css'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'raw-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/lance-gg/'),
                    fs.realpathSync('./node_modules/lance-gg/')
                ],
                use: 'babel-loader',

            }
        ]
    }
};
