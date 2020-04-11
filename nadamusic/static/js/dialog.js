"use strict";

var AlertDialog = function AlertDialog(_ref) {
    var id = _ref.id,
        title = _ref.title;

    var url = document.head.querySelector("meta[name=url]").content;
    // const [playing, setPlaying] = React.useState();


    React.useEffect(function () {
        var dialog = new mdc.dialog.MDCDialog(document.querySelector(".mdc-dialog"));
        dialog.open();
    }, []);

    function deleteSong() {
        console.log("delete song", id);
        fetch(url + "/api/song/delete", {
            method: "POST",
            body: JSON.stringify({
                id: id
            })
        });
    }

    function Open() {
        dialog.open();
    }

    return React.createElement(
        "div",
        { className: "mdc-dialog" },
        React.createElement(
            "div",
            { className: "mdc-dialog__container" },
            React.createElement(
                "div",
                { className: "mdc-dialog__surface", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "my-dialog-title",
                    "aria-describedby": "my-dialog-content" },
                React.createElement(
                    "h2",
                    { className: "mdc-dialog__title", id: "my-dialog-title" },
                    "DELETE ALERT"
                ),
                React.createElement(
                    "div",
                    { className: "mdc-dialog__content", id: "my-dialog-content" },
                    "Are you sure you want to delete " + title + "?"
                ),
                React.createElement(
                    "footer",
                    { className: "mdc-dialog__actions" },
                    React.createElement(
                        "button",
                        { type: "button", className: "btn btn-success col m-1", "data-mdc-dialog-action": "no" },
                        "CANCEL"
                    ),
                    React.createElement(
                        "button",
                        { type: "button", className: "btn btn-danger col m-1", onClick: deleteSong, "data-mdc-dialog-action": "yes" },
                        "DELETE"
                    )
                )
            )
        ),
        React.createElement("div", { className: "mdc-dialog__scrim" })
    );
};

function deleteAlert(id, title) {
    console.log(title, id);
    var domContainer = document.querySelector("#alert");
    ReactDOM.render(React.createElement(AlertDialog, { id: id, title: title }), domContainer);
}