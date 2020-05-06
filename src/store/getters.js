const getters = {
  isLogged: state => state.user !== null,
  isFiles: state => !state.loading && state.route.name === 'Files',
  isListing: (state, getters) => getters.isFiles && !!state.req.isDir,
  isEditor: (state, getters) => getters.isFiles && (state.req.type === 'text' || state.req.type === 'textImmutable'),
  isActiveDialog: state => !!state.show,
  isPreview: (state, getters) => !state.loading && !getters.isListing && !getters.isEditor,
  selectedCount: state => state.selected.length,
  currentFolder: state => state.path[state.path.length - 1] || { id: '', name: '' },
  shares: state => state.shares,
  direction: state => state.user && state.user.locale === 'he' ? 'rtl' : 'ltr',
  isSearch: state => state.search,
  getGlobalExternalUsers: state => state.globalExternalUsers,
  getApprovers: state => state.approvers,
  getStepThreeRes: state => state.stepThreeRes,
  userID: state => state.user && state.user.id,
  user: state => state.user
}

export default getters
