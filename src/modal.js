"use strict";

var url = document.head.querySelector("meta[name=url]").content;
//   .content.replace(/^http:/, "https:");

const Connection = ({ title, deleteConnection, getSpec }) => {
  return (
    <li className="list-group-item bg-light d-flex justify-content-between align-items-center m-1 connection-item">
      <div onClick={getSpec}>{title}</div>
      <img
        src="/static/icons/svg/trash.svg"
        height="12px"
        width="12px"
        className="icon"
        alt="delete"
        onClick={deleteConnection}
      />
    </li>
  );
};

const Spec = ({ spec, addSong, removeSong }) => {
  const [selected, setSelected] = React.useState(false);

  function selectSong() {
    setSelected(true);
    addSong(spec);
  }

  function undo() {
    setSelected(false);
    removeSong(spec);
  }
  if (selected) {
    return (
      <li
        className="list-group-item d-flex justify-content-between align-items-center m-1 active song-item"
        onClick={undo}
      >
        <div>{spec.title}</div>
        {/* <img src="/static/open-iconic/svg/trash.svg" height="12px" width="12px" className="icon"
                alt="delete" onClick={deleteConnection} /> */}
      </li>
    );
  }
  return (
    <li
      className="list-group-item bg-light d-flex justify-content-between align-items-center m-1 song-item"
      onClick={selectSong}
    >
      <div>{spec.title}</div>
      {/* <img src="/static/open-iconic/svg/trash.svg" height="12px" width="12px" className="icon"
                alt="delete" onClick={deleteConnection} /> */}
    </li>
  );
};

const BreadCrumb = ({ contentType, setContentType }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb bg-white mb-0 p-0">
        <li
          className={
            contentType.integration
              ? "breadcrumb-item"
              : "breadcrumb-item active"
          }
        >
          <a
            style={{ cursor: "pointer" }}
            onClick={() => setContentType({ type: "integrations" })}
          >
            Integrations
          </a>
        </li>
        {contentType.integration ? (
          <li
            className={
              contentType.connection
                ? "breadcrumb-item"
                : "breadcrumb-item active"
            }
          >
            <a
              style={{ cursor: "pointer" }}
              onClick={() => setContentType({ type: "connection" })}
            >
              {contentType.integration.name}
            </a>
          </li>
        ) : (
          false
        )}
        {contentType.type === "specs" ? (
          <li className="breadcrumb-item active" aria-current="page">
            {contentType.connection}
          </li>
        ) : (
          false
        )}
      </ol>
    </nav>
  );
};

const ConnectionsContainer = ({ contentType, setContentType, setLoading }) => {
  if (contentType.integration.type === "OAUTH") {
    return (
      <OAuth
        setLoading={setLoading}
        setContentType={setContentType}
        integration={contentType.integration}
      />
    );
  }
  return <div>No Connections</div>;
};

const OAuth = ({ setLoading, setContentType, integration }) => {
  const [specs, setSpecs] = React.useState([]);

  const [connections, setConnections] = React.useState([]);

  function listConnections(integration) {
    // setLoading(true);
    fetch(`${url}/api/connection/list?integration=${integration}`)
      .then((response) => response.json())
      .then((data) => {
        setConnections(data.connections);
        // setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setLoading(false);
      });
  }

  React.useEffect(() => {
    listConnections(integration.key);
  }, []);

  function deleteConnection(id) {
    setLoading(true);
    fetch(`${url}/api/connection/delete`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    }).then(() => {
      listConnections();
    });
  }

  function getSpec(connection) {
    setLoading(true);
    fetch(`${url}/api/connection/spec`, {
      method: "POST",
      body: JSON.stringify({
        id: connection.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSpecs(data.items);
        setContentType({
          type: "specs",
          connection: connection.title,
          name: contentType.name,
        });
        setLoading(false);
      });
  }

  return (
    <div className="d-flex flex-column">
      <div className="float-right d-flex justify-content-end">
        <a
          href={`howdy?integration=${integration.key}`}
          type="button"
          className="btn btn-success"
        >
          NEW CONNECTION
        </a>
      </div>
      <div className="mt-3">
        <ul className="list-group d-flex">
          {connections.map((connection) => (
            <Connection
              key={connection.id}
              title={connection.title}
              getSpec={() => getSpec(connection)}
              deleteConnection={() => deleteConnection(connection.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const ModalBody = ({
  isLoading,
  setLoading,
  contentType,
  setContentType,
  addSong,
  removeSong,
  integrations,
}) => {
  if (isLoading) {
    return <div className="loader">Loading</div>;
  } else if (contentType.type === "integrations") {
    return (
      <div className="row m-1">
        {integrations.map((integration) => (
          <div
            key={integration.key}
            className="card col m-1 p-1"
            style={{ cursor: "pointer" }}
            onClick={() =>
              setContentType({ type: "connections", integration: integration })
            }
          >
            {integration.name}
          </div>
        ))}
      </div>
    );
  } else if (contentType.type === "connections") {
    return (
      <ConnectionsContainer
        contentType={contentType}
        setContentType={setContentType}
        setLoading={setLoading}
      />
    );
  } else if (contentType.type === "specs") {
    return (
      <ul className="list-group d-flex h-100" style={{ overflowY: "auto" }}>
        {specs.map((spec) => (
          <Spec
            key={spec.id}
            spec={spec}
            addSong={addSong}
            removeSong={removeSong}
          />
        ))}
      </ul>
    );
  }
};

const ModalContainer = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [contentType, setContentType] = React.useState({
    type: "integrations",
  });
  const [songs, setSongs] = React.useState([]);
  const [integrations, setIntegrations] = React.useState([]);

  React.useEffect(() => {
    listIntegrations();
  }, []);

  function addSong(song) {
    let prevSongs = songs;
    prevSongs.push(song);
    setSongs(prevSongs);
  }

  function removeSong(song) {
    let prevSongs = songs;
    let updatedSongs = prevSongs.filter(function (item) {
      return item.id !== song.id;
    });
    setSongs(updatedSongs);
  }

  function submitSongs() {
    setLoading(true);
    console.log(songs);
    fetch(`${url}/api/song/create`, {
      method: "POST",
      body: JSON.stringify({
        songs: songs,
      }),
    }).then(() => {
      $("#connectionModal").modal("hide");
    });
  }

  function listIntegrations() {
    fetch(`${url}/api/integrations`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIntegrations(data.integrations);
      });
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h6 className="modal-title" id="exampleModalLongTitle">
          <BreadCrumb
            contentType={contentType}
            setContentType={setContentType}
          />
        </h6>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <ModalBody
          integrations={integrations}
          isLoading={isLoading}
          setLoading={setLoading}
          contentType={contentType}
          setContentType={setContentType}
          addSong={addSong}
          removeSong={removeSong}
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-light" data-dismiss="modal">
          CLOSE
        </button>
        <button
          type="button"
          className="btn btn-success"
          disabled={isLoading}
          onClick={submitSongs}
        >
          {contentType.type === "specs" ? "SUBMIT" : "NEXT"}
        </button>
      </div>
    </div>
  );
};

let domContainer = document.querySelector("#connection_modal_content");
ReactDOM.render(<ModalContainer />, domContainer);
