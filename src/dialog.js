"use strict";



const AlertDialog = ({ id, title }) => {
    const url = document.head.querySelector("meta[name=url]").content;
    // const [playing, setPlaying] = React.useState();
    

    React.useEffect(() => {
        var dialog = new mdc.dialog.MDCDialog(
            document.querySelector(".mdc-dialog")
        )
        dialog.open();
    }, []);


    function deleteSong(){
        console.log("delete song", id)
        fetch(`${url}/api/song/delete`, {
            method: "POST",
            body: JSON.stringify({
              id: id,
            }),
          });
    }

    function Open() {
        dialog.open();
    }

    return (
        <div className="mdc-dialog">
            <div className="mdc-dialog__container">
                <div className="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title"
                    aria-describedby="my-dialog-content">

                    <h2 className="mdc-dialog__title" id="my-dialog-title">
                        DELETE ALERT
            </h2>
                    <div className="mdc-dialog__content" id="my-dialog-content">
                        {`Are you sure you want to delete ${title}?`}
                    </div>
                    <footer className="mdc-dialog__actions">
                        <button type="button" className="btn btn-success col m-1" data-mdc-dialog-action="no">
                            CANCEL
              </button>
                        <button type="button" className="btn btn-danger col m-1" onClick={deleteSong} data-mdc-dialog-action="yes">
                            DELETE
              </button>
                    </footer>
                </div>
            </div>
            <div className="mdc-dialog__scrim"></div>
        </div>
    );


};

function deleteAlert(id, title) {
    console.log(title, id);
    let domContainer = document.querySelector("#alert");
    ReactDOM.render(<AlertDialog id={id} title={title} />, domContainer);
}
