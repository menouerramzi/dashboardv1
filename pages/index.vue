<template>
  <div>
      <div v-if="($store.state.auth.user.role == 'admin')" >
      
      <v-row class="my-4">
          <v-col cols="6" sm="3"> 
              <v-text-field  type="date" v-model="filterage.dateBefor" :value="filterage.dateBefor"
                  label="Star Date"></v-text-field> 
          </v-col> 
          <v-col cols="6" sm="3"> 
              <v-text-field  type="date"  v-model="filterage.dateAfter" :value="filterage.dateAfter"
                  label="End Date"></v-text-field> 
          </v-col>
          <v-col cols="6" sm="3"> 
              <v-select v-model="filterage.api_token" :items="api"
                  item-text="name" item-value="api_token" label="Select an option">
              </v-select>
          </v-col>
          <v-col cols="6" sm="3"> 
              <v-select v-model="filterage.user" :items="users"
                  item-text="username" item-value="$id" label="Select an User">
              </v-select>
          </v-col> 
      </v-row>
      <div class="d-flex"> 
          <v-spacer></v-spacer>
              <v-btn color="primary" :loading="loadingBtn" :disabled="loadingBtn" dark @click="statistics()">
                    Statistics
              </v-btn>
      </div>
      <v-row   v-if="($store.state.auth.user.role == 'admin')" class="my-4"> 
          
          <v-col cols="6" sm="3"> 
              <v-card class="elevation-1 rounded-xl"> 
                  <v-card-title>
                  <v-icon small class="mr-2" color=""> 
                      mdi-clock-outline
                  </v-icon>
                      Pandding
                  </v-card-title>
                  <v-card-subtitle>
                      <span class="text-h5"> 
                          {{statisticsTotal.montantPanding}} DA
                      </span>
                  </v-card-subtitle>
                  <v-card-text class="d-flex justify-space-between"> 
                      <span class="text-h8"> 
                          Montant
                      </span>
                      <span class="text-h8"> 
                          Orders: {{statisticsTotal.nbOrderPanding}}
                      </span>
                  </v-card-text>
              </v-card>
          </v-col>
          <v-col cols="6" sm="3"> 
              <v-card class="elevation-1 rounded-xl"> 
                  <v-card-title>
                  <v-icon small class="mr-2" color="orange"> 
                      mdi-flash
                  </v-icon>
                      Process
                  </v-card-title>
                  <v-card-subtitle>
                      <span class="text-h5"> 
                          {{statisticsTotal.montantProcess}} DA
                      </span>
                  </v-card-subtitle>
                  <v-card-text class="d-flex justify-space-between"> 
                      <span class="text-h8"> 
                          Montant
                      </span>
                      <span class="text-h8"> 
                          Orders: {{statisticsTotal.nbOrderProcess}}
                      </span>
                  </v-card-text>
              </v-card>
          </v-col>
          <v-col cols="6" sm="3"> 
              <v-card class="elevation-1 rounded-xl"> 
                  <v-card-title>
                  <v-icon small class="mr-2" color="green"> 
                      mdi-check
                  </v-icon>
                      Complited
                  </v-card-title>
                  <v-card-subtitle>
                      <span class="text-h5"> 
                          {{statisticsTotal.montantComplited}} DA
                      </span>
                  </v-card-subtitle>
                  <v-card-text class="d-flex justify-space-between"> 
                      <span class="text-h8"> 
                          Montant
                      </span>
                      <span class="text-h8"> 
                          Orders: {{statisticsTotal.nbOrderComplited}}
                      </span>
                  </v-card-text>
              </v-card>
          </v-col>
          <v-col cols="6" sm="3"> 
              <v-card class="elevation-1 rounded-xl"> 
                  <v-card-title>
                  <v-icon small class="mr-2" color="red"> 
                      mdi-close
                  </v-icon>
                      Rejected
                  </v-card-title>
                  <v-card-subtitle>
                      <span class="text-h5"> 
                          {{statisticsTotal.montantRejected}} DA
                      </span>
                  </v-card-subtitle>
                  <v-card-text class="d-flex justify-space-between"> 
                      <span class="text-h8"> 
                          Montant
                      </span>
                      <span class="text-h8"> 
                          Orders: {{statisticsTotal.nbOrderRejected}}
                      </span>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
      </div>
      <v-data-table 
      :headers="headers" 
      :items="orders" 
      :loading="loading"
      loading-text="Loading... Please wait" 
      :search="searchOrder" 
      class="elevation-1 rounded-xl">
          <template v-slot:top>
              <v-toolbar flat class="">
                  <v-text-field v-model="searchOrder" append-icon="mdi-magnify" label="Search"  hide-details>
                  </v-text-field>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" dark class="mb-2" @click="newOrder()">
                    + Create Order
                  </v-btn>
                  <v-dialog v-model="DialogOrder" max-width="1100px" content-class=" rounded-xl">
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
                                          <v-select :readonly="readonly" v-model="order.api_token" :items="api"
                                              item-text="name" item-value="api_token" label="Select an option"
                                          >
                                          </v-select>
                                      </v-col>
                                      <v-col cols="12" sm="6">
                                          <v-text-field :readonly="readonly" v-model="order.client" :value="order.client"
                                              label="Full Name"></v-text-field>
                                      </v-col>
                                      <v-col cols="12" sm="6">
                                          <v-text-field :readonly="readonly" v-model="order.phone" :value="order.phone"
                                              label="Phone"></v-text-field>
                                      </v-col>
                                      <v-col cols="12">
                                          <v-label> 
                                              Wilaya And Commune
                                          </v-label>
                                          <v-container fluid> 

                                         
                                          <v-combobox
                                              v-model="modelAddress"
                                              :filter="filter"
                                              :hide-no-data="!search"
                                              :items="itemsAddress"
                                              :search-input.sync="search"
                                              
                                              label="Search for an Address"
                                              multiple
                                              small-chips
                                              solo
                                              :readonly="readonly"
                                              >
                                              <template v-slot:no-data>
                                                  <v-list-item> 
                                                      <span class="subheading"> No data!</span>
                                                  </v-list-item>
                                              </template>
                                              <template v-slot:selection="{ attrs, item, parent, selected }">
                                                  <v-chip
                                                  v-if="item === Object(item)"
                                                  v-bind="attrs"
                                                  :color="`${item.color} lighten-3`"
                                                  :input-value="selected"
                                                  label
                                                  small
                                                  >
                                                  <span class="pr-2">
                                                      {{ item.text }}
                                                  </span>
                                                  <v-icon v-if="!readonly"
                                                      small
                                                      @click="parent.selectItem(item), changeAddress(-1, item)"
                                                  >
                                                      $delete
                                                  </v-icon>
                                                  </v-chip>
                                              </template>
                                              <template v-slot:item="{ index, item }">
                                                  <v-list-item @click.stop="changeAddress(index, item)"> 
                                                      <v-chip
                                                      :color="`${item.color} lighten-3`"
                                                      dark
                                                      label
                                                      small
                                                      
                                                      >
                                                          {{ item.text }}
                                                      </v-chip>
                                                      <v-spacer></v-spacer>
                                                  </v-list-item> 

                                              </template>
                                          </v-combobox>
                                          <v-span v-if="modelAddress[0]"> 
                                              Frais de livraison : {{modelAddress[0].livrasion}} DA - Frais STOP DESK : {{modelAddress[0].desk}} DA
                                          </v-span>
                                      </v-container>
                                      </v-col>
                                      <v-col cols="12">
                                          <v-text-field :readonly="readonly" v-model="order.adresse" :value="order.adresse"
                                              label="Address"></v-text-field>
                                      </v-col>
                                      
                                      
                                  </v-row>
                                  

                                  <!-- add products -->
                                  <v-container fluid>
                                      <v-btn v-if="!readonly" class="my-4" color="primary" @click="initial"> 
                                          + add product
                                      </v-btn>
                                      <div class="d-flex" v-for="(globalProduct, global) in globalProducts" :key="(global)"> 
                                          <v-combobox
                                          v-model="globalProduct.model"
                                          :filter="filter"
                                          :hide-no-data="!search"
                                          :items="globalProduct.items"
                                          :search-input.sync="search"
                                          hide-selected
                                          label="Search for an option"
                                          multiple
                                          small-chips
                                          solo
                                          :readonly="readonly"
                                      >
                                          <template v-slot:no-data>
                                              <v-list-item> 
                                              <span class="subheading"> No data!</span>
                                              </v-list-item>

                                          </template>
                                          <template v-slot:selection="{ attrs, item, parent, selected }">
                                          <v-chip
                                              v-if="item === Object(item)"
                                              v-bind="attrs"
                                              :color="`${item.color} lighten-3`"
                                              :input-value="selected"
                                              label
                                              small
                                          >
                                              <v-avatar left v-if="item.img">
                                              <v-img :src="item.img"></v-img>
                                              </v-avatar>
                                              <span class="pr-2">
                                              {{ item.text }}
                                              </span>
                                              <v-icon v-if="!readonly"
                                              small
                                              @click="parent.selectItem(item), change(-1,item, global)"
                                              >
                                              $delete
                                              </v-icon>
                                          </v-chip>
                                          </template>
                                          <template v-slot:item="{ index, item }">
                                              <v-list-item @click.stop="change(index, item, global)"> 

                                                  <v-chip
                                                  :color="`${item.color} lighten-3`"
                                                  dark
                                                  label
                                                  
                                                  
                                                  >
                                                  <v-avatar left  v-if="item.img">
                                                      <v-img :src="item.img"></v-img>
                                                  </v-avatar>
                                                  {{ item.text }}
                                                  </v-chip>
                                                  <v-spacer></v-spacer>
                                                  <v-list-item-action>
                                                  <div  class="d-flex"> 
                                      
                                                      <v-btn v-if="(item.img && globalProduct.model.length == 0)"
                                                          icon
                                                          @click.stop="(menu = {...item, global:global}), dialog=true"
                                                          >
                                                          <v-icon>mdi-camera</v-icon>
                                                      </v-btn>
                                                  </div>
                                                  </v-list-item-action>
                                              </v-list-item>
                                          </template>
                                      </v-combobox>

                                      <v-row v-if="(globalProduct.model.length == 3)">
                                              <v-col class="d-flex mx-2">
                                                  <v-text-field :readonly="readonly" type="number" outlined v-model="globalProduct.model[2].quantity"
                                                      label="Quantity">
                                                  </v-text-field>
                                              </v-col>
                                              <v-col v-if="!readonly" class="d-flex  ">
                                                  <v-card-text>Stock :
                                                  </v-card-text>
                                                  <v-card-subtitle v-model="globalProduct.model[2].stock">
                                                  {{globalProduct.model[2].stock}}
                                                  </v-card-subtitle>
                                              </v-col>
                                              <v-col class="d-flex  ">
                                                  <v-card-text>Price :
                                                  </v-card-text>
                                                  <v-card-subtitle v-model="globalProduct.model[2].price">
                                                  {{globalProduct.model[2].price}}
                                                  </v-card-subtitle>
                                              </v-col>

                                          </v-row>
                                          <v-btn v-if="globalProduct.model[0]" icon class="my-2 mx-2" 
                                                          @click="((menu = {img:globalProduct.model[0].img}), dialog = true)"
                                          >
                                                          <v-icon>mdi-camera</v-icon>
                                          </v-btn>

                                          <v-btn v-if="!readonly" icon class="my-2 mx-2" @click="remove(global)"> 
                                          <v-icon color="red">mdi-close-circle</v-icon>
                                          </v-btn>
                                      </div>  
                                      
                                      <v-dialog
                                      v-model="dialog"
                                      width="300"
                                      >
                                      <v-card width="300" v-if="menu">
                                                  <v-list dark>
                                                      <v-list-item>
                                                          <v-list-item-action style="position:absolute; z-index:2; top:0px;right:0px;">
                                                              <v-btn
                                                              icon
                                                              @click.stop="(menu = null), dialog=false"
                                                              
                                                              >
                                                              <v-icon color="red">mdi-close-circle</v-icon>
                                                              </v-btn>
                                                          </v-list-item-action>
                                                          <v-img :src="menu.img"></v-img>
                                                      </v-list-item>
                                                  </v-list>
                                                  <v-list v-if="menu.text">
                                                      <v-list-item @click.stop="change(0, menu, menu.global), dialog=false">
                                                      <v-list-item-action>
                                                          <v-icon>mdi-tag</v-icon>
                                                      </v-list-item-action>
                                                      <v-list-item-subtitle>{{menu.text}}</v-list-item-subtitle>
                                                      </v-list-item>
                                                  </v-list>
                                          </v-card>
                                      </v-dialog>

                                      </v-container>
                                  <!-- end add products -->
                                      <v-row> 
                                          <v-col cols="12"> 
                                              <v-textarea :readonly="readonly" v-model="order.remarque" outlined label="Note"> 

                                              </v-textarea>
                                          </v-col>
                                          <v-col cols="6">
                                              <v-text-field :readonly="readonly" type="number" v-model="order.montant" :value="order.montant"
                                              label="Montant (DA)"></v-text-field>
                                          </v-col> 
                                          <v-col cols="6"> 
                                              <v-text-field :readonly="readonly" type="number" v-model="order.poids" :value="order.poids"
                                              label="Poids (kg)"></v-text-field>
                                          </v-col>
                                          <v-col v-if="!readonly" cols="12"> 

                                              <v-radio-group
                                                  v-model="order.type_id"
                                                  row
                                                  
                                                  >
                                                  <v-radio
                                                      label="Livraison"
                                                      value="1"
                                                  ></v-radio>
                                                  <v-radio
                                                      label="Echange"
                                                      value="2"
                                                  ></v-radio>
                                                  <v-radio
                                                      label="Pick up"
                                                      value="3"
                                                  ></v-radio>
                                              </v-radio-group>
                                          </v-col>
                                          <v-col v-if="!readonly" cols="12"> 
                                              <v-radio-group
                                                  v-model="order.stop_desk"
                                                  row
                                                  >
                                                  <v-radio
                                                      label="Home"
                                                      value="0"
                                                  ></v-radio>
                                                  <v-radio
                                                      label="Stop desk"
                                                      value="1"
                                                  ></v-radio>
                                              </v-radio-group>
                                          </v-col>
                                      </v-row>

                                      <!-- shipping data  -->

                                      <v-card v-if="(readonly)">
                                              <v-toolbar
                                              flat
                                              color="primary"
                                              dark
                                              >
                                              <v-toolbar-title>Activity</v-toolbar-title>
                                              </v-toolbar>
                                              <v-tabs vertical>
                                              <v-tab v-for="(item, index) in shipping.activity" :key="index">
                                                  <v-chip >
                                                      {{++index}}
                                                  </v-chip>
                                              </v-tab>
                                              
                                              <v-tab-item  v-for="(item, index) in shipping.activity" :key="index">
                                                  <v-card flat>
                                                  <v-card-text>
                                                      <span class="text-h4 mb-4">{{ item.event }}</span>
                                                      <div class="d-flex my-4"> 
                                                          <sapn class="text-h5 mx-3"> 
                                                              {{item.by}} : 
                                                              <v-chip small> 
                                                                  {{item.causer}}
                                                              </v-chip>
                                                          </sapn>
                                                         
                                                      </div>
                                                      <p>{{item.content}}</p>
                                                      <div class="mx-4 my-4"> 
                                                          <p> 

                                                              <v-label class="text-align "> 
                                                                  {{item.name}}
                                                              </v-label>
                                                          </p>
                                                          <p> 

                                                              <v-label class="text-align"> 
                                                                  {{item.driver}}
                                                              </v-label>
                                                          </p>
                                                          <v-label class="text-align"> 
                                                              {{item.fdr}}
                                                          </v-label>
                                                      </div>

                                                      <v-label class="d-flex text-align mt-2" small> 
                                          
                                                          <v-icon> 
                                                              mdi-clock-outline
                                                          </v-icon>
                                                          {{item.date}}
                                                      </v-label>
                                                  </v-card-text>
                                                  </v-card>
                                              </v-tab-item>
                                              </v-tabs>
                                          </v-card>

                                      <!-- end shipping data  -->
                              </v-container>
                          </v-card-text>
                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" text @click="(DialogOrder = false)">
                                  Cancel
                              </v-btn>
                              <v-btn v-if="!readonly" :loading="loadingBtn" :disabled="loadingBtn" color="primary" text @click="createOrder()">
                                  {{(editedIndex != -1)?'Update':'Create'}}
                              </v-btn>
                              <div v-else-if="($store.state.auth.user.role == 'admin' || $store.state.auth.user.role == 'validator')">  
                                  <v-btn v-if="(order.statut == 'panding')" :loading="loadingBtn" :disabled="loadingBtn" color="orange" text @click="validationOrder()">
                                      Valide
                                  </v-btn>
                                  <v-btn v-if="(order.statut == 'prossece')" :loading="loadingBtn" :disabled="loadingBtn" color="green" text @click="changeStateOrder('complated')">
                                      Complated
                                  </v-btn>
                                  <v-btn v-if="(order.statut == 'prossece')" :loading="loadingBtn" :disabled="loadingBtn" color="red" text @click="changeStateOrder('rejected')">
                                      Complated
                                  </v-btn>
                                  <a :href="('https://app.noest-dz.com/download/etiq/'+order.tracking)" target="blanc"> 
                                  <v-btn> 
                                      <v-icon small class="mr-2"> 
                                          mdi-printer
                                      </v-icon>
                                      Print
                                  </v-btn>
                                  </a>
                              </div>
                            
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
                              <v-btn color="blue darken-1" text @click="(dialogDelete = false)">Cancel</v-btn>
                              <v-btn color="primary" text :loading="loadingBtn" :disabled="loadingBtn" @click="deleteOrder()">Delete</v-btn>
                              <v-spacer></v-spacer>
                          </v-card-actions>
                      </v-card>
                  </v-dialog>
                 
              </v-toolbar>
          </template>
          <template v-slot:item.statut="{ item }">
              <v-chip
                  :color="getColor(item.statut)"
                  dark
              >
                  {{ item.statut }}
              </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
              <v-icon  small class="mr-2" @click="(readonly = true) , editItem(item)">
                  mdi-eye
              </v-icon>
              <v-icon v-if="item.statut == 'panding'" small class="mr-2" @click="(readonly = false) ,editItem(item)">
                  mdi-pencil
              </v-icon>
              <v-icon v-if="item.statut == 'panding'" small class="mr-2" @click="deleteItem(item)">
                  mdi-delete
              </v-icon>
          </template>
          <template v-slot:no-data>
              <div class=""> 
                  <v-img class="mx-auto" width="300" height="200" :src="require('@/assets/images/empty.svg')"></v-img>
                  <v-btn class="mx-auto my-2" color="" outlined @click="newOrder()">
                      Create Order
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

