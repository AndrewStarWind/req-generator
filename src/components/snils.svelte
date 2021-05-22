<script>
   import { generate } from "../utils/generateSnils";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import IconButton from "@smui/icon-button";

   let value = "";
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="СНИЛС" />
   <div class="form-group__actions">
      <IconButton
         class="material-icons"
         title="Generate"
         on:click={() => (value = generate())}
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
   </div>
</div>
