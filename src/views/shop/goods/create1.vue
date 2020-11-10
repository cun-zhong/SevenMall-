<template>
	<div class="bg-white px-3 goods_create" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 12px;left: 200px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<input id="file" type="file" @change="shang" />

			<!-- <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
			 :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
				<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload> -->
			<el-tab-pane label="基础设置">
				<base-create></base-create>
			</el-tab-pane>
			<el-tab-pane label="商品规格">

				<!-- 规格选项 -->
				<el-form ref="form" label-width="80px">
					<el-form-item label="商品规格">
						<el-radio-group :value="skus_type" @input="vModel('skus_type',$event)" size="medium">
							<el-radio-button :label="0">
								单一规格</el-radio-button>
							<el-radio-button :label="1">
								多规格</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-form>

				<!-- 单规格 -->
				<template v-if="skus_type === 0">
					<single-attrs></single-attrs>
				</template>
				<!-- 多规格 -->
				<template v-else>
					<!-- 规格卡片 -->
					<el-form ref="form" label-width="80px">
						<el-form-item label="添加规格">
							<sku-card v-for="(item,index) in sku_card" :key="index" :item="item" :index="index" :total="skuCardTotal"></sku-card>
							<el-button type="success" size="mini" @click="addSkuCard">添加规格</el-button>
						</el-form-item>
					</el-form>
					<el-form ref="form" label-width="80px">
						<el-form-item label="批量设置">
							<template v-if="!updateAllStatus">
								<el-button type="text" v-for="(btn,btnIndex) in updateList" :key="btnIndex" @click="openUpdateAllStatus(btn)">{{btn.name}}</el-button>
							</template>
							<div v-else class="d-flex align-items-center">
								<el-input size="small" style="width: 150px;" class="mr-2" type="number" v-model="UpdateAllValue" :placeholder="UpdateAllPlaceholder"></el-input>
								<el-button type="primary" size="mini" @click="UpdateAllSubmit">设置</el-button>
								<el-button size="mini" @click="closeUpdateAllStatus">取消</el-button>
							</div>

						</el-form-item>
						<el-form-item label="规格设置">
							<sku-table ref="table"></sku-table>
						</el-form-item>
					</el-form>
				</template>

			</el-tab-pane>
			<el-tab-pane label="商品属性">
				<el-form ref="form" label-width="80px">
					<el-form-item label="商品类型">
						<el-select :value="goods_type_id" @change="vModel('goods_type_id',$event)" placeholder="请选择商品类型">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>商品属性</span>
					</div>
					<el-form ref="form" label-width="80px">
						<el-form-item label="手机型号">
							<el-input :value="goods_attrs.phone_model" placeholder="请输入手机型号" @input="vModelGoodsAttrs({ key:'phone_model',value:$event })"></el-input>
						</el-form-item>
					</el-form>
				</el-card>
			</el-tab-pane>

			<el-tab-pane label="媒体设置">

				<el-form label-width="80px">
					<el-form-item label="商品大图">

						<div class="d-flex flex-wrap">

							<div style="width: 150px;height: 150px;cursor: pointer;position: relative;" class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
							 @click="chooseImage(index)" v-for="(item,index) in banners" :key="index">
								<img v-if="item.url" :src="item.url" style="width: 100%;height: 100%;" />
								<i v-else class="el-icon-plus text-muted" style="font-size: 30px;"></i>

								<i class="el-icon-delete p-2 text-white" style="position: absolute;top: 0;right: 0;background-color: rgba(0,0,0,0.4);"
								 @click.stop="deleteImage(index)"></i>
							</div>

							<div v-if="banners.length < 9" style="width: 150px;height: 150px;cursor: pointer;" class="border rounded d-flex align-items-center justify-content-center mr-3 mb-3"
							 @click="chooseImage(-1)">
								<i class="el-icon-plus text-muted" style="font-size: 30px;"></i>
							</div>

						</div>


					</el-form-item>
				</el-form>


			</el-tab-pane>
			<el-tab-pane label="商品详情">
				<!-- 富文本编辑器 -->
				<tinymce ref="editor" v-model="msg" @onClick="onClick" />


			</el-tab-pane>
			<el-tab-pane label="折扣设置">
				<el-form ref="form" label-width="80px">
					<el-form-item label="会员价">
						<el-input :value="discount" @input="vModel('discount',$event)">
							<template slot="append">%</template>
						</el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>

		<el-button @click="create_g"> 提交</el-button>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"

	import baseCreate from "@/components/shop/create/base-create.vue"
	import singleAttrs from '@/components/shop/create/single-attrs.vue';
	import skuCard from '@/components/shop/create/sku/sku-card.vue';
	import skuTable from '@/components/shop/create/sku-table.vue';

	import tinymce from '@/components/common/tinymce.vue';

	export default {
		inject: ['app'],
		components: {
			baseCreate,
			singleAttrs,
			skuCard,
			skuTable,
			tinymce
		},
		data() {
			return {
				fileList: [],
				msg: 'Welcome to Use Tinymce Editor',
				tabIndex: 0,
				// 批量修改
				updateList: [{
					name: "销售价",
					key: "pprice"
				}, {
					name: "市场价",
					key: "oprice"
				}, {
					name: "成本价",
					key: "cprice"
				}, {
					name: "库存",
					key: "stock"
				}, {
					name: "体积",
					key: "volume"
				}, {
					name: "重量",
					key: "weight"
				}],
				updateAllStatus: false,
				UpdateAllPlaceholder: "",
				UpdateAllValue: ""
			}
		},
		computed: {
			...mapState({
				skus_type: state => state.goods_create.skus_type,
				sku_card: state => state.goods_create.sku_card,
				banners: state => state.goods_create.banners,
				goods_type_id: state => state.goods_create.goods_type_id,
				goods_attrs: state => state.goods_create.goods_attrs,
				discount: state => state.goods_create.discount,
			}),
			// 规格卡片总数
			skuCardTotal() {
				return this.sku_card.length
			}
		},
		methods: {
			...mapMutations(['vModelState', 'addSkuCard', 'vModelGoodsAttrs']),
			submitUpload() {
				//this.$refs.upload.submit();
				const file = this.fileList[0];
				//console.log(file);
				const data = new FormData();
				data.append('file', file);
				console.log(data.get('file'));
				this.axios.post('/admin/file/upload', data, {
					headers: {
						//transformRequest: [data => data],
						'Content-Type': 'multipart/form-data',
						//'Content-Type':'application/x-www-form-urlencoded',
						'Authorization': window.sessionStorage.getItem('token')
					}
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			create_g() {
				this.axios.post('/admin/product/add', {
					
						parameterList: [{
							addTime: "2020-09-23T09:40:28.201Z",
							deleted: true,
							id: 0,
							name: "颜色",
							productId: 0,
							updateTime: "2020-09-23T09:40:28.201Z",
							value: "白色 黑色"
						}],
						product: {
							addTime: "2020-09-23T09:40:28.202Z",
							albumUrl: "string",
							brandId: 1,
							brandName: "小米",
							categoryId: 0,
							categoryName: "string",
							deleted: true,
							description: "540度旋转磁吸数据线",
							detail: "跨境新款540度旋转磁吸数据线三合一球形磁吸充电线旋转数据线",
							id: 0,
							keywords: "string",
							owStock: 0,
							name: "string",
							picUrl: "https://cbu01.alicdn.com/img/ibank/2020/941/187/21151781149_1103531643.220x220.jpg?_=2020",
							price: 5,
							productSn: "string",
							publishStatus: 1,
							sale: 0,
							stock: 100,
							subTitle: "string",
							unit: "string",
							updateTime: "2020-09-23T09:40:28.202Z",
							weight: 0
						},
						skuList: [{
							addTime: "2020-09-23T09:40:28.202Z",
							deleted: true,
							id: 0,
							price: 5,
							productId: 0,
							sale: 0,
							stock: 100,
							updateTime: "2020-09-23T09:40:28.202Z",
							value: "string"
						}],
						specificationList: [{
							addTime: "2020-09-23T09:40:28.202Z",
							deleted: true,
							id: 0,
							name: "string",
							productId: 0,
							updateTime: "2020-09-23T09:40:28.202Z",
							value: "string"
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
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			// 修改表单的值
			vModel(key, value) {
				this.vModelState({
					key,
					value
				})
			},
			// 加载数据
			handleClick(tab, event) {
				console.log(tab.index);
			},
			// 鼠标单击的事件
			onClick(e, editor) {
				console.log('Element clicked')
				console.log(e)
				console.log(editor)
			},
			// 修改批量设置状态
			openUpdateAllStatus(item) {
				this.updateAllStatus = item.key
				this.UpdateAllPlaceholder = item.name
			},
			// 取消批量设置状态
			closeUpdateAllStatus() {
				this.updateAllStatus = false
				this.UpdateAllValue = ""
			},
			// 提交批量设置
			UpdateAllSubmit() {
				this.$refs.table.list.forEach(item => {
					item[this.updateAllStatus] = this.UpdateAllValue
				})
				this.closeUpdateAllStatus()
			},
			// 选择图片
			chooseImage(index) {
				const MAX = 9
				let count = MAX - this.banners.length
				this.app.chooseImage((res) => {
					let list = []
					if (index === -1) {
						list = [...this.banners, ...res]
					} else {
						list = [...this.banners]
						list[index] = res[0]
					}
					this.vModel('banners', list)
				}, index === -1 ? count : 1)
			},
			// 删除大图
			deleteImage(index) {
				this.$confirm('是否要删除该图片?', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let list = [...this.banners]
					list.splice(index, 1)
					this.vModel('banners', list)
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
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			}
		},
	}
</script>

<style>
	.goods_create .el-form-item {
		margin-bottom: 15px;
	}
</style>
