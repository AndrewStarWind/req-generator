<script>
	import Header from "./components/header.svelte";
	import OKPO from "./components/okpo.svelte";
	import SNILS from "./components/snils.svelte";
	import INN from "./components/inn.svelte";
	import IIN from "./components/iin.svelte";
	import UNP from "./components/unp.svelte";
	import OGRN from "./components/ogrn.svelte";
	import KPP from "./components/kpp.svelte";

	import Store from "./utils/Store";

	import Tab, { Label } from "@smui/tab";
	import TabBar from "@smui/tab-bar";
	let active = "РФ ЮЛ";
	let isLoaded = false;
	let callbacks = [];

	const onGenerateAll = () => {
		callbacks.forEach(f => f())
		console.log(111);
	}

	Store.init().then(() => {
		isLoaded = true;
	});
</script>

{#if isLoaded}
	<div class="container">
		<Header on:generateAll={ () => onGenerateAll() } />
		<TabBar tabs={["РФ ЮЛ", "РФ ИП", "Беларусь", "Казахстан"]} let:tab bind:active>
			<Tab {tab} minWidth>
				<Label>{tab}</Label>
			</Tab>
		</TabBar>
		<main class="content">
			{#if active === "РФ ЮЛ"}
				<INN isIE={false} bind:generate={callbacks[0]}/>
				<KPP bind:generate={callbacks[1]} />
				<OKPO isIE={false} bind:generate={callbacks[2]} />
				<OGRN isIE={false} bind:generate={callbacks[3]} />
			{/if}
			{#if active === "РФ ИП"}
				<INN isIE={true} bind:generate={callbacks[0]} />
				<SNILS bind:generate={callbacks[1]} />
				<OKPO bind:generate={callbacks[2]} isIE={true} />
				<OGRN bind:generate={callbacks[3]} isIE={true} />
			{/if}
			{#if active === "Беларусь"}
				<UNP bind:generate={callbacks[0]} isIE={false} />
				<UNP bind:generate={callbacks[1]} isIE={true} />
			{/if}
			{#if active === "Казахстан"}
				<IIN bind:generate={callbacks[0]} isIE={false} />
				<IIN bind:generate={callbacks[1]} isIE={true} />
			{/if}
			<br />
		</main>
	</div>
{/if}

<style>
</style>
