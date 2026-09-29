# Svelte Example Documentation

## Overview

This document outlines the setup and structure of Svelte Example. This apps are using :
* Vuexy 10.11.1 as main template
* Svelte 5 as main framework

## System Requirements

* Node Js 24.0 or higher

## Installation Steps

* Clone the project and move to project directory

```bash
https://github.com/Pepeqi-Esport/svelte-example.git
```

* Install dependencies

```bash
bun install
```

* Decrypt the env with your own key

```bash
bun env:decrypt --key=your-own-key
```

* Decrypt the production env with your own key

```bash
bun env:decrypt --key=your-own-key --env=production
```

* Build Application

```bash
bun run build
```

* Run Application in Development

```bash
bun dev
```

* Run Application in Production

```bash
pm2 start ecosystem.config.cjs
```

## Contributing

Contributions to the Svelte Example project are welcome.

## License

This Svelte Example is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
