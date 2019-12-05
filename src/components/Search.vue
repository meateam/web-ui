<template>
  <autocomplete
    :search="search"
    :autoSelect="true"
    :get-result-value="getResultValue"
    :placeholder="$t('search.typeToSearch')"
  >
    <template v-slot:result="{ result, props }">
      <li v-bind="props" class="search-result" @click="onClick(result)">
        <div class="result-item">
          <div class="icon" :class="direction">
            <i class="material-icons">{{ icon(result) }}</i>
          </div>
          <div class="result-info" :class="direction"> 
            <div class="result-name">
              <span>{{ result.name }}</span>
            </div>
            <div class="result-modified" :class="direction">{{ $t('files.lastModified') }} {{humanTime(result.updatedAt)}}</div>
            <div class="result-size" :class="direction">{{ $t('files.size') }} {{humanSize(result.size)}}</div>
          </div>
          
        </div>
      </li>
    </template>
  </autocomplete>
</template>

<script>
import moment from 'moment';
import filesize from 'filesize';
import {mapGetters} from 'vuex';
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { search, files as filesApi } from "@/api";
import { checkMimeType, checkDocumentPreview } from '@/utils/constants';

import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "search",
  components: {
    Autocomplete
  },
  computed: {
    ...mapGetters(['direction'])
  },
  methods: {
    async onClick(file) {
      const ancestors = await filesApi.getAncestors(file.id);
      this.$store.commit('changeFolder', '');

      for (let i = 0; i < ancestors.length; i++) {
        this.$store.commit('pushFolder', { id: ancestors[i].id, name: ancestors[i].name });    
      }

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
    icon(file) {
      if (file.type === 'application/vnd.drive.folder') return 'folder';
      if (file.type.startsWith('image')) return 'insert_photo';
      if (file.type.startsWith('audio')) return 'volume_up';
      if (file.type.startsWith('video')) return 'movie';
      return 'insert_drive_file';
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

  .result-item {
    display: flex;
    align-items: center;
  }

  .result-name {
    font-size: 20px;
    margin-bottom: 1px;
  }

  .result-info {
    font-size: 14px;
  }

  .result-size {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.54);
  }

  .result-modified {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.54);
  }

  .result-info.rtl {
    right: 0px;
    margin-right: 0.5em;
  }

  .result-info.ltr {
    left: 0px;
    margin-left: 0.5em;
  }

  i {
    font-size: 2em;
  }

  .icon.ltr {
    margin-right: 0.5em;
  }

  .icon.rtl {
    margin-left: 0.5em;
  }
</style>
