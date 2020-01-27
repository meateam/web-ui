<template>
    <div class="step3">
        <div dir="direction">
            <h3>{{ $t("exShare.headerTS") }}</h3>
        </div>
        <div class="card-content">
            <textarea
                id="infoText"
                class="textbox"
                rows="4"
                cols="50"
            ></textarea>
        </div>
        <form>
            <p>{{ $t("exShare.chooseClass") }}</p>
            <select id="classSelect">
                <option v-bind:key="c" v-for="c in classifications">{{
                    c
                }}</option>
            </select>
        </form>

        <button class="final-button" @click="createShare">
            {{ $t("exShare.reqShare") }}
        </button>
    </div>
</template>

<script>
import { createExShare } from "@/api/exShare";

export default {
    data() {
        return {
            text: "",
            classifications: [
                "Secret",
                "TopSecret",
                "SuperSecret",
                "NonClassified"
            ]
        };
    },
    methods: {
        onInput(val) {
            console.log(val.srcElement.value);
        },
        async createShare() {
            this.$emit('can-continue', {value: true});
            // const info = document.getElementById("infoText").value;
            // const classification = document.getElementById("classSelect").value;
            // const exUsers = [];
            // const approvers = [];
            // this.externalUsers.forEach(user => {
            //     exUsers.push({ id: user.id, full_name: user.full_name });
            // });
            // this.approvers.forEach(approver => {
            //     approvers.push(approver.id);
            // });
            // try {
            //     await createExShare(this.selectedItem.id, exUsers, classification, info, approvers);
            // } catch (err) {
            //     // console.log(err)
            // }
        }
    }
};
</script>

<style>
.step3 {
    margin: 10px;
}

textarea {
    max-height: 500px;
    min-height: 50px;
    max-width: 100%;
    background-color: bisque;
    border-radius: 5px;
}
</style>
