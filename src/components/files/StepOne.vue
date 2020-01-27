<template>
    <div class="step1">
        <p>Choose external users:</p>
        <my-autosuggestor :isExternal="external" @select="addExUser"></my-autosuggestor>

          <ul id="example-1">
            <li v-bind:key="exUser.id" v-for="exUser in externalUsers">
              {{ exUser.hierarchy }}
              <button @click="removeExUser(exUser.id)">{{$t('exShare.rmButton')}}</button>
            </li>
          </ul>
    </div>
</template>

<script>
    import AutoSuggestor from './AutoSuggestor'
    import {validationMixin} from 'vuelidate'
    import { mapState, mapMutations, mapGetters } from 'vuex'

    export default {
        components: {
            'my-autosuggestor': AutoSuggestor,
        },
        props: ['clickedNext', 'currentStep'],
        mixins: [validationMixin],
        data() {
            return {
                selected: '',
                externalUsers: [],
                external: false,
            }
        },
        computed: {
            ...mapGetters(["getGlobalExternalUsers"]),
            ...mapState(["globalExternalUsers", "direction"]),
            ...mapMutations([ "emptyGlobalExternalUsers", "addGlobalExternalUser", "removeGlobalExternalUser" ]),
        },
        activated: function() {
            console.log('activated');
            if(this.$store.getters.getGlobalExternalUsers == 0) {
                this.$emit('can-continue', {value: false});
            } else{
                this.$emit('can-continue', {value: true});
            }
        },
        methods: {
            addExUser(user) {
                if(user.value && user.value.id) {
                    if(this.checkExists(user.value.id)) {
                        console.log(user.value.hierarchy + ' exists')
                        return;
                    }
                }
                console.log(user.value.hierarchy + ' added')
                this.$store.commit("addGlobalExternalUser", user.value);
                this.externalUsers.push(user.value);
                this.$emit('can-continue', {value: true});
            },
            removeExUser(id) {
                this.externalUsers = this.externalUsers.filter(exUser => {
                    return exUser.id != id
                })
                this.$store.commit("removeGlobalExternalUser", id);
                if(this.externalUsers == 0) {
                    this.$emit('can-continue', {value: false});
                }
            },
            checkExists(id) {
                let exists = false;
                if(!id){
                    return false
                }
                this.externalUsers.forEach(user => {
                    if(user.id === id) {
                        exists = true;
                    }
                })
                return exists;
            }
        }
    }
</script>
<style>
    .step1{
        margin: 10px;
        min-height: 200px;
    }
</style>