import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ghPages from "gulp-gh-pages";
import htmlMin from "gulp-htmlmin";
import ws from "gulp-webserver";
import gimage from "gulp-imagemin";

sass.compiler = require("node-sass");

const routes = {
  css: {
    watch: "src/scss/*",
    src: "src/scss/styles.scss",
    dest: "dist/css/",
  },
  html: {
    watch: "./index.html",
    src: "./index.html",
    dest: "dist/",
  },
  img: {
    src: "src/img/*",
    dest: "dist/img/",
  },
};

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const htmlMinify = () =>
  gulp.src(routes.html.src).pipe(htmlMin()).pipe(gulp.dest(routes.html.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.html.watch, htmlMinify);
};

const img = () => {
  return gulp
    .src(routes.img.src)
    .pipe(gimage())
    .pipe(gulp.dest(routes.img.dest));
};

const clean = () => del(["dist", ".publish"]);

const webserver = () =>
  gulp.src("dist").pipe(ws({ livereload: true, open: true }));

const gh = () => gulp.src("dist/**/*").pipe(ghPages());

const prepare = gulp.series([clean, img]);

const assets = gulp.series([htmlMinify, styles]);

const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, clean]);
