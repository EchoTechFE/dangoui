const path = require('path');
const fs = require('fs');

const dependencies = require('../package.json').dependencies;

const duDeps = Object.keys(dependencies).filter((dep) =>
  /@frontend\/du-(?!styles)/.test(dep),
);

if (!fs.existsSync(path.join(__dirname, '../packages'))) {
  fs.mkdirSync(path.join(__dirname, '../packages'));
}

duDeps.map((dep) => {
  const modulesSrcDir = path.join(__dirname, '../node_modules', dep, '/src');
  const files = fs.readdirSync(modulesSrcDir);

  const packageDir = path.join(
    __dirname,
    '../packages',
    dep.replace('@frontend/', ''),
  );

  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir);
  }
  files.map((file) => {
    const fileData = fs.readFileSync(path.join(modulesSrcDir, file));
    fs.writeFileSync(path.join(packageDir, file), fileData);
  });
});
