var url = document.head
  .querySelector("meta[name=url]")
  .content.replace(/^http:/, "https:");
let sound;

const PlayerContainer = ({ url, title }) => {
  const [playing, setPlaying] = React.useState(false);
  const [player, setPlayer] = React.useState(null);
  let seek;

  React.useEffect(() => {
    return () => {
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
      });
      let id = sound.play();
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

  return (
    <button
      id="playerBar"
      className="mdc-fab mdc-fab--extended"
      onClick={togglePlay}
    >
      <div className="mdc-fab__ripple"></div>
      {playing ? (
        <span className="material-icons mdc-fab__icon">pause</span>
      ) : (
        <span className="material-icons mdc-fab__icon">play_arrow</span>
      )}
      <span className="mdc-fab__label" style={{ fontSize: "12px" }}>
        {title}
      </span>
    </button>
  );
};

const AlertDialog = ({ id, title }) => {
  React.useEffect(() => {
    var dialog = new mdc.dialog.MDCDialog(
      document.querySelector(".mdc-dialog")
    );
    dialog.open();
    return () => {
      dialog.close();
    };
  }, [id]);

  function deleteSong() {
    console.log("delete song", id);
    fetch(`${url}/api/song/delete`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    });
  }

  return (
    <div className="mdc-dialog">
      <div className="mdc-dialog__container">
        <div
          className="mdc-dialog__surface"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="my-dialog-title"
          aria-describedby="my-dialog-content"
        >
          <h2 className="mdc-dialog__title" id="my-dialog-title">
            DELETE ALERT
          </h2>
          <div className="mdc-dialog__content" id="my-dialog-content">
            {`Are you sure you want to delete ${title}?`}
          </div>
          <footer className="mdc-dialog__actions">
            <button
              type="button"
              className="btn btn-success col m-1"
              data-mdc-dialog-action="no"
            >
              CANCEL
            </button>
            <button
              type="button"
              className="btn btn-danger col m-1"
              onClick={deleteSong}
              data-mdc-dialog-action="yes"
            >
              DELETE
            </button>
          </footer>
        </div>
      </div>
      <div className="mdc-dialog__scrim"></div>
    </div>
  );
};

const Library = () => {
  const [songs, setSongs] = React.useState([]);
  const [active, setActive] = React.useState();
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    fetch(`${url}/api/song/list`)
      .then((resposne) => resposne.json())
      .then((songs) => setSongs(songs.songs));
  }, []);

  function deleteAlert(song) {
    setVisible({
      id: song.id,
      title: song.title,
    });
  }

  return (
    <div className="m-2 w-100 overflow-hidden">
      {visible ? <AlertDialog id={visible.id} title={visible.title} /> : false}
      <ul className="mdc-list">
        {songs.map((song) => (
          <li
            key={song.id}
            className={`mdc-list-item list-song row ${
              active === song ? "mdc-list-item--selected" : "bg-white"
            }`}
            onClick={() => setActive(song)}
          >
            <span className="mdc-list-item__text col">{song.title}</span>
            <span
              onClick={() => deleteAlert(song)}
              className="mdc-list-item__meta material-icons icon col-auto"
              aria-hidden="true"
            >
              delete_outlined
            </span>
          </li>
        ))}
      </ul>
      {active ? (
        <PlayerContainer title={active.title} url={active.source} />
      ) : (
        false
      )}
    </div>
  );
};

let domContainer = document.querySelector("#library");
ReactDOM.render(<Library />, domContainer);
