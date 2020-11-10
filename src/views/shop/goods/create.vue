<template>
	<div class="bg-white px-3 goods_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 12px;left: 200px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>


		<el-form ref="form" label-width="80px">
			<el-form-item label="商品名称">
				<el-input v-model="form.name" placeholder="请输入商品名称，不能超过60个字符" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="商品简述">
				<el-input v-model="form.descriptions" placeholder="请简单描述一下你的商品" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="图片">
				<input id="file" type="file" @change="shang" />

				<!-- <div>
					<span v-if="!form.cover" class="btn btn-light border mr-2" @click="chooseImage">
						<i class="el-icon-plus"></i>
					</span>
					<img v-else :src="form.cover" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage" />
				</div> -->
			</el-form-item>
			<el-form-item label="商品分类">
				<el-select v-model="form.cateid" placeholder="请选择商品分类">
					<el-option :label="item | tree" v-for="(item,index) in cates" :key="index" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品描述">
				<el-input type="textarea" v-model="form.details" placeholder="选填，商品卖点简述，例如：此款商品美观大方 性价比较高 不容错过" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="商品单位">
				<el-input v-model="form.unit" placeholder="请输入商品单位" class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="总库存">
				<el-input type="number" v-model="form.stock" class="w-25">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存预警">
				<el-input type="number" v-model="form.min_stock" class="w-25">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="销售价">
				<el-input type="number" v-model="form.price" class="w-25">
					<template slot="append">元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低原价">
				<el-input type="number" v-model="form.min_oprice" class="w-25">
					<template slot="append">元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存显示">
				<el-radio-group v-model="form.stock_display">
					<el-radio :label="1" border>是</el-radio>
					<el-radio :label="0" border>否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否上架">
				<el-radio-group v-model="form.status">
					<el-radio :label="0" border>放入仓库</el-radio>
					<el-radio :label="1" border>立即上架</el-radio>
				</el-radio-group>
			</el-form-item>

			<!-- <el-form ref="form" label-width="80px">
				<el-form-item label="添加规格">
					<sku-card v-for="(item,index) in sku_card" :key="index" :item="item" :index="index" :total="skuCardTotal"></sku-card>
					<el-button type="success" size="mini" @click="addSkuCard">添加规格</el-button>
				</el-form-item>
			</el-form> -->
			<!-- 
			<el-form-item label="规格设置">
				<sku-table ref="table"></sku-table>
			</el-form-item> -->

			<!-- 	<el-form-item label="商品规格">
				<el-checkbox-group v-model="form.type">
					<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
					<el-checkbox label="地推活动" name="type"></el-checkbox>
					<el-checkbox label="线下主题活动" name="type"></el-checkbox>
					<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item> -->


			<!-- <el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>商品</span>
					<el-button style="float: right; padding: 3px 0" type="text">新规格</el-button>
				</div>
				<el-checkbox-group v-model="checkboxGroup1">
					<el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
				</el-checkbox-group>
	</div>

	</el-card> -->

			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>商品规格</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="createTop">新建规格</el-button>
				</div>
				<div>
					<el-checkbox-group v-model="checkboxGroup1">
						<el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
					</el-checkbox-group>
				</div>
			</el-card>

			<el-form-item label="运费" class="dis">
				<el-select v-model="form.express_id" placeholder="请选择运费">
					<el-option :label="item" v-for="(item,index) in express" :key="index" :value="item.id"></el-option>
				</el-select>
			</el-form-item>

		</el-form>
		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>

	</div>
</template>

