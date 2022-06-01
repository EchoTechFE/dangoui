import Vue from 'vue'
import SnackbarComponent from './Snackbar.vue'

export const Snackbar = SnackbarComponent
export const DuSnackbar = SnackbarComponent

export default (props) => {
    const { duration, offset, showClose, onAction } = props;
    const mergedProps = {
        ...props,
        show: true,
        duration: showClose ? duration : (duration || 3),
        offset: offset || 40
    };
    const SnackbarConstructor = Vue.extend(SnackbarComponent);
    const instance = new SnackbarConstructor({
        propsData: mergedProps
    });
    const vm = instance.$mount();
    const el = vm.$el;
    vm.$on('action', onAction);
    vm.$on('close', () => {
        vm.$props.show = false;
        setTimeout(() => {
            document.body.removeChild(el);
            vm.$destroy()
        }, 300)
    });
    document.body.appendChild(el)
}
