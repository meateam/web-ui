<template>
    <div>
      <h2 align="center">{{$t('exShare.header')}}</h2>
      <v-stepper ref="stepper" :steps="steps" v-model="step"></v-stepper>

      <template v-if="step === 1">
        <div dir="direction">
          <h3>{{$t('exShare.headerFS')}}</h3>
          <p direction="direction">{{$t('exShare.fsInfo')}}</p>
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
                  @click="submitApprover"
                  :aria-label="$t('buttons.create')"
                  :title="$t('buttons.create')"
                >
                  <i class="material-icons">add</i>
                </button>
              </li>
            </ul>
          </div>
          <edit-approvers-list :id="selectedItem.id" ref="editApproversList">
          </edit-approvers-list>
        </div>
      </template>
      <template v-if="step === 2">
        <div dir="direction">
          <h3>{{$t('exShare.headerSS')}}</h3>
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
              <button @click="removeExUser(exUser.id)">{{$t('exShare.rmButton')}}</button>
            </li>
          </ul>
        </div>
      </template>
      <template v-if="step === 3">
          <div dir="direction">
            <h3>{{$t('exShare.headerTS')}}</h3>
          </div>
          <div class="card-content">
            <textarea id="infoText" class="textbox" rows="4" cols="50" v-model="textData"></textarea>
          </div>
        <form>
          <p>{{$t('exShare.chooseClass')}}</p>
          <select id="classSelect">
            <option v-bind:key="c"  v-for="c in classifications">{{ c }}</option>

          </select>
        </form>

        <button class="final-button" @click="createShare">{{$t('exShare.reqShare')}}</button>
      </template>

      <button type="button" @click="$refs.stepper.previous()">{{$t('exShare.prevBtn')}}</button>
      <button type="button" @click="$refs.stepper.next()">{{$t('exShare.nextBtn')}}</button>
      <button type="button" @click="resetExShare()">{{$t('exShare.resetBtn')}}</button>
    </div>
</template>

<script>
import { VStepper } from "vue-stepper-component";

import { mapState, mapGetters } from "vuex";
import { share as shareApi, users as usersApi } from "@/api";
import { createExShare } from '@/api/exShare';
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { minAutoComplete } from "@/utils/constants";
import EditApproversList from "../common/EditApproversList";
import moment from "moment";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "share-external",
  components: {
    VStepper,
    Autocomplete,
    EditApproversList
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
      classifications: ["Secret", "TopSecret", "SuperSecret", "NonClassified"]
    };
  },
  computed: {
    ...mapState(["req", "selected", "selectedCount", "approvers"]),
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
    },
    submitApprover: async function() {
      if (!this.role) return;
      if (!this.user) return;

      try {
        await shareApi.create(this.selectedItem.id, this.user.id, this.role);
        this.$showSuccess(
          `successfully shared with ${this.getResultValue(this.user)}`
        );
        this.$refs.editApproversList.addUser(this.user);
      } catch (err) {
        this.$showError(err);
      }
    },
    submitExternal: async function() {
      // TODO: change to external user with delegation service
      let exists = false;
      if(!this.currExUser.id){
        return
      }
      this.externalUsers.forEach(user => {
        if(user.id === this.currExUser.id) {
          exists = true;
        }
      })
      if(!exists){
        this.externalUsers.push(this.currExUser);
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
    async createShare() {
      let info = document.getElementById("infoText").value;
      let classification = document.getElementById("classSelect").value;
      let exUsers = [];
      this.externalUsers.forEach(user => {
        exUsers.push({ id: user.id, full_name: user.fullName });
      })
      await createExShare(this.selectedItem.id, exUsers, classification, info, this.approvers)
      
    },
    resetExShare() {
      this.$store.commit("emptyApprovers");
      this.externalUsers = [];
      this.$refs.stepper.reset();
    }
  }
};
</script>

<style scoped>
h3 {
  text-align: center;
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
  max-height: 400px;
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
