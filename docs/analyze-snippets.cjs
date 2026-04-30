const fs = require('fs');
const path = require('path');

const mdDir = 'content';
const demoDir = 'pages/demos';

const categoryMap = {
  'bar': '2.bar',
  'style': '1.style',
  'form': '3.form',
  'data': '4.data',
  'feedback': '5.feedback',
  'other': '6.other',
  'composables': '7.composables',
  'get-started': '0.get-started',
  'business': 'business',
};

// 把 md 的 path:content:xxx:yyy 格式转成 demo 文件路径
function mdPathToDemoFile(mdPath, idx) {
  const clean = mdPath.replace(/^content:/, '').replace(/:(\d+)$/, '').replace(/\.md$/, '');
  const colonIdx = clean.lastIndexOf(':');
  const categoryPart = clean.substring(0, colonIdx);
  const filenameWithExt = clean.substring(colonIdx + 1);
  const filename = filenameWithExt.replace(/^(\d+)\./, '');
  const category = categoryMap[categoryPart] ?? categoryPart;
  return `${category}/${filename}/snippet${idx}.vue`;
}

// 收集 md 里的 (path, idx)
const mdEntries = [];
function walkMd(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const d of entries) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) {
      walkMd(full);
    } else if (d.name.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf8');
      // 匹配 ::demo 块
      const demoBlocks = [...content.matchAll(/::demo\s*\n---\s*\n([\s\S]*?)\n---\s*\n/s)];
      for (const block of demoBlocks) {
        const attrs = {};
        block[1].split('\n').forEach(line => {
          const [k, ...v] = line.split(':');
          if (k && v.length) attrs[k.trim()] = v.join(':').trim();
        });
        if (attrs.path && attrs.idx) {
          mdEntries.push({ path: attrs.path, idx: parseInt(attrs.idx) });
        }
      }
    }
  }
}
walkMd(mdDir);

// 收集所有 vue snippet 文件
const vueFiles = {};
function walkDemo(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const d of entries) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) {
      walkDemo(full);
    } else if (d.name.startsWith('snippet') && d.name.endsWith('.vue')) {
      const rel = path.relative(demoDir, full).replace(/\\/g, '/');
      vueFiles[rel] = true;
    }
  }
}
walkDemo(demoDir);

// 分类
const both = [], onlyMd = [], onlyFile = [];
const usedVueFiles = new Set();

for (const { path: p, idx } of mdEntries) {
  const vueFile = mdPathToDemoFile(p, idx);
  usedVueFiles.add(vueFile);
  if (vueFiles[vueFile]) {
    both.push({ path: p, idx, vueFile });
  } else {
    onlyMd.push({ path: p, idx, vueFile });
  }
}

for (const f of Object.keys(vueFiles)) {
  if (!usedVueFiles.has(f)) onlyFile.push(f);
}

console.log('=== 统计结果 ===');
console.log('md 里引用的 demo 数:', mdEntries.length);
console.log('snippetN.vue 文件总数:', Object.keys(vueFiles).length);
console.log('');
console.log('md 有引用 + vue 文件存在:', both.length);
console.log('md 有引用 + vue 文件不存在:', onlyMd.length);
console.log('vue 文件存在 + md 未引用:', onlyFile.length);
console.log('');

if (onlyMd.length) {
  console.log('=== md 引用了但 vue 文件不存在 ===');
  onlyMd.forEach(({ path, idx, vueFile }) => {
    console.log(`  ${path}:${idx} -> 期望: ${vueFile}`);
  });
  console.log('');
}

if (onlyFile.length) {
  console.log('=== vue 文件存在但 md 未引用 ===');
  onlyFile.forEach(f => console.log(' -', f));
}
