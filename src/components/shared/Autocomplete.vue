<template>
  <b-autocomplete
    class="autocomplete"
    :data="data"
    :placeholder="$t('prompts.searchUser')"
    rounded
    field="fullName"
    :keep-first="true"
    icon="magnify"
    :loading="isFetching"
    @typing="getResults"
    @select="option => onSelect(option)"
  >
    <template slot-scope="props">
      <div v-if="!isExternal" class="share-result">
        <div class="share-title">{{ props.option.fullName }}</div>
        <div class="share-snippet">{{ props.option.hierarchyFlat }}</div>
      </div>
      <div v-if="isExternal" class="share-result">
        <div class="share-title">{{ props.option.full_name }}</div>
        <div class="share-snippet">{{ props.option.hierarchy }}</div>
      </div>
    </template>
    <template slot="empty">
      <div class="share-result">{{$t('search.noResults')}}</div>
    </template>
  </b-autocomplete>
</template>

<script>
import { minAutoComplete } from "@/utils/constants";
import { users as usersApi, delegators as delegatorsApi } from "@/api";
import debounce from "lodash/debounce";
export default {
  data() {
    return {
      data: [],
      isFetching: false
    };
  },
  props: {
    isExternal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getResultValue(result) {
      return `${result.firstName} ${result.lastName}`;
    },
    getResults: debounce(function(name) {
      if (name.length < minAutoComplete) {
        this.data = [];
        return;
      }
      this.isFetching = true;
      if (!this.isExternal) {
        usersApi
          .searchUserByName(name)
          .then(res => {
            this.data = [];
            res.data.users.forEach(item => this.data.push(item));
          })
          .finally(() => {
            this.isFetching = false;
          });
      } else {
        delegatorsApi
          .searchUserByName(name)
          .then(res => {
            this.data = [];
            res.data.users.forEach(item => this.data.push(item));
          })
          .finally(() => {
            this.isFetching = false;
          });
      }
    }, 500),
    onSelect(option) {
      this.$emit("onSelect", option);
    },
    fetchInternal() {}
  }
};
</script>

<style scoped>
.share-result {
  text-align: right;
}
.autocomplete {
  margin-left: 10px;
}
</style>