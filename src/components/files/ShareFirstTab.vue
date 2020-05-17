<template>
  <div class="card-content">
    <div class="user-role-select">
      <div class="autocomplete">
        <autocomplete v-on:onSelect="saveUser($event)"></autocomplete>
        <b-select class="space-div" v-model="role" :aria-label="$t('role.input')" rounded>
          <option value="READ">{{ $t("role.read") }}</option>
          <option value="WRITE">{{ $t("role.write") }}</option>
        </b-select>
      </div>
      <b-button
        type="is-dark"
        rounded
        class="add-button"
        @click="submit"
        :aria-label="$t('buttons.create')"
        :title="$t('buttons.create')"
      >
        <p>{{$t("buttons.share")}}</p>
      </b-button>
    </div>
    <edit-permission-list :id="selectedItem.id" ref="editPermissionList"></edit-permission-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { debounceTime } from "@/utils/constants";
import { Roles, minAutoComplete } from "@/utils/constants";
import { share as shareApi, users as usersApi } from "@/api";

import EditPermissionList from "../common/EditPermissionList";
import Autocomplete from "../shared/Autocomplete";

export default {
  name: "share-first-tab",
  components: {
    EditPermissionList,
    Autocomplete
  },
  props: [],
  data() {
    return {
      role: Roles.read,
      debounce: asyncDebouncer(this.searchWait, debounceTime)
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount"]),
    ...mapGetters(["selectedCount"]),
    selectedItem() {
      return this.req.items && this.selectedCount !== 0
        ? this.req.items[this.selected[0]]
        : this.req;
    }
  },
  methods: {
    async search(input) {
      if (input.length < minAutoComplete) {
        return [];
      }
      this.input = input;
      return await this.debounce();
    },
    // The function wich searches for the autocomplete,
    // called after the debouncer interval ends
    async searchWait() {
      const res = await usersApi.searchUserByName(this.input);
      const users = res.data.users;
      if (users) {
        return users;
      }
      return [];
    },
    getResultValue(result) {
      return `${result.firstName} ${result.lastName}`;
    },
    submit: async function() {
      if (!this.role) return;
      if (!this.user) return;

      try {
        await shareApi.create(this.selectedItem.id, this.user.id, this.role);
        this.$showSuccess(this.$t("success.shared", { user: this.getResultValue(this.user) }));
        this.$refs.editPermissionList.addUser(this.user);
      } catch (e) {
        this.$showError(e);
      }
      this.$refs.autocomplete.value = "";
    },
    saveUser(user) {
      this.user = user;
    },
    roleToIconName(roleName) {
      switch (roleName) {
        case Roles.read:
          return "remove_red_eye";
        case Roles.write:
          return "edit";
        default:
          return "remove_red_eye";
      }
    }
  }
};
// An async-debouncer function.
// The 'func' is called after the requested interval
function asyncDebouncer(func, interval) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise(resolve => {
      timer = setTimeout(() => resolve(func(...args)), interval);
    });
  };
}
</script>
<style scoped>
.autocomplete {
  display: flex;
}

.service-unavailable {
  padding: 35px;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
}

.service-unavailable p {
  margin: 55px 30px 22px 30px;
  font-size: 35px;
}

.service-unavailable .material-icons {
  font-size: 90px;
}

.add-button {
  margin-top: 15px;
  float: left;
  width: 114px;
  height: 44px;
  border-radius: 22px;
  box-shadow: 0px 3px 8px 0 rgba(44, 52, 72, 0.4);
  background-color: #2c3448;
}
</style>
