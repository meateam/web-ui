<template>
  <div class="card-content">
    <div class="user-role-select">
      <ul id="user-role-list">
        <li>
          <div class="autocomplete">
            <autocomplete
              :search="search"
              :autoSelect="true"
              @submit="saveUser"
              :get-result-value="getResultValue"
              :placeholder="$t('prompts.searchUser')"
            >
              <template v-slot:result="{ result, props }">
                <li v-bind="props" class="share-result">
                  <div>
                    <div class="share-title">{{ getResultValue(result) }}</div>
                    <div class="share-snippet">{{ result.hierarchyFlat }}</div>
                  </div>
                </li>
              </template>
            </autocomplete>
          </div>
          <select class="space-div" v-model="role" :aria-label="$t('role.input')">
            <option value="READ">{{ $t("role.read") }}</option>
            <option value="WRITE">{{ $t("role.write") }}</option>
          </select>
          <i class="material-icons select-icon">{{roleToIconName(role)}}</i>
          <button
            class="action blink add-button"
            @click="submit"
            :aria-label="$t('buttons.create')"
            :title="$t('buttons.create')"
          >
            <i class="material-icons">add</i>
          </button>
        </li>
      </ul>
    </div>
    <edit-permission-list :id="selectedItem.id" ref="editPermissionList"></edit-permission-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { debounceTime } from "@/utils/constants";
import { Roles, minAutoComplete } from "@/utils/constants";
import { share as shareApi, users as usersApi } from "@/api";
import EditPermissionList from "../common/EditPermissionList";

export default {
  name: "first-tab",
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
        this.$showSuccess(
          this.$t("success.shared", { user: this.getResultValue(this.user) })
        );
        this.$refs.editPermissionList.addUser(this.user);
      } catch (e) {
        this.$showError(e);
      }
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
<style>
.space-div {
  margin: 10px;
  margin-left: 2px;
  padding-left: 30px;
  height: 35px;
}
.title {
  text-align: center;
}

.share-result {
  padding: 5px;
  background: transparent;
}

.share-result:hover {
  background: #bdddf0;
}

.autocomplete {
  flex-grow: 1;
}

.select-icon {
  margin-right: -45px;
  margin-left: 28px;
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

button.add-button {
  color: rgb(16, 74, 100);
  background-color: rgb(173, 214, 233);
  margin-right: 15px;
}

button.add-button:hover {
  color: rgb(16, 74, 100);
  background-color: rgb(173, 214, 255);
}

</style>
