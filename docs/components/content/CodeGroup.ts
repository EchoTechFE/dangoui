export default defineComponent({
  setup(props) {
    const slots = useSlots()
    const defaultSlot = slots?.default?.() ?? []
    const tabs = defaultSlot.map((vnode) => vnode.props.filename)
    const activeTab = ref<string>(tabs[0])

    return () => {
      return h(
        'div',
        {
          class:
            'border border-solid border-border-2 rounded-4px overflow-hidden',
        },
        [
          h(
            'div',
            {
              class:
                'flex items-center justify-between p-8px border-b border-b-border-2',
            },
            [
              h(
                'div',
                {
                  class: 'flex items-center gap-x-4px',
                },
                tabs.map((tab) => {
                  return h(
                    'div',
                    {
                      class: [
                        'cursor-pointer hover:bg-bg-2 c-neutral-800 rounded-4px px-8px py-4px text-14px',
                        activeTab.value === tab && 'bg-bg-2',
                      ],
                      onClick: () => {
                        activeTab.value = tab
                      },
                    },
                    tab,
                  )
                }),
              ),
              h('div', { class: '' }, [
                h('div', { class: 'i-mdi-content-copy' }),
              ]),
            ],
          ),
          h(
            'div',
            { class: 'not-prose px-12px py-16px bg-gray-50' },
            defaultSlot.map((vnode) => {
              return h(
                'div',
                {
                  class:
                    vnode.props.filename === activeTab.value
                      ? 'block'
                      : 'hidden',
                },
                vnode,
              )
            }),
          ),
        ],
      )
    }
  },
})
