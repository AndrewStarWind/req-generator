<script>
   import { generate } from "../utils/generateOkpo";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import IconButton from "@smui/icon-button";
   import Store from "../utils/Store";
   import History from "./history.svelte";

   export let isIE;
   let value = Store.getValue(isIE ? "OKPOIE" : "OKPO");
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="ОКПО{isIE ? ' ИП' : ''}:" />
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
      <History
         label={isIE ? "ОКПО ИП" : "ОКПО"}
         reqId={isIE ? "OKPOIE" : "OKPO"}
      />
   </div>
</div>
