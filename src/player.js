"use strict";

const PlayerContainer = ({ url, title }) => {
  const [playing, setPlaying] = React.useState();
  const [player, setPlayer] = React.useState(false);
  const [sound, setSound] = React.useState();
  let seek;

  function setUpSoundSystem() {
    let instance = new Howl({
      src: [
        url,
        // "https://drive.google.com/file/d/1ZVapsTWLOPcHFMeJd3SZM76gynYCs8SW/view?usp=drivesdk",
        // "https://drive.google.com/file/d/1ZVapsTWLOPcHFMeJd3SZM76gynYCs8SW/preview?usp=drivesdk",
        // "https://kannadasongsdownload.info/2017-Kannadamasti.Info/Chakravarthy/Ondu%20Malebillu%20(Kannadamasti.info).mp3",
      ],
      html5: true,
      buffer: true,
      autoplay: false,
    });
    setSound(instance);
  }

  React.useEffect(() => {
    setUpSoundSystem();
  }, []);

  function togglePlay() {
    if (!player) {
      const id = sound.play();
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
    return (
      <button className="mdc-fab mdc-fab--extended" onClick={togglePlay}>
        <div className="mdc-fab__ripple"></div>
        <span className="material-icons mdc-fab__icon">pause</span>
        <span className="mdc-fab__label">{title}</span>
      </button>
    );
  }
  return (
    <button className="mdc-fab mdc-fab--extended" onClick={togglePlay}>
      <div className="mdc-fab__ripple"></div>
      <span className="material-icons mdc-fab__icon">play_arrow</span>
      <span className="mdc-fab__label">{title}</span>
    </button>
  );
};

function play(title, url) {
  console.log(title, url);
  let domContainer = document.querySelector("#playerBar");
  ReactDOM.render(<PlayerContainer url={url} title={title} />, domContainer);
}
