"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var PlayerContainer = function PlayerContainer(_ref) {
  var url = _ref.url,
      title = _ref.title;

  var _React$useState = React.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      playing = _React$useState2[0],
      setPlaying = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      player = _React$useState4[0],
      setPlayer = _React$useState4[1];

  var _React$useState5 = React.useState(),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      sound = _React$useState6[0],
      setSound = _React$useState6[1];

  var seek = void 0;

  function setUpSoundSystem() {
    var instance = new Howl({
      src: [url],
      html5: true,
      buffer: true,
      autoplay: false
    });
    setSound(instance);
  }

  React.useEffect(function () {
    setUpSoundSystem();
  }, []);

  function togglePlay() {
    if (!player) {
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

  if (playing) {
    return React.createElement(
      "button",
      { className: "mdc-fab mdc-fab--extended", onClick: togglePlay },
      React.createElement("div", { className: "mdc-fab__ripple" }),
      React.createElement(
        "span",
        { className: "material-icons mdc-fab__icon" },
        "pause"
      ),
      React.createElement(
        "span",
        { className: "mdc-fab__label" },
        title
      )
    );
  }
  return React.createElement(
    "button",
    { className: "mdc-fab mdc-fab--extended", onClick: togglePlay },
    React.createElement("div", { className: "mdc-fab__ripple" }),
    React.createElement(
      "span",
      { className: "material-icons mdc-fab__icon" },
      "play_arrow"
    ),
    React.createElement(
      "span",
      { className: "mdc-fab__label" },
      title
    )
  );
};

function play(title, url) {
  console.log(title, url);
  var domContainer = document.querySelector("#playerBar");
  ReactDOM.render(React.createElement(PlayerContainer, { url: url, title: title }), domContainer);
}