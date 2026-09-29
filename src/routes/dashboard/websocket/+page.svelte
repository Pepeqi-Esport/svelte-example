<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Centrifuge } from "centrifuge";

  import { cardAnimate } from "$lib/utils/animate";

  let host = import.meta.env.VITE_CENTRIFUGO_HOST;
  let channel = import.meta.env.VITE_CENTRIFUGO_CHANNEL;
  let clientKey = import.meta.env.VITE_CENTRIFUGO_CLIENT_KEY;

  let centrifuge: Centrifuge | null = null;

  let websocketUrl = `wss://${host}/connection/websocket`;

  onMount(() => {
    let jQuery = window.jQuery;

    centrifuge = new Centrifuge(websocketUrl, {
      token: clientKey,
    });

    centrifuge
      .on("connecting", function (ctx) {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on("connected", function (ctx) {
        console.log(`connected over ${ctx.transport}`);
      })
      .on("disconnected", function (ctx) {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
      })
      .connect();

    let sub = centrifuge.newSubscription(channel);

    sub
      .on("publication", function (ctx) {
        console.log(ctx.data);
        jQuery("#message").append(ctx.data.message + "<br>");
      })
      .on("subscribing", function (ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
      })
      .on("subscribed", function (ctx) {
        console.log("subscribed", ctx);
      })
      .on("unsubscribed", function (ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
      })
      .subscribe();
  });

  onDestroy(() => {
    centrifuge?.disconnect();
  });
</script>

<div class="row">
  <div class="col-xl">
    <div class="card {cardAnimate}">
      <div class="card-body">
        <h5 class="card-title">Pesan Realtime Websocket</h5>

        <div id="message"></div>
      </div>
    </div>
  </div>
</div>
