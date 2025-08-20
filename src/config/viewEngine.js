import express from "express"; // cú pháp ES6

let configViewEngine = (app) => {
  app.use(express.static("./src/public")); // Thiết lập thư mục tĩnh (images, css,..)
  app.set("view engine", "ejs"); // Thiết lập viewEngine
  app.set("views", "./src/views"); // Thư mục chứa views
};

export default configViewEngine; // xuất hàm ra

