// https://router.vuejs.org/api/interfaces/routeroptions.html
export default {
  scrollBehavior(to, from, savedPosition) {
    // the saved position allows using the back/forward buttons
    // to retain the position of the page
    // if that's not present, it defaults the position to the top
    return {
      left: savedPosition?.left || 0,
      top: savedPosition?.top || 0,
    };
  },
};
