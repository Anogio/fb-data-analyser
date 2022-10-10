# fb-data-analyser
## Overview

This is meant as a tool that can parse and analyse your Facebook conversation data 
(as provided by Facebook as part as their data extract).

This is 100% client-side so that no data is sent to a server (once the page is loaded it 
can be used without network if you want to be sure)

There is a file in the `examples` folder with minimal data and a few conversations that can serve as a demo.

## To do (unprioritized)
- Clarify presentation text to specify you need a JSON and you should get the Messenger and Profile data at least
- Make the Analytics view tabbed to enable the display of different analytics
- Full text search tab to search in all conversations
- Provide SQLite advanced tab to make custom queries and graphs
- Add detailed conversation view (for a group chat or DM) -> show a time graph of messages sent/received over time, show who sent how many messages. Have a selector for the conversation, and optionally link to it when clicking on the general graph
- Include reacts in the detailed view
- Stats on reacts (it's important to know who actually likes you)
- Include images in the detailed view
- Improve visuals (especially graph sizing, color and reactivity)
- Integrate other chat extracts (starting with Whatsapp)


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
