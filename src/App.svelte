<script>
	import Header from "./components/header.svelte";
	import OKPO from "./components/okpo.svelte";
	import SNILS from "./components/snils.svelte";
	import INN from "./components/inn.svelte";
	import IIN from "./components/iin.svelte";
	import UNP from "./components/unp.svelte";
	import OGRN from "./components/ogrn.svelte";
	import KPP from "./components/kpp.svelte";
	import UUID from "./components/uuid.svelte"
	import GLN from "./components/gln.svelte"
	import INNUZ from "./components/innuz.svelte"

	import Store from "./utils/Store";

	import Tab, { Label } from "@smui/tab";
	import TabBar from "@smui/tab-bar";
	const tabs = ["RU ЮЛ", "RU ИП", "BY", "KZ", "UZ", "Other"];
	let active = tabs[0];
	let isLoaded = false;
	let callbacks = [];

	const onGenerateAll = () => {
		callbacks.forEach(f => f())
	}

	Store.init().then(() => {
		isLoaded = true;
	});
</script>

{#if isLoaded}
	<div class="container">
		<Header on:generateAll={ () => onGenerateAll() } />
		<TabBar tabs={tabs} let:tab bind:active>
			<Tab {tab} minWidth>
				<Label>{tab}</Label>
			</Tab>
		</TabBar>
		<main class="content">
			{#if active === tabs[0]}
				<INN isIE={false} bind:generate={callbacks[0]}/>
				<KPP bind:generate={callbacks[1]} />
				<OKPO isIE={false} bind:generate={callbacks[2]} />
				<OGRN isIE={false} bind:generate={callbacks[3]} />
				<GLN bind:generate={callbacks[4]} />
			{/if}
			{#if active === tabs[1]}
				<INN isIE={true} bind:generate={callbacks[0]} />
				<SNILS bind:generate={callbacks[1]} />
				<OKPO bind:generate={callbacks[2]} isIE={true} />
				<OGRN bind:generate={callbacks[3]} isIE={true} />
				<GLN bind:generate={callbacks[4]} />
			{/if}
			{#if active === tabs[2]}
				<UNP bind:generate={callbacks[0]} isIE={false} />
				<UNP bind:generate={callbacks[1]} isIE={true} />
				<GLN bind:generate={callbacks[2]} />
			{/if}
			{#if active === tabs[3]}
				<IIN bind:generate={callbacks[0]} isIE={false} />
				<IIN bind:generate={callbacks[1]} isIE={true} />
				<GLN bind:generate={callbacks[2]} />
			{/if}
			{#if active === tabs[4]}
				<INNUZ bind:generate={callbacks[0]} isIE={false} />
				<INNUZ bind:generate={callbacks[1]} isIE={true} />
				<GLN bind:generate={callbacks[2]} />
			{/if}
			{#if active === tabs[5]}
				<UUID bind:generate={callbacks[0]} />
				<GLN bind:generate={callbacks[1]} />
			{/if}
			<br />
		</main>
	</div>
{/if}

<style>
</style>
