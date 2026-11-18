## Requisites generator

Генерация и проверка реквизитов: ИНН, КПП, ОКПО, СНИЛС, ОГРН/ОГРНИП, рег. номер СФР, GLN (RU), УНП (BY), ИИН/БИН (KZ), ИНН/ПИНФЛ (UZ), UUID.

Номер, вставленный в поле любого реквизита, проверяется: контрольная сумма, структура и расшифровка (регион, дата рождения, пол и т. п.).

[Link](https://req-generator-andrewstarwind.vercel.app/)


## Development

Стек: React 19, TypeScript, Vite, Chakra UI 3 (базовые компоненты), Tailwind CSS 4 (раскладка), Zustand.

```bash
npm i
npm run dev      # dev-сервер с HMR
npm run lint
npm run typecheck  # проверка типов (tsc)
npm test         # тесты валидаторов и генераторов (Vitest)
npm run build    # сборка в dist/
```

## How to install in Chrome

1. git clone https://github.com/AndrewStarWind/req-generator.git
2. npm i
3. npm run build-ext
4. Откройте `chrome://extensions`, включите «Режим разработчика», нажмите «Загрузить распакованное расширение» и выберите папку `dist`


## Donations
ЮMoney RUR - 410011464431934