<template>
    <button :aria-label="$t('buttons.selectMultiple')" :title="$t('buttons.selectMultiple')" class="action" @click="toggleSelect">
        <i class="material-icons">check_circle</i>
        <span>{{ $t('buttons.select') }}</span>
    </button>
</template>

<script>
export default {
    name: 'select-button',
    data () {
        return {
            toggled: false
        };
    },
    methods: {
        toggleSelect () {
            this.toggled = !this.toggled;
            this.$store.commit('multiple', this.toggled);
        }
    }
}
</script>