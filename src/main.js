import App from './App.svelte'
import './styles/styles.scss'

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
})

export default app
