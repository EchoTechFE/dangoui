import Footer from '../src/components/Footer/index.vue'
import {shallowMount} from "@vue/test-utils";
describe('Footer of du-modal unit test', () => {
    const wrapper = shallowMount(Footer)
    const props = wrapper.props()
    const {
        showCancelButton,
        showConfirmButton,
        confirmButtonDisabled,
        cancelButtonDisabled,
        cancelButtonText,
        confirmButtonText,
        btnLoading,
        modalLoading
    } = props
    it('should default props be corret', function () {
        expect(showCancelButton).toBeTruthy()
        expect(showConfirmButton).toBeTruthy()
        expect(confirmButtonDisabled).toBeFalsy()
        expect(cancelButtonDisabled).toBeFalsy()
        expect(cancelButtonText).toBe('取消')
        expect(confirmButtonText).toBe('确定')
        expect(btnLoading).toBeFalsy()
        expect(modalLoading).toBeFalsy()
    });

    it('should buttons show correct', function () {
        if (showCancelButton) {
            const cancelButton = wrapper.find('.du-footer-button__cancel')
            cancelButton.exists()
        }
        if (showConfirmButton) {
            const confirmButton = wrapper.find('.du-footer-button__confirm')
            confirmButton.exists()
        }
    });


});
