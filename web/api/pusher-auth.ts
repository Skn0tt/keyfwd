import Pusher from "pusher";
import * as uuid from "uuid";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function (req, res) {
  const { socket_id, channel_name } = req.body;
  const auth = pusher.authenticate(socket_id, channel_name, {
    user_id: uuid.v4(),
  });
  res.send(auth);
}
