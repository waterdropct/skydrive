<template>
    <div class="cloudDisk">
        <DiskMenu :showEditMenu="showEditMenu" />
        <DiskMain :selectEmit="selectEmit" />
    </div>
</template>

<script>
    import DiskMenu from './DiskMenu.vue'
    import DiskMain from './DiskMain.vue'
    export default {
        name: 'CloudDisk',
        props: {},
        data(){
            return {
                showEditMenu: false
            }
        },
        components: {
            DiskMenu,
            DiskMain
        },
        computed: {},
        methods: {
            selectEmit: function(data){
                this.showEditMenu = data.isShow;
                alert(data.selectList)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .cloudDisk {
        width: auto;
        margin: 0 20px;
    }
</style>