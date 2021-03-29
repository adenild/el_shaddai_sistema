const delay = ms => new Promise(res => setTimeout(res, ms));

function slashFormat (value) {
    let newValue = value.split('-')
    return newValue[2] + '/' + newValue[1] + '/' + newValue[0]
}

let app = new Vue({
    el: '#users',
    data: function () {
        return {
            form: {
                name: null,
                cpf: null,
                birthday: null,
                status: null,
                position: null,
                employed_time: null,
                contract_end: null,
                salary: null,
                email: null,
                username: null,
                password: null,
                group: null
            },
            booleans: {
                add: null,
                load: null,
                update: null,
                updateFailed: null,
                delete: null
            },
            users: {},
            selected: null
        }
    },
    methods: {
        getCookie: function (name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                let cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    let cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        getFirstListElement: function (object) {
            return Object.keys(object)[0]
        },
        selectRow: function (id) {
            let scope = this;
            scope.selected = scope.users[id.toString()];
            scope.selected["id"] = id.toString();
        },
        fillForm: function () {
            let scope = this;
            scope.form = {
                name: scope.selected["first_name"]+ ' ' + scope.selected["last_name"],
                cpf: scope.selected.cpf,
                birthday: slashFormat(scope.selected.birthday),
                status: scope.selected.status,
                position: scope.selected.position,
                employed_time: scope.selected.employed_time,
                contract_end: slashFormat(scope.selected.contract_end),
                salary: scope.selected.salary,
                email: scope.selected.email,
                username: scope.selected.username,
                password: scope.selected.password,
                group: scope.selected.group,

            }
        },
        addUser: async function () {
            let scope = this;
            const params = scope.form;
            await $.ajax({
                method: "POST",
                url: "/system/api/user/create",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    location.reload()
                }
            }).catch(error => scope.booleans.failed = true)
        },
        getUsers: async function () {
            let scope = this;
            let request = await $.ajax({
                method: "POST",
                url: "/system/api/user/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    scope.users = response["data"];
                    scope.booleans.load = true;
                }
            });

        },
        updateUser: async function () {
            let scope = this;
            let params = scope.form;
            params["id"] = scope.selected.id;
            await $.ajax({
                method: "POST",
                url: "/system/api/user/update",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    location.reload();
                }
            }).catch(error => scope.booleans.updateFailed = true)
        },
        deleteUser: async function () {
            let scope = this;
            const params = {id: scope.selected.id};
            $.ajax({
                method: "POST",
                url: "/system/api/user/delete",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    delete scope.users[scope.selected.id];
                    scope.selectRow(scope.getFirstListElement(scope.users));
                    scope.booleans.update = false;
                }
            }).catch(error => scope.booleans.delete = true)
        },
    },
    filters: {
        dateFormat: function (value) {
            let newValue = value.split('-')
            return newValue[2] + '/' + newValue[1] + '/' + newValue[0]
        },
    },
    mounted: async function () {
        await this.getUsers();
        await delay(200);
        this.selectRow(this.getFirstListElement(this.users));

    }
})