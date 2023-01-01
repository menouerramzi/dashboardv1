<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app
      class="">
      <v-card v-show="!miniVariant" class="ma-2 rounded-l">
        <v-row class="ma-1">
          <v-col cols="8" class="py-3">
            <div class="text-caption">Welcome Back</div>
            <div class="text-h8">{{$store.state.auth.user.username}}</div>
          </v-col>
          <v-col cols="4" class="py-3">
            <v-card height="50" width="50" class="rounded-1">

              <v-img :src="require('@/static/laFormidable.jpg')" alt="logo" contain></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card>


      <v-list class="">
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact v-if="(($store.state.auth.user.role == 'admin' && (item.role > 0)) || $store.state.auth.user.role == 'validator' && (item.role > 100) || $store.state.auth.user.role == 'user' && (item.role > 110))">

            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon> mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>  
              Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app class="">

      <v-app-bar-nav-icon @click.stop="drawer =!drawer" />
      <v-toolbar-title>{{ $route.path }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-icon @click="darkMode">mdi-brightness-4 LOl</v-icon>



    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />

      </v-container>

    </v-main>
    <v-footer>
      <v-spacer></v-spacer>
      <div> 
        <span class="mx-2"> la formidable </span> <span> &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </v-footer>


  </v-app>
</template>

<script>
import { account } from '../appwrite';
export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-cube',
          title: 'Manage Orders',
          to: '/orders',
          role: 111
        },
        {
          icon: 'mdi-apps',
          title: 'Manage Products',
          to: '/products',
          role: 110
        },
        {
          icon: 'mdi-account-group',
          title: 'Manage Users',
          to: '/users',
          role: 100
        },
        {
          icon: 'mdi-api',
          title: 'Manage Apis',
          to: '/apis',
          role: 100
        },
      ],
      

    }
  },
  methods: {
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("useDarkTheme", this.$vuetify.theme.dark.toString())
    },
    logout(){ 

        localStorage.removeItem('cookieFallback')
        this.$store.commit('auth/SET_UserInfo', null)
        this.$router.push('/login')


    },
  },
  mounted() {
    const theme = localStorage.getItem("useDarkTheme");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else this.$vuetify.theme.dark = false;
    }
  }


}
</script>
