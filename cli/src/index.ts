import robot from "robotjs";
import Pusher from "pusher-js";
import Haikunator from "haikunator";
import chalk from "chalk";

const isDevelopment = process.env.NODE_ENV === "development";
const webBaseUrl = isDevelopment
  ? "http://localhost:3000"
  : "https://keyfwd.simonknott.de";

const pusher = new Pusher("49c48c1a457d91067cb7", {
  cluster: "eu",
  authEndpoint: webBaseUrl + "/api/pusher-auth",
});

const channelName = new Haikunator().haikunate({ tokenLength: 0 });

const channel = pusher.subscribe(`presence-${channelName}`);

channel.bind("client-key", (keyCode: string) => {
  robot.keyTap(keyCode);
});

console.log(chalk`Welcome to {blue keyfwd}!`);
console.log(
  chalk`{blue keyfwd} allows you to control your keyboard from any device in the world, e.g. as a remote presenter.`
);

channel.bind("pusher:subscription_succeeded", () => {
  console.log(chalk`Open {blue ${webBaseUrl}/${channelName}} to start.\n`);
});

channel.bind("pusher:subscription_error", (error: any) => {
  console.log("There was an error:");
  console.error(error);
});

channel.bind("pusher:member_added", () => {
  console.log(chalk`Client {green connected}.`);
});

channel.bind("pusher:member_removed", () => {
  console.log(chalk`Client {red disconnected}.`);
});
