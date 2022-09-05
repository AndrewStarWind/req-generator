<script>
   import { generate as generateKPP } from "../utils/generateKpp";
   import { KPP_TYPES } from "../utils/constants";
   import { copyTextToClipboard } from "../utils/copyToClipboard";
   import Textfield from "@smui/textfield";
   import IconButton from "@smui/icon-button";
   import Select, { Option } from "@smui/select";
   import Store from "../utils/Store";
   import History from "./history.svelte";

   let types = [
      { id: KPP_TYPES.registration, text: "По месту регистрации" },
      { id: KPP_TYPES.bigTaxPayer, text: "Крупнейший налогоплательщик" },
      { id: KPP_TYPES.envd, text: "ЕНВД" },
      { id: KPP_TYPES.branch, text: "КПП филиала" },
   ];
   let type = "01";
   let value = Store.getValue("KPP");

   export const generate = () => (value = generateKPP(type));
   const generateAndCopy = () => {
      const generatedValue = generate();

      copyTextToClipboard(generatedValue);
      return generatedValue;
   };
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="КПП:" />
   <Select bind:value={type} label="ТИП/КФХ:" class="select">
      {#each types as item}
         <Option value={item.id} title={item.text}>
            <div class="select__item">
               <span>
                  {item.text}
               </span>
            </div>
         </Option>
      {/each}
   </Select>
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
      <History label="КПП" reqId="KPP" />
   </div>
</div>
