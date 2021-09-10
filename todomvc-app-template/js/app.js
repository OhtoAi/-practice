(function (window) {
	'use strict';
	const vm = new Vue({
		el: '#app',
		data: {
			list :[
				{id: 1, name:"斌仔今天基金赚麻", done: true},
				{id: 2, name:"斌仔今天股票赚麻", done: true},
				{id: 3, name:"斌仔今天起飞", done: true}
			],
			// 代办名称
			todoName: "",
			// 编辑删除的id
			editId: -1

		},
		methods: {
			addTodo(e) {
				//如果文本框无内容，则阻止添加
				if (this.todoName.trim().length == 0) {
					return
				}
				// 添加ID
				const id = this.list.length == 0 ? 1 : this.list[this.list.length - 1].id + 1;
				this.list.push({
					id,
					name: this.todoName,
					done: false
				})
				//添加完数据后清空输入框
				this.todoName = "";
			},
			delTodo(id) {
				// 删除
				this.list = this.list.filter(item => item.id != id)
			},
			showEdit(id) {
				this.editId = id
			},
			// 隐藏编辑状态
			hideEdit() {
				this.editId = -1
			}
		},
		computed: {
			isFooterShow() {
				return this.list.length > 0;
			}
		}
	})

})(window);
