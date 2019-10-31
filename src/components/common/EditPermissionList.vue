<template>
    <div>edit-permission-list</div>
</template>
<script>
export default {
    name: "edit-permission-list",
    props: ["id"],
    data: function() {
    return {
      permissions: []
    };
  },
  async mounted() {
    // TODO: get user's details from each file permissions.
    this.users = await files.getPermissions(this.id);
    for (let i = 0; i < this.users.length; i++) {
      const user = (await users.get(this.users[i].userID)).user;
      this.users[i].letters = (user.firstName[0] + user.lastName[0]).toUpperCase();
      this.users[i].label = `user ${user.fullName} has ${roles[this.users[i].role]} permission`;

      // if (this.usersToDisplay.length < 6) {
        this.usersToDisplay.push(this.users[i]);
      // }
    }
  }
}
</script>