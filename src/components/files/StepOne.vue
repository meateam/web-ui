<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <p>Choose approver:</p>
        <my-autosuggestor :isExternal="external" @select="trigger"></my-autosuggestor>
    </div>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required, email} from 'vuelidate/lib/validators'
    import AutoSuggestor from './AutoSuggestor'

    export default {
        components: {
            'my-autosuggestor': AutoSuggestor
        },
        props: ['clickedNext', 'currentStep'],
        mixins: [validationMixin],
        data() {
            return {
                external: false,
                form: {
                    username: '',
                    demoEmail: '',
                    message: ''
                }
            }
        },
        validations: {
            form: {
                username: {
                    required
                },
                demoEmail: {
                    required,
                    email
                },
                message: {
                    required
                }
            }
        },
        watch: {
            $v: {
                handler: function (val) {
                     this.$emit('can-continue', {value: true});
                    if(!val.$invalid) {
                        this.$emit('can-continue', {value: true});
                    } else {
                        // this.$emit('can-continue', {value: false});
                        setTimeout(()=> {
                            this.$emit('change-next', {nextBtnValue: false});
                        }, 3000)
                    }
                },
                deep: true
            },
            clickedNext(val) {
                // console.log(val);
                if(val === true) {
                    this.$v.form.$touch();
                }
            }
        },
        mounted() {
            if(!this.$v.$invalid) {
                this.$emit('can-continue', {value: true});
            } else {
                this.$emit('can-continue', {value: false});
            }
        },
        methods: {
            trigger(val) {
                console.log(val);
            }
        }
    }
</script>