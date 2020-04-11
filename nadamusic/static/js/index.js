let params = new URLSearchParams(window.location.search);
if (params.has("connections")) {
  $("#connectionModal").modal("show");
}






// var snackbar = new mdc.snackbar.MDCSnackbar(
//   document.querySelector(".mdc-snackbar")
// );

// if (snackbar) {
//   toast("hello world");
// }

// function toast(msg) {
//   snackbar.timeoutMs = 5000;
//   snackbar.labelText = "Welcome to the application";
//   snackbar.open();
//   // snackbar.show({
//   //   message: msg,
//   //   actionText: "Close",
//   //   actionHandler: function () {},
//   // });
// }
