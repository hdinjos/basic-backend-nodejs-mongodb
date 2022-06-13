const path = require("path");
const { readdir } = require("fs/promises");
const pathRoute = path.join(path.dirname(require.main.filename), "routes");

const getRoute = async (app) => {
  try {
    const data = (await readdir(pathRoute, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((dirent) => dirent !== "auth");
    data.forEach((dir) => {
      app.use("/api", require(pathRoute + "/" + dir));
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getRoute;
