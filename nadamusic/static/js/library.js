var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var url = document.head.querySelector("meta[name=url]").textContent;
//   .content.replace(/^http:/, "https:");
var sound = void 0;

var PlayerContainer = function PlayerContainer(_ref) {
  var url = _ref.url,
      title = _ref.title;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      playing = _React$useState2[0],
      setPlaying = _React$useState2[1];

  var _React$useState3 = React.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      player = _React$useState4[0],
      setPlayer = _React$useState4[1];

  var seek = void 0;

  React.useEffect(function () {
    return function () {
      if (sound != null) {
        sound.stop();
        sound.unload();
        sound = null;
      }
      setPlaying(false);
      setPlayer(null);
    };
  }, [url]);

  function togglePlay() {
    if (!player) {
      sound = new Howl({
        src: [url],
        html5: true,
        buffer: true,
        autoplay: false,
        onend: function onend() {
          console.log("Finished!");
          setPlaying(false);
        }
      });
      var id = sound.play();
      setPlayer(id);
      setPlaying(true);
    } else {
      if (playing) {
        sound.pause();
        seek = sound.seek(player);
        setPlaying(false);
      } else {
        sound.play(player);
        sound.seek(seek, player);
        setPlaying(true);
      }
    }
  }

  return React.createElement(
    "button",
    {
      id: "playerBar",
      className: "mdc-fab mdc-fab--extended",
      onClick: togglePlay
    },
    React.createElement("div", { className: "mdc-fab__ripple" }),
    playing ? React.createElement(
      "span",
      { className: "material-icons mdc-fab__icon" },
      "pause"
    ) : React.createElement(
      "span",
      { className: "material-icons mdc-fab__icon" },
      "play_arrow"
    ),
    React.createElement(
      "span",
      { className: "mdc-fab__label", style: { fontSize: "12px" } },
      title
    )
  );
};

var AlertDialog = function AlertDialog(_ref2) {
  var id = _ref2.id,
      title = _ref2.title;

  React.useEffect(function () {
    var dialog = new mdc.dialog.MDCDialog(document.querySelector(".mdc-dialog"));
    dialog.open();
    return function () {
      dialog.close();
    };
  }, [id]);

  function deleteSong() {
    console.log("delete song", id);
    fetch(url + "/api/song/delete", {
      method: "POST",
      body: JSON.stringify({
        id: id
      })
    });
  }

  return React.createElement(
    "div",
    { className: "mdc-dialog" },
    React.createElement(
      "div",
      { className: "mdc-dialog__container" },
      React.createElement(
        "div",
        {
          className: "mdc-dialog__surface",
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": "my-dialog-title",
          "aria-describedby": "my-dialog-content"
        },
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
            {
              type: "button",
              className: "btn btn-success col m-1",
              "data-mdc-dialog-action": "no"
            },
            "CANCEL"
          ),
          React.createElement(
            "button",
            {
              type: "button",
              className: "btn btn-danger col m-1",
              onClick: deleteSong,
              "data-mdc-dialog-action": "yes"
            },
            "DELETE"
          )
        )
      )
    ),
    React.createElement("div", { className: "mdc-dialog__scrim" })
  );
};

var Library = function Library() {
  var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      songs = _React$useState6[0],
      setSongs = _React$useState6[1];

  var _React$useState7 = React.useState(),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      active = _React$useState8[0],
      setActive = _React$useState8[1];

  var _React$useState9 = React.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      visible = _React$useState10[0],
      setVisible = _React$useState10[1];

  React.useEffect(function () {
    fetch(url + "/api/song/list").then(function (resposne) {
      return resposne.json();
    }).then(function (songs) {
      return setSongs(songs.songs);
    });
  }, []);

  function deleteAlert(song) {
    setVisible({
      id: song.id,
      title: song.title
    });
  }

  return React.createElement(
    "div",
    { className: "m-2 w-100 overflow-hidden" },
    visible ? React.createElement(AlertDialog, { id: visible.id, title: visible.title }) : false,
    React.createElement(
      "ul",
      { className: "mdc-list" },
      songs.map(function (song) {
        return React.createElement(
          "li",
          {
            key: song.id,
            className: "mdc-list-item list-song row " + (active === song ? "mdc-list-item--selected" : "bg-white"),
            onClick: function onClick() {
              return setActive(song);
            }
          },
          React.createElement(
            "span",
            { className: "mdc-list-item__text col" },
            song.title
          ),
          React.createElement(
            "span",
            {
              onClick: function onClick() {
                return deleteAlert(song);
              },
              className: "mdc-list-item__meta material-icons icon col-auto",
              "aria-hidden": "true"
            },
            "delete_outlined"
          )
        );
      })
    ),
    active ? React.createElement(PlayerContainer, { title: active.title, url: active.source }) : false
  );
};

var domContainer = document.querySelector("#library");
ReactDOM.render(React.createElement(Library, null), domContainer);