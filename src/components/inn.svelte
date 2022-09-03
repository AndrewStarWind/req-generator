<script>
   import { generate as generateINN } from "../utils/generateInn";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Checkbox from "@smui/checkbox";
   import FormField from "@smui/form-field";
   import IconButton from "@smui/icon-button";
   import Textfield from "@smui/textfield";
   import Store from "../utils/Store";
   import History from "./history.svelte";

   export let isIE;
   let isForeign = false;
   let value = Store.getValue(isIE ? "INNIE" : "INN");

   export const generate = () => value = generateINN(isIE, isForeign)
   const generateAndCopy = () => {
      const generatedValue = generate()

      copyTextToClipboard(generatedValue)
      return generatedValue
   }
</script>

<div class="form-group">
   <Textfield
      type="text"
      bind:value
      label="{!isIE ? 'ИНН ЮЛ' : 'ИНН ИП/КФХ'}:"
   />
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
         on:click={generateAndCopy}
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
         label={isIE ? "ИНН" : "ИНН ИП/КФХ"}
         reqId={isIE ? "INNIE" : "INN"}
      />
   </div>
</div>
