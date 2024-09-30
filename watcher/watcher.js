const chokidar = require('chokidar');
const child_process = require('child_process')
const fs = require('fs');

// macro
const debug = process.argv[2] === 'debug' || false
const log = debug? console.log.bind(console) : () => {}

// project global variable
let init = false
let building = false
let lastUnbuiltChange = ''

let packagesDir = []

const stepInit = async () => {
  packagesDir = await fetchPackagesInfo()

}

const fetchPackagesInfo = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir('../packages', (err, files) => {
      resolve(files)
    });
  })
}

const stepWatch = async () => {
  const chalk = (await import("chalk")).default
  const ora = (await import('ora')).default()

  log("start watching")
  const watcher = chokidar.watch('../packages/.', {
    ignored: /(\/node_modules|\/dist|\/typings)/, // ignore dotfiles
    interval: 100,
    persistent: true
  }).on('ready', () => {
    console.log(chalk.blue("开始监听 packages"))
    init = true
  }).on('all', (event, path) => {
    log(event, path);
    let found = [...path.matchAll(/^..\/packages\/(.+?)\//gi)]
    if(found.length === 0){
      return 0
    }
    let targetDir = found[0][1]

    if(init){
      if(building){
        // 等待更新
        lastUnbuiltChange = lastUnbuiltChange === ''? targetDir : '*'
        return
      }
      building = true
      const buildProc = (nextDir = '') => {
        
        const spinner = ora.start()

        nextDir = nextDir || targetDir

        if(packagesDir.includes(nextDir)){
          const cmd = nextDir === ''? `cd .. && pnpm run build` : `cd ../packages/${nextDir} && pnpm run build`
          spinner.text = `${nextDir === ''? '全部 package': nextDir} 更新中...`;
          console.time()
          child_process.exec(cmd,  function(err, stdout){
            if(err){
              console.log(chalk.red(err))
              return
            }
            spinner.succeed(`更新完成`);
            console.timeEnd()
            console.log('')
            if(lastUnbuiltChange !== ''){
              log("running delayed build")
              lastUnbuiltChange = ''
              buildProc(lastUnbuiltChange)
            }
            building = false
          });
        }
      }
      buildProc()
    }
  });
  return watcher
}

const shutdown = function(watcher){
  return new Promise((resolve, reject) => {
    watcher.close().then(async() => {
      console.log('监听器已经关闭')
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}


const main = async () => {
  // prepare the global variable
  await stepInit()

  // release the watcher
  const watcher = await stepWatch()

  // elegantly shutdown
  process.on('SIGINT', () => {
    shutdown(watcher)
  });

  process.on('SIGTERM', () => {
    shutdown(watcher)
  });

  process.on('SIGBREAK', () => {
    shutdown(watcher)
  });
}

main()






