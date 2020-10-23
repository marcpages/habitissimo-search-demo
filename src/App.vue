<template>
    <div id="app">
        <Search
                query-url="https://cors-anywhere.herokuapp.com/https://www.habitissimo.es/p/api/autocomplete/category"
                query-param="search"
                :query-extra-params="queryExtraParams"
                @itemClick="openItem"
                placeholder="Qué necesitas..."
                label="Encuentra profesionales de confianza"
        ></Search>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Search from './components/Search.vue';
    import {SearchResult} from "@/types/search-result";

    export default Vue.extend({
        name: 'App',
        components: {
            Search,
        },
        data() {
            return {
                queryExtraParams: {
                    limit: 200,
                    tree_level: [1,2]
                }
            }
        },
        methods: {
            openItem(item: SearchResult) {
                this.$emit('itemClick', item);
                window.location.href = 'https://empresas.habitissimo.es/' + item.normalized_name;
            },
        },
    });
</script>

<style lang="scss">
    @import './assets/fonts/montserrat/stylesheet.css';
    @import './assets/fonts/icons/icons.css';

    * {
        font-family: 'Montserrat', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #app {
        display: flex;
        height: 100vh;
        padding-top: 100px;
    }
</style>
