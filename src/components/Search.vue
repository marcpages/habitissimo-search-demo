<template>
    <div class="search-container">
        <div class="search-label">{{ label }}</div>
        <div class="search-input-container">
            <div class="input-container">
                <input
                        v-model="query"
                        :placeholder="placeholder"
                        @focusin="setFocused(true)"
                        @focusout="setFocused(false)"
                        @keyup.stop="querySearch"
                />
                <i v-show="!searchState === searchStates.Loading" class="icon-search"></i>
                <img v-show="searchState === searchStates.Loading" src="../assets/images/loader.svg"/>
            </div>
            <ul class="results" :class="{'show': isFocused}">
                <li v-if="searchState === searchStates.NoResults" class="message no-results">No hay resultados</li>
                <li v-if="searchState === searchStates.Error" class="message error">No se han podido cargar los resultados. Por
                    favor, inténtalo de nuevo más tarde.
                </li>
                <li v-for="item of results" :key="item.id" @click="openItem(item)">
                    <slot name="result-item" v-bind:item="item">
                        <span v-html="$options.filters.highlight(item.name, query)"></span>
                        <span class="parent" v-if="item.parent_name">en <span v-html="$options.filters.highlight(item.parent_name, query)"></span></span>
                    </slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import _ from 'lodash';
    import axios, {Canceler} from 'axios';
    import highlight from '@/filters/highlight';
    import Vue from 'vue';
    import {SearchResult} from '@/types/search-result';

    let cancel: Canceler;
    const CancelToken = axios.CancelToken;

    enum searchStates {
      NoResults = 1,
      Error,
      HasResults,
      Loading
    }

    export default Vue.extend({
        name: 'Search',
        props: {
            queryUrl: {
                type: String,
                default: null
            },
            queryParam: {
                type: String,
                default: 'search'
            },
            queryExtraParams: {
                type: Object,
                default () {
                    return {}
                }
            },
            placeholder: {
                type: String,
                default: 'Buscar...'
            },
            label: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                query: '',
                results: [] as SearchResult[],
                isFocused: false,
                searchStates: searchStates,
                searchState: searchStates.Loading
            };
        },
        mounted() {
            console.log('mounted');
        },
        methods: {
            setFocused(focused: boolean) {
                this.isFocused = focused;
            },
            querySearch: _.debounce(function (this: any) {
                this.beforeGetResults();
            }, 350),
            beforeGetResults() {
                if (cancel != undefined) {
                    cancel();
                }
                this.getResults(this.query);
            },
            getResults(query: string) {
                console.log('getResults');
                if (query !== '') {
                    this.searchState = searchStates.Loading
                    axios({
                        method: 'get',
                        url: this.queryUrl,
                        cancelToken: new CancelToken(function executor(c) {
                            cancel = c;
                        }),
                        params: this.getQueryParams(query)
                    })
                        .then(res => {
                            this.results = res.data;
                            this.searchState = searchStates.HasResults
                        })
                        .catch(err => {
                            if (axios.isCancel(err)) return;
                            this.searchState = searchStates.Error
                            throw Error(err.message);
                        });
                } else {
                    this.clear();
                }
            },
            getQueryParams(query: string): Object {
                let queryParams = _.clone(this.queryExtraParams);
                queryParams[this.queryParam] = query;
                return queryParams;
            },
            clear() {
                this.isLoading = false;
                this.isError = false;
                this.hasLoadedResults = false;
                this.results = [];
                this.query = '';
            },
            openItem(item: SearchResult) {
                this.$emit('itemClick', item);
            },
        },
        filters: {
            highlight,
        },
    });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }

    $search-width: 450px;

    .search-container {
        position: relative;
        margin: 0 auto;
        width: $search-width;

        @media screen and (max-width: $search-width) {
            width: 95%;
        }

        .search-label {
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: #2B2B2B;
            margin-bottom: 8px;
        }

        .search-input-container {
            position: relative;

            .input-container {
                position: relative;

                input {
                    position: relative;
                    width: 100%;
                    height: 48px;
                    background: #FFFFFF;
                    border: 1px solid #D2D2D2;
                    box-sizing: border-box;
                    border-radius: 4px;
                    padding: 14px 35px 16px 16px;
                    font-size: 16px;
                    outline: none;

                    &:hover {
                        background: #FAFAFA;
                        border: 1px solid #9B9B9B;
                    }

                    &:focus {
                        background: #FFFFFF;
                        border: 1px solid #FF7300;
                        color: #404040;
                        box-shadow: 0px 0px 8px rgba(255, 115, 0, 0.2);

                        + i {
                            color: #FF7300;
                        }
                    }

                }

                i {
                    position: absolute;
                    top: 13px;
                    right: 15px;
                    font-size: 20px;
                    color: #757575;
                    pointer-events: none;
                }

                img {
                    position: absolute;
                    top: 13px;
                    right: 15px;
                    animation: rotation 2s infinite linear;
                }

                z-index: 1;
            }

            .results {
                position: absolute;
                top: 45px;
                left: 0;
                right: 0;
                background: #FFFFFF;
                border: 1px solid #D2D2D2;
                box-sizing: border-box;
                border-bottom-right-radius: 4px;
                border-bottom-left-radius: 4px;
                margin: 0;
                list-style-type: none;
                padding: 0;
                max-height: 250px;
                overflow: hidden;
                overflow-y: auto;
                display: none;

                &.show, &:hover {
                    display: block;
                }

                > li {
                    cursor: pointer;
                    padding: 11px 16px;
                    color: #404040;

                    &:first-of-type {
                        padding: 14px 16px 11px 16px
                    }

                    &:hover:not(.message) {
                        background: #FAFAFA;
                    }

                    &.message {
                        cursor: default;
                    }

                    &.error {
                        color: #89630e;
                        background: #fef7de;
                    }

                    .parent {
                        font-size: 14px;
                        color: gray;
                        margin-left: 6px;
                    }
                }
            }

        }
    }

</style>
