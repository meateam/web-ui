<template>
  <autocomplete
    :search="search"
    :autoSelect="true"
    :get-result-value="getResultValue"
    :placeholder="$t('search.typeToSearch')"
  >
    <template v-slot:result="{ result, props }">
      <li v-bind="props" class="search-result" @click="onClick(result)">
        <div>
          <div class="result-name">{{ result.name }}</div>
          <span class="result-modified">{{ $t('files.lastModified') }} {{humanTime(result.updatedAt)}}</span>
          <div class="result-size">{{ $t('files.size') }} {{humanSize(result.size)}}</div>
        </div>
      </li>
    </template>
  </autocomplete>
</template>

<script>
import moment from 'moment';
import filesize from 'filesize';
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { search, files as filesApi } from "@/api";
import { checkMimeType, checkDocumentPreview } from '@/utils/constants';

import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "search",
  components: {
    Autocomplete
  },
  methods: {
    onClick(file) {
      this.$store.commit('pushFolder', { id: file.id, name: file.name });
      this.$store.commit('setReload', true);
      
      return;
    },
    async search(input) {
      if (!input) return [];
  
      const files = await search(input);
      if (!files) return [];

      return files;
    },
    getResultValue(result) {
      return result.name;
    },
    humanSize: function(size) {
      return size ? filesize(parseInt(size)) : filesize(parseInt(0));
    },
    humanTime: function(modified) {
      return moment(modified).fromNow();
    },
  }
};
</script>
<style scoped>
  .search-result {    
    min-width: 100px;
    padding: 5px;
    background: transparent;
  }

  .search-result:hover {
    background: #bdddf0;
  }

  .result-name {
    font-size: 20px;
    margin-bottom: 1px;
    margin-top: 1px;
    margin-right: 10px;
  }

  .result-info {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.54);
  }

  .result-size {
    font-size: 14px;
    left: 0px;
  }

  .result-modified {
    font-size: 14px;
    right: 0px;
  }
</style>
