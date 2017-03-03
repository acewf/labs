var webpack = require("webpack");
var runSequence = require('run-sequence');
var gutil = require("gulp-util");
var gulp = require("gulp");
var WebpackConfig = require("./webpack.config.js");
var WebpackDevServer = require("webpack-dev-server");
var path    = require("path");
var BabiliPlugin = require("babili-webpack-plugin");

gulp.task("default", function (done) {
  runSequence("build-dev-webpack", done);
});

gulp.task("build", function (done) {
  runSequence("build-webpack", done);
});

gulp.task("build-webpack", function (done) {
    // modify some webpack config options
    var myConfig = Object.assign({}, WebpackConfig);

    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new BabiliPlugin({})
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("build-webpack", err);
        gutil.log("[build-webpack]", stats.toString({colors: true}));
        done();
    });
});

gulp.task("build-dev-webpack", function (done) {
    var myDevConfig = Object.assign({}, WebpackConfig);
    // create a single instance of the compiler to allow caching
    var devCompiler = webpack(myDevConfig);
    // run webpack
    devCompiler.run(function (err, stats) {
        done();
    });
    new WebpackDevServer(devCompiler,{
        contentBase: path.join(__dirname, "public"),
        compress: true,
        port: 9000
      }).listen(9000, 'localhost', function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:9000/webpack-dev-server/");
      });



});

gulp.task("build-dev-webpack-watch", function () {
    return gulp.watch(["src/**/*"], ["build-dev-webpack"]);
});
