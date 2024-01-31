const $video = document.querySelector("#my-video");

// 初始化视频流
let stream = null;
let mediaStream = null;

const constraints = {
  audio: true,
  video: true,
};

const getMicAndCamer = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    getDevices();
    changeButtons([
      "green",
      "blue",
      "blue",
      "blue",
      "blue",
      "grey",
      "grey",
      "blue",
    ]);
  } catch (err) {
    console.log("user denied access to constraints");
    console.log(err);
  }
};

const showMyFeed = (e) => {
  console.log("showMyFeed is working");
  if (!stream) {
    console.log("Stream still loading...");
    return;
  }
  $video.srcObject = stream;
  const tracks = stream.getTracks();
  console.log(tracks);
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "blue",
    "grey",
    "grey",
    "blue",
  ]);
};

const stopMyFeed = (e) => {
  if (!stream) {
    console.log("Stream still loading...");
    return;
  }
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
  changeButtons([
    "blue",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
  ]);
};

document
  .querySelector("#share")
  .addEventListener("click", (e) => getMicAndCamer(e));

document
  .querySelector("#show-video")
  .addEventListener("click", (e) => showMyFeed(e));

document
  .querySelector("#stop-video")
  .addEventListener("click", (e) => stopMyFeed(e));

document
  .querySelector("#change-size")
  .addEventListener("click", (e) => changeVideoSize(e));

document
  .querySelector("#start-record")
  .addEventListener("click", (e) => startRecording(e));

document
  .querySelector("#stop-record")
  .addEventListener("click", (e) => stopRecording(e));

document
  .querySelector("#play-record")
  .addEventListener("click", (e) => playRecording(e));

document
  .querySelector("#share-screen")
  .addEventListener("click", (e) => shareScreen(e));

document
  .querySelector("#audio-input")
  .addEventListener("change", (e) => changeAudioInput(e));
document
  .querySelector("#audio-output")
  .addEventListener("change", (e) => changeAudioOutput(e));
document
  .querySelector("#video-input")
  .addEventListener("change", (e) => changeVideo(e));
