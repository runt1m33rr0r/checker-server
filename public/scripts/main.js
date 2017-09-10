var drawerEl = document.querySelector('.mdc-temporary-drawer');
var MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
var drawer = new MDCTemporaryDrawer(drawerEl);

mdc.autoInit()

document.querySelector('.menu').addEventListener('click', function() {
  drawer.open = true;
});