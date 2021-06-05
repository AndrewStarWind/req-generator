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
	let active = "РФ";
	let isLoaded = false;

	Store.init().then(() => {
		isLoaded = true;
	});
</script>

{#if isLoaded}
	<div class="container">
		<Header />
		<TabBar tabs={["РФ", "Беларусь", "Казахстан"]} let:tab bind:active>
			<Tab {tab} minWidth>
				<Label>{tab}</Label>
			</Tab>
		</TabBar>
		<main class="content">
			{#if active === "РФ"}
				<INN isIE={false} />
				<INN isIE={true} />
				<KPP />
				<SNILS />
				<OKPO isIE={false} />
				<OKPO isIE={true} />
				<OGRN isIE={false} />
				<OGRN isIE={true} />
			{/if}
			{#if active === "Беларусь"}
				<UNP isIE={false} />
				<UNP isIE={true} />
			{/if}
			{#if active === "Казахстан"}
				<IIN isIE={false} />
				<IIN isIE={true} />
			{/if}
			<br />
		</main>
	</div>
{/if}

<style>
</style>