<script>
	const cityOptions = ['红色', '白色', '黑色', '玫瑰金'];
	export default {
		//inject: ['app', 'layout'],
		components: {},
		data() {
			return {
				checkboxGroup1: ['红色'],
				checkboxGroup2: ['白色'],
				checkboxGroup3: ['黑色'],
				checkboxGroup4: ['玫瑰金'],
				cities: cityOptions,
				cates: [],
				express: ['全国包邮', '偏远地区另计邮费'],
				form: {
					name: "",
					title: "",
					category_id: "",
					cover: "",
					desc: "",
					unit: "",
					stock: "",
					min_stock: "",
					ischeck: 0,
					status: 1,
					stock_display: 0,
					express_id: "",
					min_price: "",
					min_oprice: "",
					price: "",
					num: "1233",
					cateid: 0,
					descriptions: "",
					details: ""
				},
				picurl: "https://img12.360buyimg.com/n7/jfs/t1/102911/12/15632/121784/5e71ccd6E63b84804/592e58f2fc2acaae.jpg",
			}
		},
		filters: {
			tree(item) {
				if (item.level == 0) {
					return item.name
				}
				let str = ''
				for (let i = 0; i < item.level; i++) {
					str += i == 0 ? '|--' : '--'
				}
				return str + ' ' + item.name;
			}
		},
		created() {
			// this.axios.get('/admin/goods/create', {
			// 	token: true
			// }).then(res => {
			// 	let data = res.data.data
			// 	console.log(data)
			// 	this.cates = data.cates
			// 	this.express = data.express.list
			// })
			this.axios.get('/admin/category/selectFirstCategory', {
				headers: {
					'Authorization': window.sessionStorage.getItem('token')
				}
			}).then(res => {
				console.log(res.data.data)
				this.cates = res.data.data

			}).catch(err => {
				console.log(err)
			})
		},
		// create_g() {
		// 	this.axios.post('/admin/product/add', {

		// 			parameterList: [{
		// 				addTime: "2020-09-23T09:40:28.201Z",
		// 				deleted: true,
		// 				id: 0,
		// 				name: "颜色",
		// 				productId: 0,
		// 				updateTime: "2020-09-23T09:40:28.201Z",
		// 				value: "白色 黑色"
		// 			}],
		// 			product: {
		// 				addTime: "2020-09-23T09:40:28.202Z",
		// 				albumUrl: "string",
		// 				brandId: 1,
		// 				brandName: "小米",
		// 				categoryId: 0,
		// 				categoryName: "string",
		// 				deleted: true,
		// 				description: "540度旋转磁吸数据线",
		// 				detail: "跨境新款540度旋转磁吸数据线三合一球形磁吸充电线旋转数据线",
		// 				id: 0,
		// 				keywords: "string",
		// 				owStock: 0,
		// 				name: "string",
		// 				picUrl: "https://cbu01.alicdn.com/img/ibank/2020/941/187/21151781149_1103531643.220x220.jpg?_=2020",
		// 				price: 5,
		// 				productSn: "string",
		// 				publishStatus: 1,
		// 				sale: 0,
		// 				stock: 100,
		// 				subTitle: "string",
		// 				unit: "string",
		// 				updateTime: "2020-09-23T09:40:28.202Z",
		// 				weight: 0
		// 			},
		// 			skuList: [{
		// 				addTime: "2020-09-23T09:40:28.202Z",
		// 				deleted: true,
		// 				id: 0,
		// 				price: 5,
		// 				productId: 0,
		// 				sale: 0,
		// 				stock: 100,
		// 				updateTime: "2020-09-23T09:40:28.202Z",
		// 				value: "string"
		// 			}],
		// 			specificationList: [{
		// 				addTime: "2020-09-23T09:40:28.202Z",
		// 				deleted: true,
		// 				id: 0,
		// 				name: "string",
		// 				productId: 0,
		// 				updateTime: "2020-09-23T09:40:28.202Z",
		// 				value: "string"
		// 			}]

		// 	}, {
		// 		headers: {
		// 			'Authorization': window.sessionStorage.getItem('token')
		// 		}
		// 	}).then(res => {
		// 		console.log(res)
		// 	}).catch(err => {
		// 		console.log(err)
		// 	})
		// },
		methods: {
			createTop() {
				this.$prompt('新建规格', '提示', {
					confirmButtonText: '创建',
					cancelButtonText: '取消',
					inputValidator: function(val) {
						if (val === '' || val === null) {
							return '规格不能为空'
						}
						return true
					}
				}).then(({
					value
				}) => {
					console.log(value);
				})
			},
			chooseImage() {
				this.app.chooseImage((res) => {
					this.form.cover = res[0].url
				}, 1)
			},
			submit() {
				console.log(parseInt(this.num))
				console.log(this.cates)
				console.log(this.cateid)
				console.log(this.status)
				this.axios.post('/admin/product/add', {

									parameterList: [{
										addTime: "2020-09-23T09:40:28.201Z",
										deleted: true,
										id: 0,
										name: "颜色",
										productId: 0,
										updateTime: "2020-09-23T09:40:28.201Z",
										value: "白色 黑色 玫瑰金"
									}],
									product: {
										addTime: "2020-09-23T09:40:28.202Z",
										albumUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600855768012&di=6608540e7876fb8d9e56520bcd35268a&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F17%2F06%2F29%2Fa6f634b4352152d634b682beb41556eb.jpg",
										brandId: 1,
										brandName: "小米",
										categoryId: parseInt(this.form.cateid),
										categoryName: "手机数码",
										deleted: true,
										description: this.form.descriptions,
										detail: this.form.details,
										id: 0,
										keywords: this.form.name,
										owStock: 0,
										name: this.form.name,
										picUrl: this.picurl,
										price: parseInt(this.form.price),
										productSn: "华农超市",
										publishStatus: parseInt(this.form.status),
										sale: 0,
										stock: parseInt(this.form.stock),
										subTitle: "string",
										unit: this.form.min_stock,
										updateTime: "2020-09-23T09:40:28.202Z",
										weight: 0
									},
									skuList: [{
										addTime: "2020-09-23T09:40:28.202Z",
										deleted: true,
										id: 0,
										price: parseInt(this.form.price),
										productId: 0,
										sale: 0,
										stock:parseInt(this.form.stock) ,
										updateTime: "2020-09-23T09:40:28.202Z",
										value: "玫瑰金"
									}],
									specificationList: [{
										addTime: "2020-09-23T09:40:28.202Z",
										deleted: true,
										id: 0,
										name: "适用人群",
										productId: 0,
										updateTime: "2020-09-23T09:40:28.202Z",
										value: "7岁以上"
									}]

							}, {
								headers: {
									'Authorization': window.sessionStorage.getItem('token')
								}
							}).then(res => {
								console.log(res)
							}).catch(err => {
								console.log(err)
							})
					},
					shang(e) {
						const file = e.target.files[0]
						//console.log(file);
						const data = new FormData();
						data.append('file', file);
						console.log(data.get('file'));
						this.axios.post('/admin/file/upload', data, {
							headers: {
								//'Content-Type': 'multipart/form-data',
								'Authorization': window.sessionStorage.getItem('token')
							}
						}).then(res => {
							console.log(res.data.data)
							this.picurl = res.data.data
						}).catch(err => {
							console.log(err)
						})
					}
					// submit() {
					// 	this.layout.showLoading()
					// 	this.axios.post('/admin/goods', this.form, {
					// 		token: true
					// 	}).then(res => {
					// 		this.$message({
					// 			type: "success",
					// 			message: "发布成功"
					// 		})
					// 		this.$router.push({
					// 			name: "shop_goods_list"
					// 		})
					// 		this.layout.hideLoading()
					// 	}).catch(err => {
					// 		this.layout.hideLoading()
					// 	})
					// }
				},
			}
</script>

<style>
	.goods_create .el-form-item {
		margin-bottom: 15px;
	}

	.dis {
		margin-top: 30px;
	}
</style>
