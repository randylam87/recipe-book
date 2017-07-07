let path = require("path");

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/page1.html"));
  });
  //filler name
  app.get("/page2", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/page2.html"));
  });
  //filler name
  app.get("/page3", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/page3.html"));
  });
  //filler name
  app.get("/page4", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/page4.html"));
  });
  //filler name
  app.get("/page5", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/page5.html"));
  });
};
