<template>
    <div>
      <h2 align="center">Share external user</h2>
      <v-stepper ref="stepper" :steps="steps" v-model="step"></v-stepper>

      <template v-if="step === 1">
        <div dir="direction">
          <h3>First Step - choose approvers</h3>
          <p :style="cssVars">The approvers selected will have reading permission on the file</p>
        </div>
        <div class="card-content">
          <div class="user-role-select">
            <ul id="user-role-list">
              <li>
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
                        <div class="share-title">
                          {{ getResultValue(result) }}
                        </div>
                        <div class="share-snippet">
                          {{ result.hierarchyFlat }}
                        </div>
                      </div>
                    </li>
                  </template>
                </autocomplete>

                <select
                  style="display:none;"
                  v-model="role"
                  :aria-label="$t('role.input')"
                >
                  <option value="READ">{{ $t("role.read") }}</option>
                </select>
                <button
                  class="action"
                  @click="submit"
                  :aria-label="$t('buttons.create')"
                  :title="$t('buttons.create')"
                >
                  <i class="material-icons">add</i>
                </button>
              </li>
            </ul>
          </div>
          <edit-permission-list :id="selectedItem.id" ref="editPermissionList">
          </edit-permission-list>
        </div>
      </template>
      <template v-if="step === 2">
        <div dir="direction">
          <h3>Second Step - choose approvers</h3>
        </div>
        <div class="card-content">
          <div class="user-role-select">
            <ul id="user-role-list">
              <li>
                <autocomplete
                  :search="search"
                  :autoSelect="true"
                  @submit="saveExUser"
                  :get-result-value="getResultValue"
                  :placeholder="$t('prompts.searchUser')"
                >
                  <template v-slot:result="{ result, props }">
                    <li v-bind="props" class="share-result">
                      <div>
                        <div class="share-title">
                          {{ getResultValue(result) }}
                        </div>
                        <div class="share-snippet">
                          {{ result.hierarchyFlat }}
                        </div>
                      </div>
                    </li>
                  </template>
                </autocomplete>

                <select
                  style="display:none;"
                  v-model="role"
                  :aria-label="$t('role.input')"
                >
                  <option value="READ">{{ $t("role.read") }}</option>
                </select>
                <button
                  class="action"
                  @click="submitExternal"
                  :aria-label="$t('buttons.create')"
                  :title="$t('buttons.create')"
                >
                  <i class="material-icons">add</i>
                </button>
              </li>
            </ul>
          </div>
          <ul id="example-1">
            <li v-bind:key="exUser.id" v-for="exUser in externalUsers">
              {{ exUser.fullName }}
              <button @click="removeExUser(exUser.id)">remove</button>
            </li>
          </ul>
        </div>
      </template>
      <template v-if="step === 3">
        <div dir="direction">
          <h3>Third Step - add info</h3>
        </div>
        <div class="card-content">
          <textarea id="infoText" class="textbox" rows="4" cols="50" v-model="textData"></textarea>
        </div>
      <form>
        <p>Choose classification:</p>
        <select id="mySelect">
          <option v-bind:key="c"  v-for="c in classifications">{{ c }}</option>

        </select>
      </form>

        <button class="final-button" @click="createShare">Request Share</button>
      </template>

      <button type="button" @click="$refs.stepper.previous()">Previous</button>
      <button type="button" @click="$refs.stepper.next()">Next</button>
      <button type="button" @click="$refs.stepper.reset()">Reset</button>
    </div>
</template>

<script>
import { VStepper } from "vue-stepper-component";

import { mapState, mapGetters } from "vuex";
import { share as shareApi, users as usersApi } from "@/api";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { minAutoComplete } from "@/utils/constants";
import EditPermissionList from "../common/EditPermissionList";
import moment from "moment";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "share-external",
  components: {
    VStepper,
    Autocomplete,
    EditPermissionList
  },
  data: function() {
    return {
      steps: 3,
      step: undefined,
      role: "READ",
      searchText: "",
      user: "",
      currExUser: "",
      externalUsers: [],
      textData: "",
      classifications: ["S", "TS", "VVS", "NVS"]
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount"]),
    ...mapGetters(["isListing", "direction"]),
    selectedItem() {
      return this.req.items[this.selected[0]];
    }
  },
  async beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    saveUser(user) {
      this.user = user;
    },
    saveExUser(user) {
      this.currExUser = user;
      console.log('saving');
      console.log(user);
    },
    submit: async function() {
      if (!this.role) return;
      if (!this.user) return;

      try {
        await shareApi.create(this.selectedItem.id, this.user.id, this.role);
        this.$showSuccess(
          `successfully shared with ${this.getResultValue(this.user)}`
        );
        this.$refs.editPermissionList.addUser(this.user);
      } catch (e) {
        this.$showError(e);
      }
    },
    submitExternal: async function() {
      let exists = false;
      if(!this.currExUser.id){
        return
      }
      console.log(this.externalUsers);
      this.externalUsers.forEach(user => {
        if(user.id === this.currExUser.id) {
          exists = true;
          console.log(user.firstName + ' already exists.')
        }
      })
      if(!exists){
        console.log('adding user');
        console.log(this.currExUser)
        // TODO: submit external user
        this.externalUsers.push(this.currExUser);
        console.log(this.externalUsers);
      }

    },
    removeExUser(id) {
      this.externalUsers = this.externalUsers.filter(exUser => {
        return exUser.id != id
      })
    },
    async search(input) {
      if (input.length < minAutoComplete) {
        return [];
      }
      const res = await usersApi.searchUserByName(input);
      const users = res.data.users;
      if (users) {
        return users;
      }
      return [];
    },
    humanTime(time) {
      return moment(time * 1000).fromNow();
    },
    getResultValue(result) {
      return `${result.firstName} ${result.lastName}`;
    },
    createShare() {
      console.log(this.textData);
      this.textData = document.getElementById("infoText").value;
      console.log(this.textData);
    },
    cssVars() {
      return {
        '--direction': 'ltr'
      }
    }
  }
};
</script>

<style scoped>
h3 {
  text-align: center;
}

p {
  direction: var(--direction);
}

select {
  margin-bottom: 10px;
}
option {
  margin-top: 22px;
}

button, select {
  color: #444444;
    background: #F3F3F3;
    border: 1px #DADADA solid;
    padding: 5px 10px;
    border-radius: 2px;
    font-weight: bold;
    font-size: 9pt;
    outline: none;
}

button:hover {
    border: 1px #C6C6C6 solid;
    box-shadow: 1px 1px 1px #EAEAEA;
    color: #333333;
    background: #F7F7F7;
}

button:active {
    box-shadow: inset 1px 1px 1px #DFDFDF;   
}

li {
  margin: 5px;
  color: red;
}

.textbox {
  background-color: blanchedalmond;
  height: 100px;
  width: 370px;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 5px;
  max-width: 370px;
  max-height: 600px;
}

#app {
  min-width: 200px;
  margin: 0 auto;
}

.share-result {
  min-width: 100px;
  padding: 5px;
  background: transparent;
}

.share-result:hover {
  background: #bdddf0;
}

.share-title {
  font-size: 20px;
  margin-bottom: 1px;
  margin-top: 1px;
  margin-right: 10px;
}

.share-snippet {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
