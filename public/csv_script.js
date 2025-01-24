var columns = ["column1", "column2", "column3"];
require("csv-to-array")({
   file: "demo.csv",
   columns: columns
}, function (err, array) {
  console.log(err || array);
});