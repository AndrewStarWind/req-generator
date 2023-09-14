<script>
    import { generate as generateInn } from "../utils/generateINNUZ";
    import { copyTextToClipboard } from "../utils/copyToClipboard";
    import Textfield from "@smui/textfield";
    import IconButton from "@smui/icon-button";
    import Store from "../utils/Store";
    import History from "./history.svelte";

    export let isIE;

    let value = Store.getValue(isIE ? "INNUZIE" : "INNUZ");

    export const generate = () => value = generateInn(isIE)
    const generateAndCopy = () => {
       const generatedValue = generate()

       copyTextToClipboard(generatedValue)
       return generatedValue
    }
 </script>

 <div class="form-group">
    <Textfield type="text" bind:value label="{isIE ? "ИНН ИП" : "ИНН"}:" />

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
       <History label={isIE ? "ИНН ИП" : "ИНН"} reqId={isIE ? "INNUZIE" : "INNUZ"} />
    </div>
 </div>
