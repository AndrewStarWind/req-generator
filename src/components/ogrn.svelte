<script>
   import { generate as generateOGRN } from "../utils/generateOgrn";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import IconButton from "@smui/icon-button";
   import Store from "../utils/Store";
   import History from "./history.svelte";

   export let isIE;
   let value = Store.getValue(isIE ? "OGRNIP" : "OGRN");

   export const generate = () => value = generateOGRN(isIE)
   const generateAndCopy = () => {
      const generatedValue = generate()

      copyTextToClipboard(generatedValue)
      return generatedValue
   }
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="ОГРН{(isIE && 'ИП') || ''}:" />
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
         label={isIE ? "ОГРН" : "ОГРНИП"}
         reqId={isIE ? "OGRNIP" : "OGRN"}
      />
   </div>
</div>
