# habitissimo-search-demo

## Descripción

Demo de componente de search para UI kit. Se presupone que todos las API's que use el componente van a usar la misma estructura de respuesta, si no fuera así se debería desacoplar la parte de la request del componente.

### Component params

| Param            | Type   | Default     | Description                           |
|------------------|--------|-------------|---------------------------------------|
| queryUrl         | String | null        | API URL to query                      |
| queryParam       | String | 'search'    | Search query param key                |
| queryExtraParams | Object | {}          | Extra params to add into each request |
| placeholder      | String | 'Buscar...' | Search input placeholder              |
| label            | String | ''          | Input label                           |

## Events

| Event     | Params | Description                   |
|-----------|--------|-------------------------------|
| itemClick | item   | Triggers on result item click |

## Slots

 | Slot        | Available vars | Description                       |
 |-------------|----------------|-----------------------------------|
 | result-item | item           | Template for each result item row |

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Regenerate icons font
```
npm run icons
```
