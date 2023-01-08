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
                        Pending
                    </v-card-title>
                    <v-card-subtitle>
                        <span class="text-h5"> 
                            {{statisticsTotal.montantPending}} DA
                        </span>
                    </v-card-subtitle>
                    <v-card-text class="d-flex justify-space-between"> 
                        <span class="text-h8"> 
                            Montant
                        </span>
                        <span class="text-h8"> 
                            Orders: {{statisticsTotal.nbOrderPending}}
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
                        Completed
                    </v-card-title>
                    <v-card-subtitle>
                        <span class="text-h5"> 
                            {{statisticsTotal.montantCompleted}} DA
                        </span>
                    </v-card-subtitle>
                    <v-card-text class="d-flex justify-space-between"> 
                        <span class="text-h8"> 
                            Montant
                        </span>
                        <span class="text-h8"> 
                            Orders: {{statisticsTotal.nbOrderCompleted}}
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


        <!-- start mobile theme -->
        <div class="d-flex d-sm-none d-block"> 
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mx-4 mb-2 " @click="newOrder()">
                    + Create Order
            </v-btn>
        </div>
        <v-data-iterator
            :items="orders"
            :items-per-page.sync="itemsPerPage"
            :page.sync="page"
            :search="search"
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
            hide-default-footer
            class="mx-4 my-4 d-sm-none d-block"
            >
            
            <template v-slot:header>
                <v-toolbar
                dark
                color="blue darken-3"
                class="mb-1"
                >
                <v-text-field
                    v-model="search"
                    clearable
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                ></v-text-field>
                <template v-if="$vuetify.breakpoint.mdAndUp">
                    <v-spacer></v-spacer>
                    <v-select
                    v-model="sortBy"
                    flat
                    solo-inverted
                    hide-details
                    :items="keys"
                    prepend-inner-icon="mdi-magnify"
                    label="Sort by"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-btn-toggle
                    v-model="sortDesc"
                    mandatory
                    >
                    <v-btn
                        large
                        depressed
                        color="blue"
                        :value="false"
                    >
                        <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn
                        large
                        depressed
                        color="blue"
                        :value="true"
                    >
                        <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                    </v-btn-toggle>
                </template>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-row>
                <v-col
                    v-for="(item, index) in props.items"
                    :key="index"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                >
                
            <v-expansion-panels
            multiple
            >
                <v-expansion-panel>
                    <v-expansion-panel-header  >
                        
                        <v-span class="subheading font-weight-bold"> 
                            <v-badge
                                bottom
                                :color="getColor(item.statut)"
                                inline
                                dot
                            >

                            {{ item.client }}
                        </v-badge>
                    </v-span>
                    </v-expansion-panel-header>
                    <v-divider></v-divider>
                    <v-expansion-panel-content>
                   
                        <v-list dense>
                            <v-list-item
                            v-for="(key, index) in filteredKeys"
                            :key="index"
                            >
                            <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                                {{ key }}:
                            </v-list-item-content>
                            <v-list-item-content
                                class="align-end"
                                :class="{ 'blue--text': sortBy === key }"
                            >
                                {{ item[key.toLowerCase()] }}
                            </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                                    Actions:
                                </v-list-item-content>
                        
                                <v-icon   class="mr-5" @click="(readonly = true) , editItem(item)">
                                    mdi-eye
                                </v-icon>
                                <v-icon v-if="item.statut == 'pending'"  class="mr-5" @click="(readonly = false) ,editItem(item)">
                                    mdi-pencil
                                </v-icon>
                                <v-icon v-if="item.statut == 'pending'"  class="mr-5" @click="deleteItem(item)">
                                    mdi-delete
                                </v-icon>

                            </v-list-item>
                        </v-list>

                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

                </v-col>
                </v-row>
            </template>

            <template v-slot:footer>
                <v-row
                class="mt-2"
                align="center"
                justify="center"
                >
                <span class="grey--text">Items per page</span>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        text
                        color="primary"
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                    >
                        {{ itemsPerPage }}
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                    </template>
                    <v-list>
                    <v-list-item
                        v-for="(number, index) in itemsPerPageArray"
                        :key="index"
                        @click="updateItemsPerPage(number)"
                    >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <span
                    class="mr-4
                    grey--text"
                >
                    Page {{ page }} of {{ numberOfPages }}
                </span>
                <v-btn
                    
                    dark
                    color="blue darken-3"
                    class="mr-1"
                    @click="formerPage"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                    
                    dark
                    color="blue darken-3"
                    class="ml-1"
                    @click="nextPage"
                >
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                </v-row>
            </template>
            </v-data-iterator>

        <!-- end mobile theme -->











        <v-data-table 
        :headers="headers" 
        :items="orders" 
        :loading="loading"
        loading-text="Loading... Please wait" 
        :search="searchOrder" 
        sort-by="$createdAt"
        sort-desc
        class="elevation-1 rounded-xl d-none d-sm-block">
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
                                            <v-row> 
                                            <v-col cols="12" sm="6"> 
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

    </v-col>
    <v-col cols="12" sm="6"> 

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
                                                            <v-img :src="menu.img" contain></v-img>
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
                                    <v-btn v-if="(order.statut == 'pending')" :loading="loadingBtn" :disabled="loadingBtn" color="orange" text @click="validationOrder()">
                                        Valide
                                    </v-btn>
                                    <v-btn v-if="(order.statut == 'process')" :loading="loadingBtn" :disabled="loadingBtn" color="green" text @click="changeStateOrder('completed')">
                                        completed
                                    </v-btn>
                                    <v-btn v-if="(order.statut == 'process')" :loading="loadingBtn" :disabled="loadingBtn" color="red" text @click="changeStateOrder('rejected')">
                                        Rejected
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
            <template v-slot:item.user_id="{ item }">

                    {{ users?.find(user => (user.$id == item.user_id))?.username}}

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
                <v-icon v-if="item.statut == 'pending'" small class="mr-2" @click="(readonly = false) ,editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon v-if="item.statut == 'pending'" small class="mr-2" @click="deleteItem(item)">
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
            <template v-slot:body.append>
                <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <v-text-field
                    v-model="filterage.dateAfter" :value="filterage.dateAfter"
                    type="date"
                    label="After date"
                    ></v-text-field>
                </td>
                <td colspan="4"></td>
                </tr>
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
    users:[],
    statisticsTotal:{},

    // headers: [
    //             { text: 'User', value: 'user_id' },
    //             { text: 'Full Name', value: 'client' },
    //             { text: 'Phone', value: 'phone' },
    //             { text: 'Montant', value: 'montant' },
    //             { text: 'Statut', value: 'statut' },
    //             { text: 'Created at', value: '$createdAt',
    //             filter: value => {
    //                 if (!this.filterage.dateAfter) return true
    //                  return value < this.filterage.dateAfter
    //                 },
    //             },
    //             { text: 'Actions', value: 'actions', sortable: false },
    //         ],
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
    api: [{api_token:'OiHJO2UfRFlKRNWUJbg5L3hG0CEfQmnkDoW', name:'la fomidable',user_guid: 'TALH5G3I'}],
    DialogOrder:false,
    y: 0,




    itemsPerPageArray: [4, 8, 1000],
        filter: {},
        sortDesc: true,
        page: 1,
        itemsPerPage: 4,
        sortBy: '$createdAt',
        keys: [
          'phone',
          'montant',
          'statut',
        ],
  }),

  computed: {

    headers () {
        return [ 
                { text: 'User', value: 'user_id' },
                { text: 'Full Name', value: 'client' },
                { text: 'Phone', value: 'phone' },
                { text: 'Montant', value: 'montant' },
                { text: 'Statut', value: 'statut' },
                { text: 'Created at', value: '$createdAt',
                filter: value => {
                    if (!this.filterage.dateAfter) return true
                     return value > this.filterage.dateAfter
                    },
                },
                { text: 'Actions', value: 'actions', sortable: false },
        ] 
    },
        formTitle() {
            return this.editedIndex === -1 ? 'Create New Order' : this.readonly?'Order':'Edit Order'
        },
        numberOfPages () {
        return Math.ceil(this.orders.length / this.itemsPerPage)
        },
        filteredKeys () {
            return this.keys.filter(key => key !== 'Name')
        },
    },


  watch: {
    
  },
  mounted(){ 
      this.getDataInitial()
      this.statistics()
  },
  methods: {
    nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },

    async getDataInitial(){ 

        db.listDocuments('delivered', 'apis').then((data) => {
                this.api = data.documents
                if(this.api){ 
                    this.filterage.api_token = this.api[0].api_token
                }
        }) 
        let nbUsers = 0
        let loopUsers = true
        
        while(loopUsers){  
            await db.listDocuments('delivered', 'users', [Query.limit(25) , Query.offset(nbUsers)]).then((data) => {
                    this.users.push(...data.documents)
                    nbUsers = nbUsers + 1
                    loopUsers = data.total/25 > nbUsers
                    if(this.users){ 
                        this.filterage.user = this.users[0].$id
                    }
            }).catch(() => { 
                loopUsers = false
            })
        }

        let nbOrders = 0
        let loopOrders = true
        while(loopOrders){  
            await db.listDocuments('delivered', 'orders', [Query.limit(25) , Query.offset(nbOrders), Query.orderDesc('')]).then((data) => {
                    nbOrders = nbOrders + 1
                    loopOrders = data.total/25 > nbOrders
                    if(this.$store.state.auth.user.role == 'user'){ 
                        this.orders.push(...data.documents.filter(item => (item.user_id == this.$store.state.auth.user.$id )))
                    }else{ 
                        this.orders.push(...data.documents)
                    }
                    this.loading = false
            }).catch(() => { 
                    this.loading = false
                    loopOrders = false
            })
        }
        let nbProducts = 0
        let loopProducts = true
        while(loopProducts){ 

            await db.listDocuments('delivered', 'products', [Query.limit(25) , Query.offset(nbProducts)]).then((data) => {
                nbProducts = nbProducts + 1
                loopProducts = data.total/25 > nbProducts
                this.products.push(...data.documents.map(item => ({id:item.$id, text:item.name, img:item.imgUrl, rejected:item.rejected, completed:item.completed})))
            }).catch(() => { 
                loopProducts = false
            })
            if(!loopProducts){ 
                this.initial()
            }
        }
        let nbVariations = 0
        let loopVariations = true
        while(loopVariations){ 

           await db.listDocuments('delivered', 'variations', [Query.limit(25) , Query.offset(nbVariations)]).then((data) => {
                nbVariations = nbVariations + 1
                loopProducts = data.total/25 > nbVariations

                this.variations.push(...data.documents.map(item => ({
                            id:item.$id,
                            product_id:item.productID, 
                            color:item.colour, 
                            size:item.size,
                            stock:item.quantity,
                            price:item.price
                    })))
            }).catch(() => { 
                loopVariations = false
            })  
        }
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
                    this.changeStateOrder('process')
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
                        this.orders.splice(this.editedIndex, 1)
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

                            db.deleteDocument('delivered', 'orders', this.order.$id).then(()=>{
                            this.loadingBtn = false
                            this.dialogDelete = false
                            this.orders.splice(this.editedIndex, 1)
                        }).catch(err => { 
                            this.loadingBtn = false
                            this.snackbar= true
                            this.snackbarColor ='error'
                            this.snackbarText= err
                        })
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
                        completed:item.model[0].completed,
                        product_id:item.model[0].id,
                        variation_id:item.model[2].id,
                        stock:item.model[2].stock,
                        quantity:item.model[2].quantity
                    }))

                if(state == 'completed'){ 

                    data.forEach(item => { 
                        
                        db.updateDocument('delivered', 'products', item.product_id,
                        {
                            completed: Number(item.completed) + Number(item.quantity)
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
        this.order.user_guid = this.api.find(item => (item.api_token == this.order.api_token)).user_guid
        if(this.modelAddress[0]){ 
            
            if(this.order.stop_desk == 0 ){ 
                this.order.montantNet = Number(this.order.montant) - Number(this.modelAddress[0].livrasion)
            }else{ 
                this.order.montantNet = Number(this.order.montant) - Number(this.modelAddress[0].desk)
            }
        }
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
                      montantNet:Number(this.order.montantNet) ,
                      remarque:this.order.remarque,
                      produit:JSON.stringify(produit),
                      produit_model: JSON.stringify(this.globalProducts),
                      type_id: Number(this.order.type_id) ,
                      poids:Number(this.order.poids) ,
                      stop_desk:Number(this.order.stop_desk) ,
                      api_token:this.order.api_token,
                      statut:'pending',
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
                          montantNet:Number(this.order.montantNet) ,
                          remarque:this.order.remarque,
                          produit:JSON.stringify(produit),
                          produit_model: JSON.stringify(this.globalProducts),
                          type_id: Number(this.order.type_id) ,
                          poids:Number(this.order.poids) ,
                          stop_desk:Number(this.order.stop_desk) ,
                          api_token:this.order.api_token,
                          user_id: this.$store.state.auth.user.$id,
                          user_guid: this.order.user_guid,
                          tracking:data.data.tracking,
                          statut:'pending',
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
                        this.globalProducts[global].items.push({id : item.id, text : item.text, img : item.img, rejected:item.rejected, completed:item.completed})
                    })
        }else if(this.globalProducts[global].model.length == 1){ 
                        this.globalProducts[global].items = [{ header: 'Select an color or create one' }]
                        this.variations.filter(item => (item.product_id == this.globalProducts[global].model[0].id)).forEach(item => { 
                            this.globalProducts[global].items.push({id : item.id, text : item.color, color : item.color})
                        })
        }else if(this.globalProducts[global].model.length == 2){ 
            this.globalProducts[global].items = [{ header: 'Select an size or create one' }]
                        this.variations.filter(item => (item.product_id == this.globalProducts[global].model[0].id && item.color == this.globalProducts[global].model[1].text )).forEach(item => { 
                            this.globalProducts[global].items.push({id : item.id, text : item.size, price : item.price, stock: item.stock, quantity: 1 })
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
        else if (data == 'process') return 'orange'
        else if (data == 'completed') return 'green'
        else return 'gray'
      },

    statistics (){ 
        this.loadingBtn = true
        const orders = this.orders.filter(item => (((item.$createdAt == this.filterage.dateAfter || item.$createdAt == this.filterage.dateBefor) || (this.filterage.dateAfter > item.$createdAt && this.filterage.dateBefor < item.$createdAt))
        && this.filterage.user == item.user_id && this.filterage.api_token == item.api_token ))

        this.statisticsTotal = {
            nbOrderRejected:orders.filter(item => (item.statut == 'rejected')).length, montantRejected:orders.filter(item => (item.statut == 'rejected')).reduce((acc, item) => acc + Number(item.montantNet), 0),
            nbOrderCompleted:orders.filter(item => (item.statut == 'completed')).length, montantCompleted:orders.filter(item => (item.statut == 'completed')).reduce((acc, item) => acc + Number(item.montantNet), 0),
            nbOrderProcess:orders.filter(item => (item.statut == 'process')).length, montantProcess:orders.filter(item => (item.statut == 'process')).reduce((acc, item) => acc + Number(item.montantNet), 0),
            nbOrderPending:orders.filter(item => (item.statut == 'pending')).length, montantPending:orders.filter(item => (item.statut == 'pending')).reduce((acc, item) => acc + Number(item.montantNet), 0),
        } 
        this.loadingBtn = false
    }  

  },
}
</script>