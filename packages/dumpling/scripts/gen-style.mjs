import * as sass from 'sass'
import postcss from 'postcss'

const result = sass.compile('./src/style.scss')

postcss()
  .process(result)
  .then((result) => {
    console.log(result)
  })
