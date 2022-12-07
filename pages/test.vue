<template>
    <v-container fluid>
      <v-btn @click="initial"> 
        + add product
      </v-btn>
      <div v-for="(globalProduct, global) in globalProducts" :key="(global)"> 
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
      >
        <template v-slot:no-data>
          <!-- <v-list-item>
            <span class="subheading">Create</span>
            <v-chip
              :color="`${colors[nonce - 1]} lighten-3`"
              label
              small
            >
              {{ search }}
            </v-chip>
          </v-list-item> -->
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
            <v-icon 
              small
              @click="parent.selectItem(item), change(-1,item, global)"
            >
              $delete
            </v-icon>
          </v-chip>
        </template>
        <template v-slot:item="{ index, item }">
            <v-list-item @click.stop="change(index, item, global)"> 
                <!--             
                <v-text-field
                  v-if="editing === item"
                  v-model="editing.text"
                  autofocus
                  flat
                  background-color="transparent"
                  hide-details
                  solo
                  @keyup.enter="edit(index, item)"
                ></v-text-field> -->
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
      
                      <!-- <v-btn
                        icon
                        @click.stop.prevent="edit(index, item)"
                      >
                        <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
                      </v-btn> -->
                      
                      <v-btn v-if="(globalProduct.model.length == 0)"
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
                <v-list>
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
  </template>

<script>

export default {
  data: () => ({
    globalProducts:[],

    products:[
        {id:1,text:'t-shert',img: 'https://cdn.vuetifyjs.com/images/john.png'},
        {id:2,text:'hidjab',img: 'https://cdn.vuetifyjs.com/images/john.png'}
    ],
    variations:[{id:1,color:'red',size:'s'},{id:1,color:'black',size:'s'},{id:1,color:'red',size:'xl'},{id:2,color:'red',size:'s'}],
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    editing: null,
    editingIndex: -1,
    nonce: 1,
    menu: null,
    dialog:false,
    x: 0,
    search: null,
    y: 0,
  }),

  watch: {
    // model (val, prev) {
    //   if (val.length === prev.length) return

    //   this.model = val.map(v => {
    //     if (typeof v === 'string') {
    //       v = {
    //         text: v,
    //         color: this.colors[this.nonce - 1],
    //         img: 'https://cdn.vuetifyjs.com/images/john.png'
    //       }

    //       this.items.push(v)

    //       this.nonce++
    //     }

    //     return v
    //   })
    // },
  },
  mounted(){ 
    this.initial()
  },

  methods: {
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
    change (index, item, global) {
        if(index != -1){ 

            this.globalProducts[global].model = [...this.globalProducts[global].model , item]
        }
        if(this.globalProducts[global].model.length == 0){ 

          this.globalProducts[global].items = [{ header: 'Select an product or create one' }]
                    this.products.forEach(item => { 
                        this.globalProducts[global].items.push({id : item.id, text : item.text, img : item.img})
                    })
        }else if(this.globalProducts[global].model.length == 1){ 
                        this.globalProducts[global].items = [{ header: 'Select an color or create one' }]
                        this.variations.filter(item => (item.id == this.globalProducts[global].model[0].id)).forEach(item => { 
                            this.globalProducts[global].items.push({id : item.id, text : item.color, color : item.color})
                        })
        }else if(this.globalProducts[global].model.length == 2){ 
            this.globalProducts[global].items = [{ header: 'Select an size or create one' }]
                        this.variations.filter(item => (item.id == this.globalProducts[global].model[0].id && item.color == this.globalProducts[global].model[1].text )).forEach(item => { 
                            this.globalProducts[global].items.push({id : item.id, text : item.size})
                        })
        }else if (this.globalProducts[global].model.length == 3){ 
            this.globalProducts[global].items = []
            
        }
    },

    // edit (index, item) {
    //   if (!this.editing) {
    //     this.editing = item
    //     this.editingIndex = index
    //   } else {
    //     this.editing = null
    //     this.editingIndex = -1
    //   }
    // },

    filter (item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
  },
}
</script>