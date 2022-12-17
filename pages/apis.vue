<template>
    <div>
        <v-data-table :headers="headers" :items="apis" :loading="loading" loading-text="Loading... Please wait"  :search="search" class="elevation-1 rounded-xl">
            <template v-slot:top>
                <v-toolbar flat class="">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search"  hide-details>
                    </v-text-field>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" @click="newApi()">
                      + Create Api
                    </v-btn>
                    <v-dialog v-model="dialog" max-width="500px" content-class=" rounded-xl">
                        <template v-slot:activator="{ on, attrs }">
                        </template>
                        <v-card>
                            <v-card-title class="d-flex justify-space-between">
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="api.name" :value="api.name"
                                                label="Api name"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="api.api_token" :value="api.api_token"
                                                label="Api token"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn  color="primary" text @click="createApi()">
                                    {{(editedIndex != -1)?'Update':'Create'}}
                                </v-btn>
                              
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                   
                    <v-dialog v-model="dialogDelete" max-width="500px" content-class=" rounded-xl">
                        <v-card>
                            <v-card-title class="text-h5"> Delete</v-card-title>
                            <v-card-subtitle> 
                                <v-icon class="mx-auto my-4" larg color="red">
                                    mdi-delete
                                </v-icon>
                                Are you sure you want to delete this item?
                            </v-card-subtitle>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="primary" text @click="deleteApi()">Delete</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <div class=""> 
                    <v-img class="mx-auto" width="300" height="200" :src="require('@/assets/images/empty.svg')"></v-img>
                    <v-btn class="mx-auto my-2" color="" outlined @click="newApi()">
                        Create Api
                    </v-btn>
                </div>
            </template>
        </v-data-table>
        <v-snackbar v-model="snackbar" :color="snackbarColor">
        {{ snackbarText }}
  
        <template #action="{ attrs }">
          <v-btn color="" text v-bind="attrs" @click="snackbar = false">
            close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
</template>
<script>
import { db, Query, ID } from "../appwrite.js"
export default {
    middleware: 'admin',
    data() {
        return {
            search: '',
            snackbar:false,
            snackbarColor:'success',
            snackbarText:'',
            apis: [],
            api: {},
            dialog: false,
            loading: true,
            dialogDelete: false,
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: '$id',
                },
                { text: 'Api Name', value: 'name' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            editedIndex: -1,
        
            
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Create Api' : 'Edit Api'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
       
    },
    created() {
        this.initialize()
    },
    methods: {
      
    
        deleteApi() {
           
                this.apis.splice(this.editedIndex, 1)
                this.closeDelete()
                db.deleteDocument('delivered', 'apis', this.ApiID).then(() => { 
                    this.snackbar= true
                    this.snackbarColor ='success'
                    this.snackbarText= 'success'
                })
            
        },
        newApi() {
            this.editedIndex = -1
            this.dialog = true
        },
        
        createApi() {

            if (this.editedIndex > -1) {
                Object.assign(this.apis[this.editedIndex], this.api)
                db.updateDocument('delivered', 'apis', this.api.$id,
                    { name: this.api.name }).then(() => { 
                        this.snackbar= true
                        this.snackbarColor ='success'
                        this.snackbarText= 'success'
                    })
            } else {
                db.createDocument('delivered', 'apis', 'unique()', { name: this.api.name })
                    .then((data) => {
                      
                        this.apis.push(data)
                        this.snackbar= true
                        this.snackbarColor ='success'
                        this.snackbarText= 'success'
                    })
                    .catch((err) => { 
                        this.snackbar= true
                        this.snackbarColor ='error'
                        this.snackbarText= err 
                    });
            }
            this.close()
        },
        initialize() {
            db.listDocuments('delivered', 'apis').then((data) => {
                this.apis = data.documents
                this.loading = false
            })
        },
        editItem(item) {
            this.api = item
            this.editedIndex = this.apis.indexOf(item)
            //  this.api = Object.assign({}, item)
          
            this.dialog = true
        },

        deleteItem(item) {
            this.ApiID = item.$id
            this.editedIndex = this.apis.indexOf(item)
           // this.DataDetails = Object.assign({}, item)
            this.dialogDelete = true
        },
    
       
        close() {
            this.dialog = false,
                this.$nextTick(() => {
                    this.api = {}
                    this.editedIndex = -1
                })
        },
        closeDelete() {
            this.dialogDelete = false,
                this.$nextTick(() => {
                    this.api = {}
                    this.editedIndex = -1
                })
        },
      
    },
}
</script>