<script setup>
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';
import Toolbar from 'primevue/toolbar';
import Tab from 'primevue/tab';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import Message from 'primevue/message';
import { MovieService } from "./MovieService";
import { ref } from 'vue'

var titleValue = ref();
var yearValue = ref();
var favorites = ref();
var movies = ref();
var searchPaginatorRowsTotalResults = ref(0);
var showErrorMessage = ref(false);
const searchPaginatorFirst = ref(0);
const searchPaginatorRows = ref(10);

var movieService = new MovieService(showErrorMessage, movies, searchPaginatorRowsTotalResults);

function deleteFavorite(favorite) {
    MovieService.DeleteFavorite(favorite.data.imdbID);
    let index = favorites.value.indexOf(favorite.data)
    if (index >= 0) {
        favorites.value.splice(index, 1)
    }

    if (movies.value != null) {
        const movie = movies.value.filter(movie => movie.imdbID === favorite.data.imdbID);
        if (movie[0] != null) {
            movie[0].isFavorite = false;
        }
    }
}

function removeFavoriteFromSearch(movieData) {
    MovieService.DeleteFavorite(movieData.imdbID);
    movieData.isFavorite = false;
}

function updateFavorites() {
    MovieService.GetFavorites(favorites);
}

function onPaginate() {
    const page = (searchPaginatorFirst.value / searchPaginatorRows.value) + 1;
    movieService.searchMovies(titleValue.value, yearValue.value, page)
}

function searchNewMovies(title, year) {
    searchPaginatorFirst.value = 1;
    movieService.searchMovies(title, year, searchPaginatorFirst.value)
}
</script>

<template>
    <Panel class="panel-padding panel-max-width">   
        <h1>
            Movie Search
        </h1>
        <Tabs value="0">
            <TabList>
                <Tab value="0" as="div">Search</Tab>
                <Tab @click="updateFavorites" value="1" as="div">
                    Favorites
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="flex flex-col">
                        <Toolbar>
                            <template #start>
                                <FloatLabel variant="on">
                                    <InputText id="title" v-model="titleValue" class="input-padding" />
                                    <label for="title">Title</label>
                                </FloatLabel>
                                <FloatLabel variant="on">
                                    <InputNumber id="year" v-model="yearValue" :useGrouping="false" fluid class="year-input-max-width input-padding"/>
                                    <label for="year">Year</label>
                                </FloatLabel>
                                <Button @click="searchNewMovies(titleValue, yearValue)" type="submit" severity="secondary" label="Search" class="input-padding"></Button>
                                <Message v-if="showErrorMessage" severity="error" variant="simple">Please Enter Title</Message>
                            </template>
                        </Toolbar>
                    </div>
                    <div>
                        <DataTable :value="movies" :rows="10" tableStyle="min-width: 50rem">
                            <template #header>
                                <div>
                                    <span>Results</span>
                                </div>
                            </template>
                            <Column field="Title" header="Title"></Column>
                            <Column field="Year" header="Year"></Column>
                            <Column header="Favorite">
                                <template #body="slotProps">
                                    <Button v-if="slotProps.data.isFavorite" @click=removeFavoriteFromSearch(slotProps.data) icon="pi pi-heart-fill"></Button>
                                    <Button v-else @click=MovieService.SaveFavorite(slotProps.data) icon="pi pi-heart"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <Paginator v-model:first="searchPaginatorFirst" :rows="searchPaginatorRows" @page="onPaginate" :totalRecords="searchPaginatorRowsTotalResults" />
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    <DataTable :value="favorites" paginator :rows="10" tableStyle="min-width: 50rem">
                        <Column field="title" header="Title"></Column>
                        <Column field="year" header="Year"></Column>
                        <Column header="Favorite">
                            <template #body="slotProps">
                                <Button @click=deleteFavorite(slotProps) icon="pi pi-times" severity="danger"></Button>
                            </template>
                        </Column>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Panel> 
</template>

<style scoped>
.panel-max-width {
    max-width: 1400px;
}
.panel-padding {
    padding-left: 5rem;
    padding-right: 5rem;
}
.year-input-max-width {
    max-width: 100px;
}
.input-padding {
    margin-right: 10px;
}
</style>