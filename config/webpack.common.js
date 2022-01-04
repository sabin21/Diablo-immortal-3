const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = require('./paths')

const pages = ["index", "type_a", "webpack_sample", "home_01"]

module.exports = {
  entry: pages.reduce((config, page) =>{
    config[page] = paths.src + `/${page}.js`;
    return config
  },{}),
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: '',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    })
  ].concat(pages.map(
    (page) => new HtmlWebpackPlugin({
      favicon: paths.src + '/img/favicon.png',
      template: paths.src + `/${page}.html`,
      filename: `${page}.html`,
      chunks: [page]
    })
  )
  ),

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ['babel-loader'] },

      // Images: 이미지 파일 및 3d 파일 복사
      { test: /\.(?:ico|gif|png|jpg|jpeg|glb|gltf|hdr|)$/i, type: 'asset/resource' },

      // Video, Audio: 비디오, 오디오 파일 복사
      { test: /\.(?:mp3|mp4|webm|ogg)$/i, type: 'asset/videos' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },

      // GLSL 셰이더 파일 로더
      { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },

      { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ }

    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  },
}
