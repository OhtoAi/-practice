(function (window) {
	'use strict';
	const vm = new Vue({
		el: "#app",
		data: {
			list: [],
			editId: -1,
			todoName: ""
		},
		created() {
			axios.get("http://localhost:3000/list").then(res => {
				this.list = res.data;
			})
		},
		methods: {
			addTodo() {
				//非空判断
				if (this.todoName.trim().length == 0) {
					return
				}
				axios.post("http://localhost:3000/list", {
					name: this.todoName,
					done: false
				}).then(res => {
					this.list.push(res.data)
				})
				this.todoName = ""
			},
			// 删除任务
			delTodo(id) {
				axios.delete(`http://localhost:3000/list/${id}`).then(res => {
					this.list = this.list.filter(item => item.id != id);
				})
			},
			// 双击时显示编辑状态
			showEdit(id) {
				this.editId = id;
			},
			// 隐藏编辑状态
			hideEdit(e) {
				// // 每次触发DOM事件时会产生一个事件对象（也称event对象），此处的参数e接收事件对象。而事件
				// 对象也有很多属性和方法，其中target属性是获取触发
				// 事件对象的目标，也就是绑定事件的元素，e.target表
				// 示该DOM元素，然后在获取其相应的属性值
				axios.patch(`http://localhost:3000/list/${this.editId}`, {
					name: e.target.value
				}).then(res => {
					this.editId = -1;
				})
			},
			// 点击清除已经完成的任务
			claerCompleted() {
				this.list = this.list.filter(item => !item.done)
			}
		},
		computed: {
			// 没有任务时隐藏底部
			isFooterShow() {
				return this.list.length > 0;
			},
			// 剩余未完成个数
			itemLeftCount() {
				return this.list.filter(item => !item.done).length
			},
			// 是否显示清除已完成
			isClearCompletedShow() {
				return this.list.some(item => item.done)
			}
		},
		// 监听
		// watch: {
		// 	list: {
		// 		deep: true,
		// 		hanlder(newVal) {
		// 			localStorage.setItem('list', JSON.stringify(newVal))
		// 		}
		// 	}
		// }
	})

})(window);
