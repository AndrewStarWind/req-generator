<script>
   import { generateIin, generateBin } from "../utils/generateIinBin";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import IconButton from "@smui/icon-button";
   import Select, { Option } from "@smui/select";
   import Store from "../utils/Store";
   import History from "./history.svelte";

   export let isIE;
   let ids = [
      { id: 3, text: "male XX" },
      { id: 4, text: "female XX" },
      { id: 5, text: "male XXI" },
      { id: 6, text: "female XXI" },
   ];
   let id = 3;
   let value = Store.getValue(isIE ? "IIN" : "BIN");

   export const generate = () => value = isIE ? generateIin(id || 3) : generateBin()
   const generateAndCopy = () => {
      const generatedValue = generate()

      copyTextToClipboard(generatedValue)
      return generatedValue
   }
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="{isIE ? 'ИИН' : 'БИН'}:" />

   {#if isIE}
      <Select bind:value={id} label="Пол:" class="select" displayEmpty={false}>
         {#each ids as item}
            <Option value={item.id}>{item.text}</Option>
         {/each}
      </Select>
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
      <History label={isIE ? "ИИН" : "БИН"} reqId={isIE ? "IIN" : "BIN"} />
   </div>
</div>
