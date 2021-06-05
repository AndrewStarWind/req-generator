<script>
   import { generate } from "../utils/generateKpp";
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
      { id: KPP_TYPES.branch, text: "кпп филиала" },
   ];
   let type = "01";
   let value = Store.getValue("KPP");
</script>

<div class="form-group">
   <Textfield type="text" bind:value label="КПП:" />
   <Select bind:value={type} label="ТИП/КФХ:" class="select">
      {#each types as item}
         <Option value={item.id}>{item.text}</Option>
      {/each}
   </Select>
   <div class="form-group__actions">
      <IconButton
         class="material-icons"
         title="Generate"
         on:click={() => (value = generate(type))}
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
