<script>
	import OKPO from "./components/okpo.svelte";
	import INN from "./components/inn.svelte";
	import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
	import IconButton from "@smui/icon-button";
	import Button, { Label } from "@smui/button";
	import Dialog, {
		Title as DialogTitle,
		Content,
		Actions,
	} from "@smui/dialog";

	let dialog;

	const openOtherWindow = () => {
		chrome.windows.create({
			url: chrome.extension.getURL("index.html"),
			type: "popup",
		});
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
	</Content>
	<Actions>
		<Button on:click={() => dialog.setOpen(false)}>
			<Label>Ok</Label>
		</Button>
	</Actions>
</Dialog>

<main class="content">
	<TopAppBar variant="static" color="secondary">
		<Row>
			<Section class="header__title">
				<Title>Requisites Generator</Title>
			</Section>
			<Section align="end">
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
	<INN />
	<OKPO />
</main>

<style>
</style>
