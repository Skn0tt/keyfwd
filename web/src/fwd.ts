import Pusher from "pusher-js";

const pusher = new Pusher("49c48c1a457d91067cb7", {
  cluster: "eu",
  authEndpoint: "/api/pusher-auth",
});

const channelName = location.pathname.slice(1);

document.getElementById("channelName").innerText = channelName;

const channel = pusher.subscribe(`presence-${channelName}`);

const connectionState = document.getElementById("connectionState");

function getMemberCount(): number {
  return (channel as any).members.count;
}

channel.bind("pusher:subscription_succeeded", () => {
  if (getMemberCount() < 2) {
    connectionState.innerText = "🤨 Not Found";
    channel.unsubscribe();
    return;
  }

  connectionState.innerText = "✅ Connected";
});

channel.bind("pusher:subscription_error", (error: any) => {
  console.error(error);
  connectionState.innerText = "❌ Connection Failed";
});

channel.bind("pusher:member_removed", () => {
  if (getMemberCount() < 2) {
    connectionState.innerText = "🕺 Session ended.";
  }
});

document.onkeydown = (event) => {
  const button = document.getElementById(event.key);
  if (!button) {
    return;
  }

  button.click();
};

for (const button of document.getElementsByTagName("button")) {
  if (!button.title) {
    continue;
  }

  button.onclick = () => {
    channel.trigger("client-key", button.title);
  };
}
