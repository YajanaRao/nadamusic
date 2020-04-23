"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var url = document.head.querySelector("meta[name=url]").content;
//   .content.replace(/^http:/, "https:");

var Connection = function Connection(_ref) {
  var title = _ref.title,
      deleteConnection = _ref.deleteConnection,
      getSpec = _ref.getSpec;

  return React.createElement(
    "li",
    { className: "list-group-item bg-light d-flex justify-content-between align-items-center m-1 connection-item" },
    React.createElement(
      "div",
      { onClick: getSpec },
      title
    ),
    React.createElement("img", {
      src: "/static/icons/svg/trash.svg",
      height: "12px",
      width: "12px",
      className: "icon",
      alt: "delete",
      onClick: deleteConnection
    })
  );
};

var Spec = function Spec(_ref2) {
  var spec = _ref2.spec,
      addSong = _ref2.addSong,
      removeSong = _ref2.removeSong;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selected = _React$useState2[0],
      setSelected = _React$useState2[1];

  function selectSong() {
    setSelected(true);
    addSong(spec);
  }

  function undo() {
    setSelected(false);
    removeSong(spec);
  }
  if (selected) {
    return React.createElement(
      "li",
      {
        className: "list-group-item d-flex justify-content-between align-items-center m-1 active song-item",
        onClick: undo
      },
      React.createElement(
        "div",
        null,
        spec.title
      )
    );
  }
  return React.createElement(
    "li",
    {
      className: "list-group-item bg-light d-flex justify-content-between align-items-center m-1 song-item",
      onClick: selectSong
    },
    React.createElement(
      "div",
      null,
      spec.title
    )
  );
};

var BreadCrumb = function BreadCrumb(_ref3) {
  var contentType = _ref3.contentType,
      setContentType = _ref3.setContentType;

  return React.createElement(
    "nav",
    { "aria-label": "breadcrumb" },
    React.createElement(
      "ol",
      { className: "breadcrumb bg-white mb-0 p-0" },
      React.createElement(
        "li",
        {
          className: contentType.integration ? "breadcrumb-item" : "breadcrumb-item active"
        },
        React.createElement(
          "a",
          {
            style: { cursor: "pointer" },
            onClick: function onClick() {
              return setContentType({ type: "integrations" });
            }
          },
          "Integrations"
        )
      ),
      contentType.integration ? React.createElement(
        "li",
        {
          className: contentType.connection ? "breadcrumb-item" : "breadcrumb-item active"
        },
        React.createElement(
          "a",
          {
            style: { cursor: "pointer" },
            onClick: function onClick() {
              return setContentType({ type: "connection" });
            }
          },
          contentType.integration.name
        )
      ) : false,
      contentType.type === "specs" ? React.createElement(
        "li",
        { className: "breadcrumb-item active", "aria-current": "page" },
        contentType.connection
      ) : false
    )
  );
};

var ConnectionsContainer = function ConnectionsContainer(_ref4) {
  var contentType = _ref4.contentType,
      setContentType = _ref4.setContentType,
      setLoading = _ref4.setLoading;

  if (contentType.integration.type === "OAUTH") {
    return React.createElement(OAuth, {
      setLoading: setLoading,
      setContentType: setContentType,
      integration: contentType.integration
    });
  }
  return React.createElement(
    "div",
    null,
    "No Connections"
  );
};

