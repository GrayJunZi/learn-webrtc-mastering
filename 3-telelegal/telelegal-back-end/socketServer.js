// 创建 socket 服务

const { io, app, linkSecret } = require("./server");
const jwt = require("jsonwebtoken");

// const professionalAppointments = app.get("professionalAppointments");

const connectedProfessionals = [];

const allKnownOffers = [
  // uniqueId
  // offer
  // professionalsFullName
  // clientName
  // apptDate
  // offererIceCandidates
  // answer
  // answerIceCandidates
];

// 客户端已连接
io.on("connection", (socket) => {
  console.log(socket.id, "has connected");

  const handshakeData = socket.handshake.auth.jwt;
  let decodedData;
  try {
    decodedData = jwt.verify(handshakeData, linkSecret);
  } catch (err) {
    console.log(err);
    socket.disconnect();
    return;
  }
  const { fullName, proId } = decodedData;
  if (proId) {
    const connectedPro = connectedProfessionals.find((x) => x.proId === proId);
    if (connectedPro) {
      connectedPro.socketId = socket.id;
    } else {
      connectedProfessionals.push({
        socketId: socket.id,
        fullName,
      });
    }

    const professionalAppointments = app.get("professionalAppointments");
    socket.emit(
      "apptData",
      professionalAppointments.filter(
        (x) => x.professionalsFullName === fullName
      )
    );

    for (const offer of allKnownOffers) {
      if (offer.professionalsFullName === fullName) {
        io.to(socket.id).emit("newOfferWaiting", offer);
      }
    }
  }
  socket.on("newOffer", ({ offer, apptInfo }) => {
    allKnownOffers[apptInfo.uuid] = {
      ...apptInfo,
      offer,
      offerIceCandidates: [],
      answer: null,
      answerIceCandidates: [],
    };

    const professionalAppointments = app.get("professionalAppointments");
    const pa = professionalAppointments.find((x) => x.uuid === apptInfo.uuid);
    if (pa) {
      pa.waiting = true;
    }

    const p = connectedProfessionals.find(
      (x) => x.fullName === apptInfo.professionalsFullName
    );
    if (p) {
      const socketId = p.socketId;
      socket
        .to(socketId)
        .emit("newOfferWaiting", allKnownOffers[apptInfo.uuid]);

      socket.to(socketId).emit(
        "apptData",
        professionalAppointments.filter(
          (x) => x.professionalsFullName === apptInfo.professionalsFullName
        )
      );
    }
  });
});
