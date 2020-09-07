const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const tailwind = require("tailwindcss");

gulp.task("css", () => {
  return gulp
    .src("./public/tailwind.css")
    .pipe(postcss([autoprefixer, tailwind]))
    .pipe(gulp.dest("./public/build"));
});

gulp.task("watch", () => {
  gulp.watch("./public/tailwind.css", gulp.series(["css"]));
});
