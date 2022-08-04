import { DuButton } from '@frontend/du-button/src/index'
import { DuSnackbar, Snackbar } from '@frontend/du-snackbar/src/index'
import '@frontend/du-styles/styles/index.scss'
import './theme.scss'

export default {
  title: 'Snackbar',
  component: DuSnackbar,
  argTypes: {},
}

const Template = (args) => ({
  components: {
    DuButton,
    DuSnackbar,
  },
  setup() {
    return { args }
  },
  data() {
    return {
      showSnackbar: false,
    }
  },
  template: `
        <div>
            <DuButton
              text="点我触发snackbar"
              @click="showSnackbar = true"
            />
            <DuSnackbar
              content="风格都十分广泛的是高大上收费的"
              :offset="44"
              :buttonProps="{
                text: '去开通',
                size: 'mini',
                type: 'primary',
                square: true
              }"
              :showClose="true"
              :show="showSnackbar"
              @close="closeSnackbar"
              @action="dispatchAction"
            />
        </div>
    `,
  methods: {
    closeSnackbar() {
      this.showSnackbar = false
    },
    dispatchAction() {
      console.log('Snackbar的button被点击了')
    },
    toastS() {
      Snackbar({
        content: '我是toast形式的snackbar',
        showClose: true,
        buttonProps: {
          text: '点我触发action',
        },
        onAction() {
          console.log('toast形式的snackbar的button被点击了')
        },
      })
    },
  },
})

export const Default = Template.bind({})

Default.args = {}