import moment from 'moment'
import { db, Query, ID, storage } from "../appwrite.js"
import wilaya from '@/assets/Wilaya-Of-Algeria-master/Wilaya_Of_Algeria.json'
import commune from '@/assets/Wilaya-Of-Algeria-master/CommuneOfAlgeria.json'

export default {
data: () => ({
  globalProducts:[],
  modelAddress : [],
  itemsAddress : wilaya,
  loading: true,
  readonly:false,
  loadingBtn:false,

  snackbar:false,
  snackbarColor:'success',
  snackbarText:'',

  filterage:{ 
  dateAfter : moment(new Date()).format('L'),
  dateBefor : moment(new Date(new Date().setDate(new Date().getDate() - 30))).format('L'),
  },
  users:{},
  statisticsTotal:{},

  headers: [
              { text: 'Full Name', value: 'client' },
              { text: 'Phone', value: 'phone' },
              { text: 'Montant', value: 'montant' },
              { text: 'Statut', value: 'statut' },
              { text: 'Created at', value: '$createdAt' },
              { text: 'Actions', value: 'actions', sortable: false },
          ],
  editedIndex:-1,

  products:[],
  variations:[],
  menu: null,
  dialog:false,
  dialogDelete:false,
  x: 0,
  search: null,
  searchOrder:'',
  orders:[],
  order:{},
  shipping:{},
  api: [{api_token:'OiHJO2UfRFlKRNWUJbg5L3hG0CEfQmnkDoW', name:'la fomidable'}],
  DialogOrder:false,
  y: 0,
}),

computed: {
      formTitle() {
          return this.editedIndex === -1 ? 'Create New Order' : this.readonly?'Order':'Edit Order'
      },
  },


watch: {
  
},
mounted(){ 
    this.getDataInitial()
    this.statistics()
},
methods: {

  getDataInitial(){ 
      db.listDocuments('delivered', 'orders').then((data) => {
              if(this.$store.state.auth.user.role == 'user'){ 
                  this.orders = data.documents.filter(item => (item.user_id == this.$store.state.auth.user.$id ))
              }else{ 

                  this.orders = data.documents
              }
              this.loading = false
      })
      db.listDocuments('delivered', 'products').then((data) => {
              this.products = data.documents.map(item => ({id:item.$id, text:item.name, img:item.imgUrl, rejected:item.rejected, complited:item.complited}))
              this.initial()
          })
      db.listDocuments('delivered', 'variations').then((data) => {
          this.variations = data.documents.map(item => ({
                  id:item.$id,
                  product_id:item.productID, 
                  color:item.colour, 
                  size:item.size,
                  stock:item.quantity,
                  price:item.price
          }))
      })    
      db.listDocuments('delivered', 'apis').then((data) => {
              this.api = data.documents
              if(this.api){ 
                  this.filterage.api_token = this.api[0].api_token
              }
      })
      db.listDocuments('delivered', 'users').then((data) => {
              this.users = data.documents
              if(this.users){ 
                  this.filterage.user = this.users[0].$id
              }
      })
  },
  newOrder(){ 
      if(this.editedIndex != -1){ 

          this.order = {}
          this.globalProducts = []
          this.initial()
          this.modelAddress = []
          this.changeAddress(-1, {})
      }
      this.editedIndex = -1
      this.readonly = false
      this.DialogOrder = true
  },
  editItem(item){ 
      this.order = item
      this.editedIndex = this.orders.indexOf(item)
      this.globalProducts = JSON.parse(this.order.produit_model)
      this.modelAddress = JSON.parse(this.order.address_model)
      this.shipping = {}
      this.DialogOrder = true
      this.$axios.post('https://app.noest-dz.com/api/public/get/tracking/info', {
          api_token:this.order.api_token,
          user_guid: this.order.user_guid,
          tracking: this.order.tracking
      }).then(data => { 
          this.shipping = data.data
              })
  },

  validationOrder(){
      this.loadingBtn = true
      this.$axios.post('https://app.noest-dz.com/api/public/valid/order', {        
              api_token:this.order.api_token,
              user_guid: this.order.user_guid,
              tracking: this.order.tracking
              }).then(() => { 
                  this.changeStateOrder('prossece')
                  this.loadingBtn = false
              }).catch(err => { 
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='error'
                      this.snackbarText= err
                  })
  },
  deleteItem(item) {
          this.order = item
          this.editedIndex = this.orders.indexOf(item)
         // this.DataDetails = Object.assign({}, item)
          this.dialogDelete = true
  },
  
  deleteOrder(){ 
      this.loadingBtn = true
      this.$axios.post('https://app.noest-dz.com/api/public/delete/order', {        
              api_token:this.order.api_token,
              user_guid: this.order.user_guid,
              tracking: this.order.tracking
              }).then(data => { 
                  db.deleteDocument('delivered', 'orders', this.order.$id).then(()=>{
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='success'
                      this.snackbarText= 'success'
                      this.dialogDelete = false
                  }).catch(err => { 
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='error'
                      this.snackbarText= err
                  })
              }).catch(err => { 
                      this.loadingBtn = false    
                      this.snackbar= true
                      this.snackbarColor ='error'
                      this.snackbarText= err
                  })
  },
  // https://app.noest-dz.com/download/etiq/
  changeStateOrder(state){ 
      this.loadingBtn = true
      Object.assign(this.orders[this.editedIndex], {...this.order, statut:state})
      db.updateDocument('delivered', 'orders', this.order.$id,
                  {
                      statut:state,
                  }).then(() => { 
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='success'
                      this.snackbarText= 'success'
                      this.order.statut = state 


                  const data =  this.globalProducts.map(item => ({
                      rejected:item.model[0].rejected,
                      complited:item.model[0].complited,
                      product_id:item.model[0].id,
                      variation_id:item.model[2].id,
                      stock:item.model[2].stock,
                      quantity:item.model[2].quantity
                  }))

              if(state == 'complited'){ 

                  data.forEach(item => { 
                      
                      db.updateDocument('delivered', 'products', item.product_id,
                      {
                          complited: Number(item.complited) + Number(item.quantity)
                      })
                      db.updateDocument('delivered', 'variations', item.variation_id,
                      {
                          stock: Number(item.stock) - Number(item.quantity)
                      })    
                  })
              }else if(state == 'rejected'){ 
                  db.updateDocument('delivered', 'products', item.product_id,
                      {
                          rejected: Number(item.rejected) + Number(item.quantity)
                      })
              }

              db.updateDocument('delivered', 'products', this.order.$id,
                  {
                      statut:state,
                  })

                  }).catch(err => { 
                      this.loadingBtn = false     
                      this.snackbar= true
                      this.snackbarColor ='error'
                      this.snackbarText= err
                  })
  },

  createOrder(){ 
      this.loadingBtn = true
      const produit = this.globalProducts.map(item => item.model.map(item => item.text)+' : '+item.model[2].quantity)
          
      if (this.editedIndex > -1) {
              Object.assign(this.orders[this.editedIndex], this.order)
              this.$axios.post('https://app.noest-dz.com/api/public/delete/order', {        
              api_token:this.order.api_token,
              user_guid: this.order.user_guid,
              tracking: this.order.tracking
              }).then(data => { 
                  this.$axios.post('https://app.noest-dz.com/api/public/create/order', {
              api_token:this.order.api_token,
              user_guid: this.order.user_guid,
              client: this.order.client,
              phone:this.order.phone,
              adresse:this.order.adresse,
              wilaya_id:Number(this.modelAddress[0].code) ,
              commune: this.modelAddress[1].text,
              montant:Number(this.order.montant) ,
              remarque:this.order.remarque,
              reference: '',
              phone_2: '',
              produit:JSON.stringify(produit),
              type_id: Number(this.order.type_id) ,
              poids:Number(this.order.poids) ,
              stop_desk:Number(this.order.stop_desk) ,})
              .then(data => { 
                  db.updateDocument('delivered', 'orders', this.order.$id,
                  { client: this.order.client,
                    phone:this.order.phone,
                    adresse:this.order.adresse,
                    wilaya_id:Number(this.modelAddress[0].code) ,
                    commune: this.modelAddress[1].text,
                    address_model: JSON.stringify(this.modelAddress),
                    montant:Number(this.order.montant) ,
                    remarque:this.order.remarque,
                    produit:JSON.stringify(produit),
                    produit_model: JSON.stringify(this.globalProducts),
                    type_id: Number(this.order.type_id) ,
                    poids:Number(this.order.poids) ,
                    stop_desk:Number(this.order.stop_desk) ,
                    api_token:this.order.api_token,
                    statut:'panding',
                    tracking:data.data.tracking
                  }).then(() => { 
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='success'
                      this.snackbarText= 'success'
                  }).catch(err => { 
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='error'
                      this.snackbarText= err
                  })
              }).catch(err => { 
                      this.loadingBtn = false
                      this.snackbar= true
                      this.snackbarColor ='error'
                      this.snackbarText= err
              })

              }).catch(err => { 
                  this.loadingBtn = false
                  this.snackbar= true
                  this.snackbarColor ='error'
                  this.snackbarText= err
              })

             
          } else {
              this.$axios.post('https://app.noest-dz.com/api/public/create/order', {

              api_token:this.order.api_token,
              user_guid: this.$store.state.auth.user.user_guid,
              client: this.order.client,
              phone:this.order.phone,
              adresse:this.order.adresse,
              wilaya_id:Number(this.modelAddress[0].code) ,
              commune: this.modelAddress[1].text,
              montant:Number(this.order.montant) ,
              remarque:this.order.remarque,
              reference: '',
              phone_2: '',
              produit:JSON.stringify(produit),
              type_id: Number(this.order.type_id) ,
              poids:Number(this.order.poids) ,
              stop_desk:Number(this.order.stop_desk) ,
              }).then((data) => {

                  db.createDocument('delivered', 'orders', 'unique()', {
                        client: this.order.client,
                        phone:this.order.phone,
                        adresse:this.order.adresse,
                        wilaya_id:Number(this.modelAddress[0].code)  ,
                        commune:this.modelAddress[1].text,
                        address_model: JSON.stringify(this.modelAddress),
                        montant:Number(this.order.montant) ,
                        remarque:this.order.remarque,
                        produit:JSON.stringify(produit),
                        produit_model: JSON.stringify(this.globalProducts),
                        type_id: Number(this.order.type_id) ,
                        poids:Number(this.order.poids) ,
                        stop_desk:Number(this.order.stop_desk) ,
                        api_token:this.order.api_token,
                        user_id: this.$store.state.auth.user.$id,
                        user_guid: this.$store.state.auth.user.user_guid,
                        tracking:data.data.tracking,
                        statut:'panding',
                      })
                      .then((data) => { 
                          this.loadingBtn = false
                          this.snackbar= true
                          this.snackbarColor ='success'
                          this.snackbarText= 'success'
                          this.DialogOrder = false
                          this.orders.push({...data})

                      }).catch(err => {
                          this.loadingBtn = false 
                          this.snackbar= true
                          this.snackbarColor ='error'
                          this.snackbarText= err
                      })
              }).catch(err => { 
                          this.loadingBtn = false
                          this.snackbar= true
                          this.snackbarColor ='error'
                          this.snackbarText= err
                      })

          }
        
  },


  initial(){
      
      const items = [{ header: 'Select an product or create one' }]
                  this.products.forEach(item => { 
                      items.push({id : item.id, text : item.text, img : item.img})
                  })
      this.globalProducts.push({items:items, model:[]})
  },
  remove(index) {
        
      this.globalProducts.splice(index, 1)
          
  },

  changeAddress(index, item){ 
      if(index != -1){ 
          this.modelAddress = [...this.modelAddress , item]
      }
      if(this.modelAddress.length == 0){ 
          this.itemsAddress = [{header: 'Select an wilaya or create one'}, ...wilaya] 
      }else if(this.modelAddress.length == 1){ 
          this.itemsAddress = [{header: 'Select an commune or create one'}]
          commune.filter(item => (item.wilaya_id == this.modelAddress[0].code)).forEach(item => { 
              this.itemsAddress.push(item)
          })
      }else if(this.modelAddress.length == 2){
          this.itemsAddress = []
      }
  },

  change (index, item, global) {
      if(index != -1){ 

          this.globalProducts[global].model = [...this.globalProducts[global].model , item]
      }
      if(this.globalProducts[global].model.length == 0){ 

        this.globalProducts[global].items = [{ header: 'Select an product or create one' }]
                  this.products.forEach(item => { 
                      this.globalProducts[global].items.push({id : item.id, text : item.text, img : item.img, rejected:item.rejected, complited:item.complited})
                  })
      }else if(this.globalProducts[global].model.length == 1){ 
                      this.globalProducts[global].items = [{ header: 'Select an color or create one' }]
                      this.variations.filter(item => (item.product_id == this.globalProducts[global].model[0].id)).forEach(item => { 
                          this.globalProducts[global].items.push({id : item.id, text : item.color, color : item.color})
                      })
      }else if(this.globalProducts[global].model.length == 2){ 
          this.globalProducts[global].items = [{ header: 'Select an size or create one' }]
                      this.variations.filter(item => (item.product_id == this.globalProducts[global].model[0].id && item.color == this.globalProducts[global].model[1].text )).forEach(item => { 
                          this.globalProducts[global].items.push({id : item.id, text : item.size, price : item.price, stock : item.stock, quantity : 1 })
                      })
      }else if (this.globalProducts[global].model.length == 3){ 
          this.globalProducts[global].items = []
          // alert(JSON.stringify(this.globalProducts))
          
          
      }else{ 
          this.change(-1, null, global)  
      }
  },

  filter (item, queryText, itemText) {
    if (item.header) return false

    const hasValue = val => val != null ? val : ''

    const text = hasValue(itemText)
    const query = hasValue(queryText)

    return text.toString()
      .toLowerCase()
      .indexOf(query.toString().toLowerCase()) > -1
  },

  getColor (data) {
      if (data == 'rejected') return 'red'
      else if (data == 'prossece') return 'orange'
      else if (data == 'complited') return 'green'
      else return 'gray'
    },

  statistics (){ 
      this.loadingBtn = true
      const orders = this.orders.filter(item => (((item.$createdAt == this.filterage.dateAfter || item.$createdAt == this.filterage.dateBefor) || (this.filterage.dateAfter > item.$createdAt && this.filterage.dateBefor < item.$createdAt))
      && this.filterage.user == item.user_id && this.filterage.api_token == item.api_token ))

      this.statisticsTotal = {
          nbOrderRejected:orders.filter(item => (item.statut == 'rejected')).length, montantRejected:orders.filter(item => (item.statut == 'rejected')).reduce((acc, item) => acc + Number(item.montant), 0),
          nbOrderComplited:orders.filter(item => (item.statut == 'complited')).length, montantComplited:orders.filter(item => (item.statut == 'complited')).reduce((acc, item) => acc + Number(item.montant), 0),
          nbOrderProcess:orders.filter(item => (item.statut == 'process')).length, montantProcess:orders.filter(item => (item.statut == 'process')).reduce((acc, item) => acc + Number(item.montant), 0),
          nbOrderPanding:orders.filter(item => (item.statut == 'panding')).length, montantPanding:orders.filter(item => (item.statut == 'panding')).reduce((acc, item) => acc + Number(item.montant), 0),
      } 
      this.loadingBtn = false
  }  

},
}
</script>