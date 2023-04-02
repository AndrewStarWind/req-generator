<script>
    import { generate as generateUUID } from "../utils/generateUUID";
    import { copyTextToClipboard } from "../utils/copyToClipboard";
    import Textfield from "@smui/textfield";
    import IconButton from "@smui/icon-button";
    import Store from "../utils/Store";
    import History from "./history.svelte";

    let value = Store.getValue("UUID");

    export const generate = () => value = generateUUID()
    const generateAndCopy = () => {
       const generatedValue = generate()

       copyTextToClipboard(generatedValue)
       return generatedValue
    }
 </script>

 <div class="form-group">
    <Textfield type="text" bind:value label="UUID:" />
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
       <History label="UUID" reqId="UUID" />
    </div>
 </div>
