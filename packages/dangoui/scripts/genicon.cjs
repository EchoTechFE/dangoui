const path = require('path')
const fs = require('fs')
// const webfont = require('webfont').default
var fontCarrier = require('font-carrier')
const OSS = require('ali-oss')
const md5 = require('md5')
const glob = require('glob')
const fse = require('fs-extra')
const aliossConfig = require('../../../.alioss.json')
const crypto = require('crypto')
const _ = require('lodash')

// unicode Private Use Zone E000-F8FF
const START_UNICODE = 0xe000

// 由于font-carrier每次构建出的文件都不一致，所以用icons md5来作为hash
// 如果每次都生成新的文件，则每次都会更新，导致CDN资源浪费
// 改变V可以在构建方式、svg文件没有变化的情况下，构建出新的文件
const V = 2

// ref: iconfont.cn
const CSS_TEMPLATE = `
@font-face {
  font-family: 'dangoui-icon';
  src: url('{{eot}}'); /* IE9 */
  src: url('{{eot}}#iefix') format('embedded-opentype'),
    /* IE6-IE8 */ url('{{woff2}}') format('woff2'),
    url('{{woff}}') format('woff'),
    url('{{ttf}}') format('truetype'),
    url('{{svg}}#iconfont') format('svg');
}
`

function templateStringRender(template, context) {
  if (typeof template !== 'string') return template

  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => context[key.trim()])
}

function getCDNPath(CDN, filename) {
  return `${CDN}/${filename}`
}

const ossClient = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: aliossConfig.accessKeyId,
  accessKeySecret: aliossConfig.accessKeySecret,
  bucket: 'qd-sf-assets',
})

async function upload(filename, fileBuffer) {
  const ossFilePath = `icons/${filename}`
  const res = await ossClient.list({
    prefix: ossFilePath,
    'max-keys': 50,
  })
  const ossFound = (res.objects || []).find((item) => item.name === ossFilePath)

  if (ossFound) {
    console.log(`[已存在,免上传] (上传于 ${ossFound.lastModified}) ${filename}`)
    return
  }
  console.log(`[上传中] ${filename}`)
  await ossClient.put(ossFilePath, fileBuffer)
}

function extractSvgs(fileContent) {
  const allSymbols = fileContent.match(/<symbol.*?<\/symbol>/g)
  const symbolToSvg = (symbolText) => {
    return symbolText
      .replace(
        /<symbol[^>]*>/g,
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">',
      )
      .replace(/<\/symbol>/g, '</svg>')
  }

  const svgIcons = allSymbols
    .map((symbolText) => {
      const matchResult = symbolText.match(/id="(?<iconName>[a-zA-z\d\-]+)/)
      const { iconName } = matchResult?.groups || {}
      const content = symbolToSvg(symbolText)
      if (iconName) {
        return {
          name: iconName,
          content,
        }
      }
    })
    .filter((item) => item)
  return svgIcons
}

async function gen(url) {
  const ret = await fetch(url).then((res) => res.text())
  const svgs = extractSvgs(ret)
  fse.emptyDirSync(path.resolve(__dirname, '../icons'))
  svgs.forEach((item) => {
    fs.writeFileSync(
      path.resolve(__dirname, '../icons', item.name + '.svg'),
      item.content,
    )
  })
  const font = fontCarrier.create()

  const iconConfig = {
    CDN: 'https://assets.qiandaocdn.com/icons',
    font: {},
    icons: {},
  }

  // sort 避免每次生产的文件不一致
  const files = glob
    .sync(path.join(__dirname, '../icons/*.svg'))
    .sort((a, b) => a > b)

  const icons = {}

  const outHash = crypto.createHash('md5')

  let iconConfigTs = ''

  for (let index = 0; index < files.length; index++) {
    const fileBuffer = fs.readFileSync(files[index])
    const hash = md5(fileBuffer)
    outHash.update(fileBuffer)
    const filename = `${hash}.svg`
    const unicode = START_UNICODE + index
    const unicodeChar = String.fromCharCode(unicode)
    font.setSvg(unicodeChar, fileBuffer.toString())

    const parts = files[index].split('/')
    const name = parts[parts.length - 1].replace(/\.svg$/, '')

    function normalizeNameVar(name) {
      return 'icon' + _.upperFirst(_.camelCase(name))
    }

    const nameVar = normalizeNameVar(name)

    const resolvedSvg = fileBuffer
      .toString()
      .replaceAll('#2B263B', 'currentColor')
      .replaceAll('#000', 'currentColor')
      .replaceAll('#000000', 'currentColor')
      .replace(
        'viewBox="0 0 24 24"',
        `viewBox="0 0 24 24" width="1em" height="1em"`,
      )

    iconConfigTs += `let ${nameVar} = { _: '${name}' }\nif (__WEB__) {\n  ${nameVar} = { _: '${resolvedSvg}' }\n}\nexport { ${nameVar} }\n`

    await upload(filename, fileBuffer)

    icons[path.basename(files[index]).replace(/\.svg$/, '')] = {
      unicode: unicodeChar,
      hash,
    }
  }

  // 过滤掉hash,目前用不着
  iconConfig.icons = Object.keys(icons).reduce((obj, key) => {
    const { unicode } = icons[key]
    obj[key] = unicode
    return obj
  }, {})

  outHash.update(`${V}`)

  const outMd5 = outHash.update(`${V}`).digest('hex')

  const { ttf, eot, woff, woff2, svg } = font.output()

  iconConfig.font.ttf = `${outMd5}.ttf`
  iconConfig.font.eot = `${outMd5}.eot`
  iconConfig.font.woff = `${outMd5}.woff`
  iconConfig.font.woff2 = `${outMd5}.woff2`
  iconConfig.font.svg = `${outMd5}.svg`

  await upload(iconConfig.font.ttf, ttf)
  await upload(iconConfig.font.eot, eot)
  await upload(iconConfig.font.woff, woff)
  await upload(iconConfig.font.woff2, woff2)
  await upload(iconConfig.font.svg, svg)

  fs.writeFileSync(
    path.resolve(__dirname, `../src/icon/iconfont-config.json`),
    JSON.stringify(iconConfig),
  )

  fs.writeFileSync(
    path.resolve(__dirname, '../src/icon/iconfont.css'),
    templateStringRender(CSS_TEMPLATE, {
      ttf: getCDNPath(iconConfig.CDN, iconConfig.font.ttf),
      eot: getCDNPath(iconConfig.CDN, iconConfig.font.eot),
      woff: getCDNPath(iconConfig.CDN, iconConfig.font.woff),
      woff2: getCDNPath(iconConfig.CDN, iconConfig.font.woff2),
      svg: getCDNPath(iconConfig.CDN, iconConfig.font.svg),
    }),
  )

  fs.writeFileSync(
    path.resolve(__dirname, '../../dangoui-icon-config/src/index.ts'),
    iconConfigTs,
  )
}

// https://iconpark.oceanengine.com/projects/7443/detail
gen(fs.readFileSync(path.resolve(__dirname, '../icon-url'), 'utf-8'))
