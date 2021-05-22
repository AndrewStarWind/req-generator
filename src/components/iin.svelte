<script>
   import { generateIin, generateBin } from "../utils/generateIinBin";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import Checkbox from "@smui/checkbox";
   import FormField from "@smui/form-field";
   import IconButton from "@smui/icon-button";

   let isIE = false;
   let value = "";
</script>

<div class="form-group">
   <Textfield type="text" bind:value label={isIE ? "ИИН" : "БИН"} />
   <FormField>
      <Checkbox bind:checked={isIE} />
      <span slot="label">ИП</span>
   </FormField>
   <div class="form-group__actions">
      <IconButton
         class="material-icons"
         title="Generate"
         on:click={() => (value = isIE ? generateIin() : generateBin())}
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
