<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<style>
	@import "css/app.css";
</style>
<script>
	import {GET_COOKIE} from './js/cookie'
	export default{
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'fetchData'
		},
		methods:{
			fetchData(){
				//todo
				!GET_COOKIE('user')?this.$router.go('/'):"";
			}
		}
	}
</script>