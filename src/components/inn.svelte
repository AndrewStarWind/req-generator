<script>
   import { generate } from "../utils/generateInn";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import Checkbox from "@smui/checkbox";
   import FormField from "@smui/form-field";
   import IconButton from "@smui/icon-button";

   let isIE = false;
   let isForeign = false;
   let value = "";
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="ИНН:" />
   <FormField>
      <Checkbox bind:checked={isIE} />
      <span slot="label">ИП</span>
   </FormField>
   {#if !isIE}
      <FormField>
         <Checkbox bind:checked={isForeign} />
         <span slot="label">иностранец</span>
      </FormField>
   {/if}
   <div class="form-group__actions">
      <IconButton
         class="material-icons"
         title="Generate"
         on:click={() => (value = generate(isIE, isForeign))}
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