var OAuth = function OAuth(_ref5) {
  var setLoading = _ref5.setLoading,
      setContentType = _ref5.setContentType,
      integration = _ref5.integration;

  var _React$useState3 = React.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      specs = _React$useState4[0],
      setSpecs = _React$useState4[1];

  var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      connections = _React$useState6[0],
      setConnections = _React$useState6[1];

  function listConnections(integration) {
    // setLoading(true);
    fetch(url + "/api/connection/list?integration=" + integration).then(function (response) {
      return response.json();
    }).then(function (data) {
      setConnections(data.connections);
      // setLoading(false);
    }).catch(function (error) {
      console.log(error);
      // setLoading(false);
    });
  }

  React.useEffect(function () {
    listConnections(integration.key);
  }, []);

  function _deleteConnection(id) {
    setLoading(true);
    fetch(url + "/api/connection/delete", {
      method: "POST",
      body: JSON.stringify({
        id: id
      })
    }).then(function () {
      listConnections();
    });
  }

  function _getSpec(connection) {
    setLoading(true);
    fetch(url + "/api/connection/spec", {
      method: "POST",
      body: JSON.stringify({
        id: connection.id
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      setSpecs(data.items);
      setContentType({
        type: "specs",
        connection: connection.title,
        name: contentType.name
      });
      setLoading(false);
    });
  }

  return React.createElement(
    "div",
    { className: "d-flex flex-column" },
    React.createElement(
      "div",
      { className: "float-right d-flex justify-content-end" },
      React.createElement(
        "a",
        {
          href: "howdy?integration=" + integration.key,
          type: "button",
          className: "btn btn-success"
        },
        "NEW CONNECTION"
      )
    ),
    React.createElement(
      "div",
      { className: "mt-3" },
      React.createElement(
        "ul",
        { className: "list-group d-flex" },
        connections.map(function (connection) {
          return React.createElement(Connection, {
            key: connection.id,
            title: connection.title,
            getSpec: function getSpec() {
              return _getSpec(connection);
            },
            deleteConnection: function deleteConnection() {
              return _deleteConnection(connection.id);
            }
          });
        })
      )
    )
  );
};

var ModalBody = function ModalBody(_ref6) {
  var isLoading = _ref6.isLoading,
      setLoading = _ref6.setLoading,
      contentType = _ref6.contentType,
      setContentType = _ref6.setContentType,
      addSong = _ref6.addSong,
      removeSong = _ref6.removeSong,
      integrations = _ref6.integrations;

  if (isLoading) {
    return React.createElement(
      "div",
      { className: "loader" },
      "Loading"
    );
  } else if (contentType.type === "integrations") {
    return React.createElement(
      "div",
      { className: "row m-1" },
      integrations.map(function (integration) {
        return React.createElement(
          "div",
          {
            key: integration.key,
            className: "card col m-1 p-1",
            style: { cursor: "pointer" },
            onClick: function onClick() {
              return setContentType({ type: "connections", integration: integration });
            }
          },
          integration.name
        );
      })
    );
  } else if (contentType.type === "connections") {
    return React.createElement(ConnectionsContainer, {
      contentType: contentType,
      setContentType: setContentType,
      setLoading: setLoading
    });
  } else if (contentType.type === "specs") {
    return React.createElement(
      "ul",
      { className: "list-group d-flex h-100", style: { overflowY: "auto" } },
      specs.map(function (spec) {
        return React.createElement(Spec, {
          key: spec.id,
          spec: spec,
          addSong: addSong,
          removeSong: removeSong
        });
      })
    );
  }
};

var ModalContainer = function ModalContainer() {
  var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      isLoading = _React$useState8[0],
      setLoading = _React$useState8[1];

  var _React$useState9 = React.useState({
    type: "integrations"
  }),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      contentType = _React$useState10[0],
      setContentType = _React$useState10[1];

  var _React$useState11 = React.useState([]),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      songs = _React$useState12[0],
      setSongs = _React$useState12[1];

  var _React$useState13 = React.useState([]),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      integrations = _React$useState14[0],
      setIntegrations = _React$useState14[1];

  React.useEffect(function () {
    listIntegrations();
  }, []);

  function addSong(song) {
    var prevSongs = songs;
    prevSongs.push(song);
    setSongs(prevSongs);
  }

  function removeSong(song) {
    var prevSongs = songs;
    var updatedSongs = prevSongs.filter(function (item) {
      return item.id !== song.id;
    });
    setSongs(updatedSongs);
  }

  function submitSongs() {
    setLoading(true);
    console.log(songs);
    fetch(url + "/api/song/create", {
      method: "POST",
      body: JSON.stringify({
        songs: songs
      })
    }).then(function () {
      $("#connectionModal").modal("hide");
    });
  }

  function listIntegrations() {
    fetch(url + "/api/integrations").then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      setIntegrations(data.integrations);
    });
  }

  return React.createElement(
    "div",
    { className: "modal-content" },
    React.createElement(
      "div",
      { className: "modal-header" },
      React.createElement(
        "h6",
        { className: "modal-title", id: "exampleModalLongTitle" },
        React.createElement(BreadCrumb, {
          contentType: contentType,
          setContentType: setContentType
        })
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "close",
          "data-dismiss": "modal",
          "aria-label": "Close"
        },
        React.createElement(
          "span",
          { "aria-hidden": "true" },
          "\xD7"
        )
      )
    ),
    React.createElement(
      "div",
      { className: "modal-body" },
      React.createElement(ModalBody, {
        integrations: integrations,
        isLoading: isLoading,
        setLoading: setLoading,
        contentType: contentType,
        setContentType: setContentType,
        addSong: addSong,
        removeSong: removeSong
      })
    ),
    React.createElement(
      "div",
      { className: "modal-footer" },
      React.createElement(
        "button",
        { type: "button", className: "btn btn-light", "data-dismiss": "modal" },
        "CLOSE"
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "btn btn-success",
          disabled: isLoading,
          onClick: submitSongs
        },
        contentType.type === "specs" ? "SUBMIT" : "NEXT"
      )
    )
  );
};

var domContainer = document.querySelector("#connection_modal_content");
ReactDOM.render(React.createElement(ModalContainer, null), domContainer);