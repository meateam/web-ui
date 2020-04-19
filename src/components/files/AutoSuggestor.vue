<template>
  <div class="select-approvers">
    <div class="autosuggest-container">
      <vue-autosuggest
        v-model="currValue"
        :suggestions="suggestions"
        @input="fetchResults"
        @selected="onSelected"
        :input-props="inputProps"
      >
        <template slot-scope="{ suggestion }">
          <span v-if="isExternal" >
            {{ suggestion.item.hierarchy }} :
            {{ suggestion.item.full_name }}
          </span>
          <span v-if="!isExternal">
            {{ suggestion.item.hierarchyFlat }} :
            {{ suggestion.item.fullName }}
          </span>
        </template>
      </vue-autosuggest>
    </div>
  </div>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
import { users as usersApi, delegators as delegatorsApi } from "@/api";
import { minAutoComplete } from "@/utils/constants";
import { debounceTime } from "@/utils/constants";

export default {
  name: "my-autosuggestor",
  components: {
    VueAutosuggest
  },
  props: {
    isExternal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      debounce: asyncDebouncer(
        this.isExternal ? this.fetchExternal : this.fetchInternal,
        debounceTime
      ),
      currValue: "",
      selected: "",
      selectedList: [],
      suggestions: [],
      timeout: null,
      input: null,
      inputProps: {
        id: "autosuggest__input",
        onInputChange: this.fetchResults,
        placeholder: this.$t("exShare.searchUser"),
        class: "form-control"
      }
    };
  },
  methods: {
    onSelected(item) {
      this.selected = item.item;
      this.submitSelected();
      this.suggestions = [];
      this.currValue = "";
    },
    async fetchResults(input) {
      if (input.length < minAutoComplete) {
        this.suggestions = [];
        return [];
      }
      this.input = input;
      return await this.debounce();
    },
    async fetchExternal() {
      const res = await delegatorsApi.searchUserByName(this.input);
      const users = res.data.users;
      if (users) {
        this.suggestions = [{ data: users }];
      }
      return users ? users : [];
    },
    async fetchInternal() {
      const res = await usersApi.searchUserByName(this.input);
      const users = res.data.users;
      if (users) {
        this.suggestions = [{ data: users }];
      }
      return users ? users : [];
    },
    submitSelected() {
      if (!this.selected) return;
      this.$emit("select", { value: this.selected });
      document.getElementById("autosuggest__input").value = "";
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
.demo {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

input {
  width: 260px;
  padding: 0.5rem;
}

.autosuggest-container {
  display: flex;
  justify-content: center;
  width: 480px;
}

#autosuggest {
  width: 100%;
  display: block;
}
.autosuggest__results-item--highlighted {
  background-color: rgba(51, 217, 178, 0.2);
}

.autosuggest__results-item {
  margin: 10px;
}

#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  font-family: monospace;
  /* font-size: 20px; */
  border: 1px solid #616161;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
  overflow: scroll;
  max-height: 200px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  /* font-size: 11px; */
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #ddd;
}
</style>
