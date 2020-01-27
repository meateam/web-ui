<template>
    <div class="step2">
        <p>Choose approvers:</p>
        <my-autosuggestor :isExternal="external" @select="submitApprover"></my-autosuggestor>

        <edit-approvers-list :id="selectedItem.id" @list-empty="xxx" ref="editApproversList">
        </edit-approvers-list>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import AutoSuggestor from './AutoSuggestor'
    import EditApproversList from "../common/EditApproversList";
    import { share as shareApi } from "@/api";

    export default {
        components: {
            'my-autosuggestor': AutoSuggestor,
            EditApproversList,
        },
        props: ['currentStep'],
        data() {
            return {
                external: false,
            }
        },
        computed: {    
            ...mapState(["req", "selected", "selectedCount", "approvers"]),
            selectedItem() {
                console.log(this.req.items);
                return this.req.items[this.selected[0]];
            }
        },
        activated: function() {
            console.log('activated2');
            if(this.$store.getters.getApprovers <= 0) {
                this.$emit('can-continue', {value: false});
            } else{
                this.$emit('can-continue', {value: true});
            }
        },
        methods: {
            xxx(val) {
                console.log('xxx');
                console.log(val)
                this.$emit('can-continue', {value: false});
            },
            submitApprover: async function(approver) {
                try {
                    this.$refs.editApproversList.addUser(approver.value);
                    const res = await shareApi.create(this.selectedItem.id, approver.value.id, this.role);
                    console.log(res);
                    this.$showSuccess(
                        `successfully shared with ${this.getResultValue(approver.value)}`
                    );
                    this.$emit('can-continue', {value: true});
                    // this.$emit('can-continue', {value: false});
                } catch (err) {
                    this.$showError(err);
                }
            },
            getResultValue(user) {
                return user.fullName;
            }
        },
        mounted() {
//            this.$emit('can-continue', {value: true})
        },
    }
</script>
<style>
    .step2 {
        margin: 10px;
        min-height: 400px;
    }
</style>
