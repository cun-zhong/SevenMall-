<template>
	<div>

		<div class="container">
			<div class="row">
				<div class="col-12 col-sm-9 col-md-7 col-lg-5 m-auto pt-5">
					<div class="card mt-5">
						<div class="card-header bg-white">
							<h3 class="text-center mb-0 text-secondary">
								{{$conf.logo}}
							</h3>
						</div>
						<div class="card-body">
							<el-form ref="ruleForm" :rules="rules" :model="form">
								<el-form-item prop="username">
									<el-input v-model="form.username" size="medium" placeholder="请输入用户名">
									</el-input>
								</el-form-item>
								<el-form-item prop="password">
									<el-input v-model="form.password" size="medium" type="password" placeholder="请输入密码">
									</el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" size="medium" class="w-100" @click="submit" :loading="loading">
										立即登录
									</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading:false,
				form: {
					username: "",
					password: ""
				},
				rules: {
					username: [{
						required: true,
						message: "请输入用户名",
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: "请输入密码",
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submit() {
				// this.$refs.ruleForm.validate((e) => {
				// 	if (!e) return;
				// 	// 提交表单
				// 	this.axios.post('/admin/login', this.form).then(res => {
				// 		console.log(res);
				// 	}).catch(err => {
				// 		console.log(err);
				// 	})
				// 	// this.$router.push({name:'index'})
				// })

				// this.axios.get('admin/address/SelectAll')
				// 	.then(function(response) {
				// 		console.log(response);
				// 	})
				// 	.catch(function(error) {
				// 		console.log(error.response);
				// 	});


				// this.axios.post('/admin/user/login', {
				// 		username:'123456',
				// 		password:'123456'
				// 	})
				// 	.then(function(response) {
				// 		console.log(response);
				// 	})
				// 	.catch(function(error) {
				// 		console.log(error.response);
				// 	});

				this.$refs.ruleForm.validate((e) => {
					if (!e) return;
					this.loading = true;
					// 提交表单
					this.axios.post('/admin/user/login', {},{
						params:{
							username:this.form.username,
						password:this.form.password
							}
					}).then(res => {
						this.$store.commit('login',res.data.data)
						this.$message('登录成功')
						console.log(res)
						//console.log(JSON.stringify(res.data.data.user))
						console.log(res.data.data.user)
						this.loading = false;
					this.$router.push({name:'index'})
						console.log(res.data.data.user.id);
					}).catch(err => {
						console.log(err);
						this.loading = false;
					})
					
					// this.$router.push({name:'index'})
				})

			}
		},
	}
</script>

<style>
</style>
