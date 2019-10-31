<template>
  <div class="card floating" id="share">
    <div class="card-title">
      <h2>{{ $t('buttons.share') }}</h2>
    </div>

    <div class="card-content">
      <div class="user-role-select">
        <ul id="user-role-list">
          <li>
            <autocomplete
              :search="search"
              :autoSelect="true"
              placeholder="Search User"
              @submit="saveUser"
            ></autocomplete>
            <select v-model="role" :aria-label="$t('role.input')">
              <option value="READ" >{{ $t('role.read') }}</option>
            </select>
            <button class="action"
              @click="submit"
              :aria-label="$t('buttons.create')"
              :title="$t('buttons.create')"><i class="material-icons">add</i></button>
          </li>
        </ul>
      </div>
      <hr/>
      <edit-permission-list></edit-permission-list>
    </div>

    <div class="card-action">
      <button class="button button--flat"
        @click="$store.commit('closeHovers')"
        :aria-label="$t('buttons.close')"
        :title="$t('buttons.close')">{{ $t('buttons.close') }}</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { share as api, users as usersApi } from '@/api'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import EditPermissionList from '../common/EditPermissionList'
import moment from 'moment'
import '@trevoreyre/autocomplete-vue/dist/style.css'


export default {
  name: 'share',
  components: {
    Autocomplete,
    EditPermissionList
  },
  data: function () {
    return {
      role: 'READ',
      searchText: '',
      user:'',
    }
  },
  computed: {
    ...mapState([ 'req', 'selected', 'selectedCount' ]),
    ...mapGetters([ 'isListing' ]),
    selectedItem() {
      return this.req.items[this.selected[0]];
    }
  },
  async beforeMount () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    saveUser(user) {
      this.user = user;
    },
    submit: async function () {
      if (!this.role) return
      if (!this.user) return
      
      try {
        await api.create(this.selectedItem.id, this.user.id, this.role);
      } catch (e) {
        this.$showError(e)
      }
    },
    async search(input) {
      if (input.length < 2) { return [] }
      const res = await usersApi.searchUserByName(input);
      const users = res.data.users;
      if (users) {
        const names = users.map(user => {
          return {name: `${user.firstName} ${user.lastName}`, mail: user.mail, id: user.id};
        });
        return names;
      }
      return [];
    },
    humanTime (time) {
      return moment(time * 1000).fromNow()
    }
  }
}
</script>
