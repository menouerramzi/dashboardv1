<template>
    <div>
        <v-data-table :headers="headers" :items="users" :loading="loading" loading-text="Loading... Please wait"  :search="search" class="elevation-1 rounded-xl">
            <template v-slot:top>
                <v-toolbar flat class="">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search"  hide-details>
                    </v-text-field>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" @click="newUser()">
                      + Create User
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
                                            <v-text-field v-model="user.username" :value="user.username"
                                                label="Username"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field type="email"  :disabled="(editedIndex != -1)"  v-model="user.email" :value="user.email"
                                                label="E-mail"></v-text-field>
                                        </v-col>
                                        <v-col v-if="(editedIndex == -1)" cols="12">
                                            <v-text-field v-model="user.pass" :type="isPasswordVisible ? 'text' : 'password'"
                                                label="Password" placeholder="············"
                                                :append-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" hide-details
                                                 @click:append="isPasswordVisible = !isPasswordVisible">
                                            </v-text-field>
                                        </v-col>
                                        <v-col v-else cols="12" class="d-flex"> 
                                            <v-text-field :type="isPasswordVisible ? 'text' : 'password'" v-model="user.password" :value="user.password"
                                                label="Password">
                                            </v-text-field>
                                            <v-btn class="my-4" icon @click="(isPasswordVisible = !isPasswordVisible)"> 
                                                <v-icon> 
                                                    {{isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}}
                                                </v-icon> 
                                            </v-btn>
                                        </v-col>
                                        <v-col v-if="(editedIndex == -1)" cols="12">
                                            <v-text-field type="password" v-model="user.passConf" :value="user.passConf"
                                                label="Conferm password"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="user.user_guid" :value="user.user_guid"
                                                label="User guid"></v-text-field>
                                        </v-col>
                                        <v-col cols="12"> 

                                            <v-radio-group
                                                        v-model="user.role"
                                                        row
                                                        >
                                                        <v-radio
                                                            label="User"
                                                            value="user"
                                                        ></v-radio>
                                                        <v-radio
                                                            label="Validator"
                                                            value="validator"
                                                        ></v-radio>
                                                        <v-radio
                                                            label="Admin"
                                                            value="admin"
                                                        ></v-radio>
                                                    </v-radio-group>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn  color="primary" :loading="loadingBtn" :disabled="loadingBtn" text @click="createUser()">
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
                                <v-btn color="blue darken-1"  text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="primary" :loading="loadingBtn" :disabled="loadingBtn" text @click="deleteUser()">Delete</v-btn>
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
                    <v-btn class="mx-auto my-2" color="" outlined @click="newUser()">
                        Create User
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
import { db, Query, ID, account } from "../appwrite.js"
export default {
    middleware: 'admin',
    data() {
        return {
            search: '',
            snackbar:false,
            snackbarColor:'success',
            snackbarText:'',
            users: [],
            variations: [],
            user: {},
            dialog: false,
            loading: true,
            dialogDelete: false,
            dialogPass: false,
            loadingBtn:false,
            isPasswordVisible:false,
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: '$id',
                },
                { text: 'Username', value: 'username' },
                { text: 'E-mail', value: 'email' },
                { text: 'Role', value: 'role' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            editedIndex: -1,
        
            
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Create User' : 'Edit User'
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
      
        deleteUser() {    
                this.loadingBtn = true   
                this.users.splice(this.editedIndex, 1)
                this.closeDelete()
                db.deleteDocument('delivered', 'users', this.UserID).then(() => { 
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
        },
        newUser() {
            this.editedIndex = -1
            this.dialog = true
        },
        
        // updatePassword(){ 
        //     if (this.passConf == this.pass) {
        //     account.updatePassword(this.name.pass).then(() => { 
        //         this.snackbar= true
        //         this.snackbarColor ='success'
        //         this.snackbarText= 'success'
        //         this.dialogPass = false
        //     }).catch(err => { 
        //         this.snackbar= true
        //         this.snackbarColor ='error'
        //         this.snackbarText= err 
        //     })
        //     }else{ 
        //             this.snackbar= true
        //             this.snackbarColor ='error'
        //             this.snackbarText= 'check your password if the same in confermation password' 
        //     }
        // },
        createUser() {
            this.loadingBtn = true
            if (this.editedIndex > -1) {
                Object.assign(this.users[this.editedIndex], this.user)

                db.updateDocument('delivered', 'users', this.user.$id,
                    { 
                        username: this.user.username,
                        user_guid: this.user.user_guid,
                        role: this.user.role 
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
            }else {
                if (this.passConf == this.pass) {
                account.create(ID.unique(), this.user.email, this.user.pass, this.user.username)
                    .then((data) => {
                        db.createDocument('delivered', 'users', data.$id, { 
                            email: this.user.email,
                            username: this.user.username,
                            user_guid: this.user.user_guid,
                            role: this.user.role 
                        })
                        .then((data) => {
                            this.loadingBtn = false
                            this.users.push(data)
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
                    })
                }else{ 
                    this.loadingBtn = false
                    this.snackbar= true
                    this.snackbarColor ='error'
                    this.snackbarText= 'check your password if the same in confermation password' 
                }
                
            }
            this.close()
        },
        initialize() {
            db.listDocuments('delivered', 'users').then((data) => {
                this.users = data.documents
                this.loading = false
            })
        },
        editItem(item) {
            this.user = item
            this.editedIndex = this.users.indexOf(item)
            //  this.user = Object.assign({}, item)
          
            this.dialog = true
        },

        deleteItem(item) {
            this.UserID = item.$id
            this.editedIndex = this.users.indexOf(item)
           // this.DataDetails = Object.assign({}, item)
            this.dialogDelete = true
        },
    
       
        close() {
            this.dialog = false,
                this.$nextTick(() => {
                    this.user = {}
                    this.editedIndex = -1
                })
        },
        closeDelete() {
            this.dialogDelete = false,
                this.$nextTick(() => {
                    this.user = {}
                    this.editedIndex = -1
                })
        },
      
    },
}
</script>
        

