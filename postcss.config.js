const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: {
    "autoprefixer": {
      flex: true,
      browsers: [
        '> 1%',
        'last 3 versions'
      ]
    },
    "postcss-px-to-viewport": {
      viewportWidth: 375,   // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334,
      unitPrecision: 5,     // 指定`px`转换为视窗单位值的小数位数
      viewportUnit: "vw",   //指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['.ignore'],// 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1,     // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false,     // 允许在媒体查询中转换`px`
      exclude: [/node_modules/]
    }
  }
};