<script>
   import { generateIin, generateBin } from "../utils/generateIinBin";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import Checkbox from "@smui/checkbox";
   import FormField from "@smui/form-field";
   import IconButton from "@smui/icon-button";
   import Select, { Option } from "@smui/select";

   let isIE = false;
   let ids = [
      { id: 3, text: "male XX" },
      { id: 4, text: "female XX" },
      { id: 5, text: "male XXI" },
      { id: 6, text: "female XXI" },
   ];
   let id = 3;
   let value = "";
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="{isIE ? 'ИИН' : 'БИН'}:" />
   <FormField>
      <Checkbox bind:checked={isIE} />
      <span slot="label">ИП</span>
   </FormField>

   {#if isIE}
      <Select bind:value={id} label="Пол:" class="select">
         <Option value="" />
         {#each ids as item}
            <Option value={item.id}>{item.text}</Option>
         {/each}
      </Select>
   {/if}

   <div class="form-group__actions">
      <IconButton
         class="material-icons"
         title="Generate"
         on:click={() => (value = isIE ? generateIin(id) : generateBin())}
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
