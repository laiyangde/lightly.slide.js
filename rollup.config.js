import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';//运行加载 node_modules 中的三方模块。
import commonjs from 'rollup-plugin-commonjs';//将CommonJS模块转换成ES6，防止他们在Rollup中失效。
import uglify from 'rollup-plugin-uglify';
export default {
  entry: 'src/lightly.slide.js',
  format: 'umd',
  plugins: [ 
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    glsl(),
  	babel({
      exclude: 'node_modules/**',
    }),
    // uglify(),
    // eslint({
    //   exclude: [
    //     'src/styles/**',
    //   ]
    // }), 
  ],
  moduleName: 'lightly',
  dest: 'dest/lightly.slide.js', // 输出文件
  sourceMap: false
};


function glsl() {

  return {

    transform( code, id ) {

      if ( /\.glsl$/.test( id ) === false ) return;

      var transformedCode = 'export default ' + JSON.stringify(
        code
          .replace( /[ \t]*\/\/.*\n/g, '' )
          .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
          .replace( /\n{2,}/g, '\n' )
      ) + ';';
      return {
        code: transformedCode,
        map: { mappings: '' }
      };

    }

  };

}