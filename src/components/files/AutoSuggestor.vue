<template>
  <div class="select-approvers">
    <div class="autosuggest-container">
      <vue-autosuggest
        v-model="query"
        :suggestions="suggestions"
        @input="fetchResults"
        @selected="onSelected"
        :get-suggestion-value="getSuggestionValue"
        :input-props="inputProps"
      >
        <template slot-scope="{ suggestion }">
          <span v-if="isExternal" class="my-suggestion-item"
            >{{ suggestion.item.hierarchy }} :
            {{ suggestion.item.full_name }}</span
          >
          <span v-if="!isExternal" class="my-suggestion-item"
            >{{ suggestion.item.hierarchyFlat }} :
            {{ suggestion.item.fullName }}</span
          >
        </template>
      </vue-autosuggest>
      <button
        class="action"
        @click="submitSelected"
        :aria-label="$t('buttons.create')"
        :title="$t('buttons.create')"
      >
        <i class="material-icons">add</i>
      </button>
    </div>
  </div>
</template>

<script>
import { VueAutosuggest } from "vue-autosuggest";
import { users as usersApi, delegators as delegatorsApi } from "@/api";
import { minAutoComplete } from "@/utils/constants";

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
      query: "",
      selected: "",
      selectedList: [],
      suggestions: [],
      timeout: null,
      debounceMilliseconds: 500,
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
    },
    getSuggestionValue(suggestion) {
      if (this.isExternal) {
        return suggestion.item.hierarchy + " : " + suggestion.item.full_name;
      }
      return suggestion.item.hierarchyFlat + " : " + suggestion.item.fullName;
    },
    async fetchResults(input) {
      if (this.isExternal) {
        return this.fetchExternal(input);
      } else {
        const res = await this.fetchInternal(input);
        return res;
      }
    },
    submitSelected() {
      if (!this.selected) return;
      this.$emit("select", { value: this.selected });
    },
    async fetchExternal(input) {
      if (input.length < minAutoComplete) {
        this.suggestions = [];
        return [];
      }
      await delegatorsApi.searchUserByName(input);

      const res = await delegatorsApi.searchUserByName(input);
      const users = res.data.users;
      if (users) {
        this.suggestions = [{ data: users }];
      }
      return users ? users : [];
    },
    async fetchInternal(input) {
      if (input.length < minAutoComplete) {
        return [];
      }
      const res = await usersApi.searchUserByName(input);
      const users = res.data.users;
      if (users) {
        this.suggestions = [{ data: users }];
      }
      return users ? users : [];
    }
  }
};
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

ul {
  width: 100%;
  color: rgba(30, 39, 46, 1);
  list-style: none;
  margin: 0;
  padding: 0.5rem 0 0.5rem 0;
}
li {
  margin: 0 0 0 0;
  border-radius: 5px;
  padding: 0.75rem 0 0.75rem 0.75rem;
  display: flex;
  align-items: center;
}
li:hover {
  cursor: pointer;
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

body {
  /* max-width: 800px; */
  padding: 20px;
  margin-left: auto !important;
  margin-right: auto !important;
  font-family: monospace;
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

button,
select {
  color: #444444;
  background: #f3f3f3;
  border: 1px #dadada solid;
  padding: 5px 10px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 9pt;
  outline: none;
}

button:hover {
  border: 1px #c6c6c6 solid;
  box-shadow: 1px 1px 1px #eaeaea;
  color: #333333;
  background: #f7f7f7;
}

button:active {
  box-shadow: inset 1px 1px 1px #dfdfdf;
}
</style>
