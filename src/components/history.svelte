<script>
   import IconButton from "@smui/icon-button";
   import Button, { Label } from "@smui/button";
   import Dialog, {
      Title as DialogTitle,
      Content,
      Actions,
   } from "@smui/dialog";
   import Store from "../utils/Store";

   export let reqId;
   export let label;

   let dialog;
   let data;

   const openDialog = () => {
      dialog.setOpen(true);
      data = Store.getHistory(reqId);
   };
</script>

<Dialog
   bind:this={dialog}
   aria-labelledby="dialog-title"
   aria-describedby="dialog-content"
>
   <DialogTitle id="dialog-title">История генерации {label}</DialogTitle>
   <Content id="dialog-content">
      {#if data && data.length}
         <div class="history">
            {#each data as item}
               <p>{item}</p>
            {/each}
         </div>
      {:else}
         История пуста
      {/if}
   </Content>
   <Actions>
      <Button on:click={() => dialog.setOpen(false)}>
         <Label>Ok</Label>
      </Button>
      <Button on:click={() => Store.clearHistory(reqId)}>
         <Label>Очистить историю</Label>
      </Button>
   </Actions>
</Dialog>
<IconButton
   class="material-icons"
   on:click={openDialog}
   aria-label="OpenHistory"
>
   history
</IconButton>
