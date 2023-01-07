<template>
    <div>
        <v-data-table :headers="headers" :items="products" :loading="loading" loading-text="Loading... Please wait"  :search="search" class="elevation-1 rounded-xl">
            <template v-slot:top>
                <v-toolbar flat class="">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search"  hide-details>
                    </v-text-field>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" @click="newProduct()">
                      + Create Product
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
                                            <v-text-field v-model="product.name" :value="product.name"
                                                label="Product name"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-file-input accept="image/png, image/jpeg, image/bmp"
                                                prepend-icon="mdi-camera" show-size v-model="product.imgInput"
                                                placeholder="Product picture" truncate-length="5"></v-file-input>
                                        </v-col>
                                        <v-col  v-if="((editedIndex != -1) && product.imgUrl)"  cols="12"> 
                                            <v-img class="mx-auto" width="300" height="200" :src="product.imgUrl+'&mode=admin'" contain></v-img>   
                                        </v-col>
                                        <v-card-actions class="align-center">
                                            <v-btn color="primary" text @click="addMore()">
                                                + Create Variation
                                            </v-btn>
                                        </v-card-actions>
                                    </v-row>
                                    <!--==== Edit Variation ====-->
                                    <div v-for="(variation, index) in variations" :key="(index)">
                                        <v-card outlined class="pa-2 my-2">
                                            <v-row class="align-center ">
                                                <v-col xs="6">
                                                    <v-text-field v-model="variation.colour" label="Colour">
                                                    </v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="variation.size" label="Size">
                                                    </v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="variation.quantity" label="Quantity">
                                                    </v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="variation.price" label="Price">
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row class="align-center mb-3 ">
                                                 <v-col cols="6">
                                                    <v-text-field v-model="variation.priceBuy" label="Price Origine">
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="6" class="d-flex justify-end">
                                                    
                                                    <div v-if="editedIndex != -1"> 

                                                        <v-chip v-if="variation.$id != -1" class="align-center mr-2" color="blue"  outlined 
                                                            @click="editVariation(variation)" >
                                                            Edit
                                                        </v-chip>
                                                        <v-chip v-else class="align-center mr-2" color="green" outlined
                                                            @click="saveVariation(index)">
                                                            Save
                                                        </v-chip>
                                                    </div>
                                                    <v-chip class="align-center" color="red" outlined
                                                        @click="remove(index, variation)">
                                                        Delete
                                                    </v-chip>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                            </v-row>
                                        </v-card>
                                    </div>
                                    <!--==== End of Edit Variation ====-->
                                    <!--==== Add Variation ====-->
                                    
                                    <!--==== End of Add Variation ====-->
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn  color="primary" :loading="loadingBtn" :disabled="loadingBtn" text @click="createProduct()">
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
                                <v-btn color="primary" :loading="loadingBtn" :disabled="loadingBtn" text @click="deleteProduct()">Delete</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.imgUrl="{ item }">
                <v-img width="40" height="40" :src="item.imgUrl" style="border-radius: 50px"> 

                </v-img>
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
                    <v-btn class="mx-auto my-2" color="" outlined @click="newProduct()">
                        Create Product
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
import { db, Query, ID ,storage } from "../appwrite.js"
export default {
    middleware: 'validator',
    data() {
        return {
            search: '',
            snackbar:false,
            snackbarColor:'success',
            snackbarText:'',
            products: [],
            variations: [],
            product: {},
            dialog: false,
            loading: true,
            dialogDelete: false,
            loadingBtn:false,
            headers: [
                {
                    text: 'image',
                    align: 'start',
                    sortable: false,
                    value: 'imgUrl',
                },
                { text: 'Product Name', value: 'name' },
                { text: 'Completed ', value: 'completed' },
                { text: 'Rejected', value: 'rejected' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            editedIndex: -1,
        
            defaultItem: {
                name: '',
                colour: '',
                size: '',
                quantity: '',
                price: '',
                $id: ''
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Create Product' : 'Edit Product'
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
        addMore() {
            this.variations.push({
                name: '',
                size: '',
                colour: '',
                quantity: '',
                price: '',
                $id: -1
            });
        },
        // function to remove variations 
        remove(index, variation) {
            if (variation.$id != -1) {
                db.deleteDocument('delivered', 'variations', variation.$id).then(() => {
                    this.variations.splice(index, 1)
                })
            } else {
                this.variations.splice(index, 1)
            }
        },
        deleteProduct() {
            this.loadingBtn = true
            storage.deleteFile('productsimg', this.product.img)
            db.listDocuments('delivered', 'variations', [
                Query.equal('productID', [this.ProductID])
            ]).then((data) => {
                this.loadingBtn = false
                const variations = data.documents
                variations.forEach(element => {
                    db.deleteDocument('delivered', 'variations', element.$id)
                });
                this.products.splice(this.editedIndex, 1)
                db.deleteDocument('delivered', 'products', this.ProductID).then(() => { 
                })
                this.closeDelete()
            }).catch(err => { 
                this.loadingBtn = false
                this.snackbar= true
                this.snackbarColor ='error'
                this.snackbarText= err
            })
        },
        newProduct() {
            this.variations = []
            this.editedIndex = -1
            this.dialog = true
        },
        saveVariation(index) {
            const element = this.variations.at(index)
            db.createDocument('delivered', 'variations', 'unique()', {
                colour: element.colour,
                size: element.size,
                quantity: element.quantity,
                price: element.price,
                priceBuy: element.priceBuy,
                productID: this.product.$id
            }).then((data) => {
                this.variations[index].$id = data.$id    
            }).catch((err) => { 

                this.snackbar= true
                this.snackbarColor ='error'
                this.snackbarText= err
             })
        },

        async createProduct() {
            this.loadingBtn = true
            let img = {}
            let imgUrl = ''
            if (this.editedIndex > -1) {
                if(this.product.imgInput){ 
                    if(this.product.img){ 

                        storage.deleteFile('productsimg', this.product.img)
                    }
                    img = await storage.createFile('productsimg', 'unique()', this.product.imgInput)
                    imgUrl = await storage.getFilePreview('productsimg', img.$id)
                }else{ 
                    imgUrl = this.product.imgUrl
                    img.$id =  this.product.img
                }
              
                Object.assign(this.products[this.editedIndex], {...this.product, imgUrl:imgUrl})
                db.updateDocument('delivered', 'products', this.product.$id,
                    { 
                        name: this.product.name,
                        imgUrl: imgUrl,
                        img: img.$id
                    }).then(() => { 
                        this.loadingBtn = false
                        this.snackbar= true
                        this.snackbarColor ='success'
                        this.snackbarText= 'success'
                    }).catch((err) => { 
                        this.loadingBtn = false
                        this.snackbar= true
                        this.snackbarColor ='error'
                        this.snackbarText= err 
                    });
            } else {
                if(this.product.imgInput){ 

                    img = await storage.createFile('productsimg', 'unique()', this.product.imgInput)
                    imgUrl = await storage.getFilePreview('productsimg', img.$id)
                    // alert(JSON.stringify(imgUrl))
                }
                db.createDocument('delivered', 'products', 'unique()', {
                     name: this.product.name,
                     imgUrl: imgUrl,
                     img: img.$id,
                     completed:0,
                     rejected:0

                     })
                    .then((data) => {
                        this.variations.forEach(element => {
                            db.createDocument('delivered', 'variations', 'unique()', {
                                colour: element.colour,
                                size: element.size,
                                quantity: element.quantity,
                                price: element.price,
                                priceBuy: element.priceBuy,
                                productID: data.$id
                            }).catch((err) => {  
                                this.loadingBtn = false
                                this.snackbar= true
                                this.snackbarColor ='error'
                                this.snackbarText= err
                             })
                        });
                        this.loadingBtn = false
                        this.products.push(data)
                        this.snackbar= true
                        this.snackbarColor ='success'
                        this.snackbarText= 'success'
                    })
                    .catch((err) => { 
                        this.loadingBtn = false
                        this.snackbar= true
                        this.snackbarColor ='error'
                        this.snackbarText= err 
                    });
            }
            this.close()
        },
        initialize() {
            db.listDocuments('delivered', 'products', [Query.limit(1000) ] ).then((data) => {
                this.products = data.documents
                this.loading = false
            })
        },
        editItem(item) {
            this.product = item
            this.editedIndex = this.products.indexOf(item)
            //  this.product = Object.assign({}, item)
            this.variations = []
            db.listDocuments('delivered', 'variations', [
                Query.equal('productID', item.$id)
            ]).then((data) => {
                data.documents.forEach(variation => {
                this.variations.push(variation)
                })
            }).catch(err => { 
                this.snackbar= true
                this.snackbarColor ='error'
                this.snackbarText= err 
            })
            this.dialog = true
        },

        deleteItem(item) {
            this.ProductID = item.$id
            this.editedIndex = this.products.indexOf(item)
            this.product = item
            this.dialogDelete = true
        },
    
        editVariation(variation) {
            db.updateDocument('delivered', 'variations', variation.$id, {
                colour: variation.colour,
                size: variation.size,
                quantity: variation.quantity,
                price: variation.price,
                priceBuy: variation.priceBuy,
               // id_: _id
            }).then(() => { 
                this.snackbar= true
                this.snackbarColor ='success'
                this.snackbarText= 'success'
            }).catch((err) => {
                this.snackbar= true
                this.snackbarColor ='error'
                this.snackbarText= err 
               })
        },
        close() {
            this.dialog = false,
                this.$nextTick(() => {
                    this.product = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
        },
        closeDelete() {
            this.dialogDelete = false,
                this.$nextTick(() => {
                    this.product = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
        },
      
    },
}
</script>