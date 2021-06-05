<script>
   import { generate } from "../utils/generateUnp";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import IconButton from "@smui/icon-button";
   import Store from "../utils/Store";
   import History from "./history.svelte";

   export let isIE;
   let value = Store.getValue(isIE ? "UNPIE" : "UNP");
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="УНП{isIE ? ' ИП' : ''}:" />
   <div class="form-group__actions">
      <IconButton
         class="material-icons"
         title="Generate"
         on:click={() => (value = generate(isIE))}
      >
         play_circle_outline
      </IconButton>
      <IconButton
         class="material-icons"
         title="Copy"
         on:click={() => copyTextToClipboard(value)}
      >
         content_copy
      </IconButton>
      <History label={isIE ? "УНП ИП" : "УНП"} reqId={isIE ? "UNPIE" : "UNP"} />
   </div>
</div>
