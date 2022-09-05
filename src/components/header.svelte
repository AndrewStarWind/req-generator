<script>
   import { createEventDispatcher } from "svelte";
   import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
   import IconButton from "@smui/icon-button";
   import Button, { Label } from "@smui/button";
   import Dialog, {
      Title as DialogTitle,
      Content,
      Actions,
   } from "@smui/dialog";

   let dialog;

   const dispatch = createEventDispatcher();

   const openOtherWindow = () => {
      const url = chrome.runtime.getURL("index.html");
      const target = "_blank";
      const features = "top=100,left=100,width=615,height=650,popup=true";

      window.open(url, target, features);
   };
</script>

<Dialog
   bind:this={dialog}
   aria-labelledby="dialog-title"
   aria-describedby="dialog-content"
>
   <DialogTitle id="dialog-title">О приложении</DialogTitle>
   <Content id="dialog-content">
      <p>Приложение генерирует основные реквизиты компаний.</p>
      <p>
         Contact me on <a target="_blank" href="https://t.me/sevasdreas"
            >Telegram</a
         >
      </p>
      <a target="_blank" href="https://github.com/AndrewStarWind/req-generator"
         >GitHub</a
      >
      <p>ЮMoney (RUR): 410011464431934</p>
   </Content>
   <Actions>
      <Button on:click={() => dialog.setOpen(false)}>
         <Label>OK</Label>
      </Button>
   </Actions>
</Dialog>
<TopAppBar variant="static" color="secondary">
   <Row>
      <Section class="header__title">
         <Title>Requisites Generator</Title>
      </Section>
      <Section align="end">
         <IconButton
            class="material-icons"
            title="Generate"
            on:click={() => dispatch("generateAll", {})}
         >
            play_circle_outline
         </IconButton>
         <IconButton
            class="material-icons"
            on:click={openOtherWindow}
            aria-label="Open in new window"
         >
            open_in_new
         </IconButton>
         <IconButton
            class="material-icons"
            on:click={() => dialog.setOpen(true)}
            aria-label="About"
         >
            info
         </IconButton>
      </Section>
   </Row>
</TopAppBar>
