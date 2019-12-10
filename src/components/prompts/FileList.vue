<template>
  <div>
    <ul class="file-list">
      <li @click="select"
        @touchstart="touchstart"
        @dblclick="next"
        role="button"
        tabindex="0"
        :aria-label="item.name"
        :aria-selected="selected == item.id"
        :key="item.name" v-for="item in items"
        :data-id="item.id"
        :data-name="item.name">{{ item.name }}</li>
    </ul>

    <p>{{ $t('prompts.currentlyNavigating') }} <code>{{ nav }}</code>.</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { files } from '@/api'

const backwards = '..';

export default {
  name: 'file-list',
  data: function () {
    return {
      items: [],
      touches: {
        id: '',
        count: 0
      },
      selected: null,
      current: this.$store.getters.currentFolder,
      parents: []
    }
  },
  computed: {
    ...mapState([ 'req', 'path' ]),
    nav () {
      return decodeURIComponent(this.current.name || '/')
    }
  },
  mounted () {
    for (let i = 0; i < this.path.length - 1; i++) {
      this.parents.push({id: this.path[i].id, name: this.path[i].name});
    }

    // If we're showing this on a listing,
    // we can use the current request object
    // to fill the move options.
    if (this.req.kind === 'listing') {
      this.fillOptions(this.req)
      return
    }

    // Otherwise, we must be on a preview or editor
    // so we fetch the data from the previous directory.
    files.fetch(this.current.id)
      .then(this.fillOptions)
      .catch(e => this.$showError(e))
  },
  methods: {
    fillOptions (req) {
      // Sets the current path and resets
      // the current items.
      this.current = req.id ? { id: req.id, name: req.name } : { id: '', name: '' };
      this.items = [];

      this.$emit('update:selected', { 
        dest: {
          id: this.current.id,
          name: this.current.name
        },
        path: this.parents
      });

      // If the path isn't the root path,
      // show a button to navigate to the previous
      // directory.
      if (this.parents.length > 0) {
        this.items.push({
          name: backwards,
          id: this.parents[this.parents.length - 1].id
        })
      }

      // If this folder is empty, finish here.
      if (!req.items) return

      // Otherwise we add every directory to the
      // move options.
      for (let item of req.items) {
        if (!item.isDir) continue

        this.items.push({
          name: item.name,
          id: item.id
        })
      }
    },
    next: function (event) {
      // Retrieves the URL of the directory the user
      // just clicked in and fill the options with its
      // content.
      if (event.currentTarget.dataset.name === backwards) {
        this.parents.pop();
      } else {
        this.parents.push({ id: this.current.id, name: this.current.name });
      }

      let id = event.currentTarget.dataset.id

      files.fetch(id)
        .then(this.fillOptions)
        .catch(e => this.$showError(e))
    },
    touchstart (event) {
      let url = event.currentTarget.dataset.id

      // In 300 milliseconds, we shall reset the count.
      setTimeout(() => {
        this.touches.count = 0
      }, 300)

      // If the element the user is touching
      // is different from the last one he touched,
      // reset the count.
      if (this.touches.id !== url) {
        this.touches.id = url
        this.touches.count = 1
        return
      }

      this.touches.count++

      // If there is more than one touch already,
      // open the next screen.
      if (this.touches.count > 1) {
        this.next(event)
      }
    },
    select: function (event) {
      let parents = [...this.parents];
      if (parents.findIndex(parent => parent.id === this.current.id) < 0 ) {
        parents.push({ id: this.current.id, name: this.current.name });
      }  

      // If the element is already selected, unselect it.
      if (this.selected === event.currentTarget.dataset.id) {
        this.selected = null
        this.$emit('update:selected', {
          dest: {
            id: this.current.id,
            name: this.current.name
          },
          path: parents
        });
        return
      }

      // Otherwise select the element.
      this.selected = event.currentTarget.dataset.id
      const name = event.currentTarget.dataset.name == backwards ? '' : event.currentTarget.dataset.name;
      this.$emit('update:selected', {
        dest: {
          id: this.selected,
          name
        },
        path: parents
      });
    }
  }
}
</script>
