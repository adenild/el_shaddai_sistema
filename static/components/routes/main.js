let app = new Vue({
    el: '#routes',
    data: function () {
        return {
            form: {
                name: null,
                code: null,
                distance: null,
                origin: null,
                destiny: null,
                allocated_vehicles: null,
                stops: null
            },
            booleans: {
                add: null,
                load: null,
                update: null,
                updateFailed: null,
                delete: null
            },
            routes: {},
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
        selectRow: function (id) {
            let scope = this;
            if (scope.routes.length < 1) {
                scope.selected.name = "Não existem objetos cadastrados no banco";
                return null
            }
            scope.selected = scope.routes[id.toString()];
            scope.selected["id"] = id.toString();
        },
        fillForm: function () {
            let scope = this;
            scope.form = {
                name: scope.selected.name,
                code: scope.selected.code,
                distance: scope.selected.distance,
                origin: scope.selected.origin,
                destiny: scope.selected.destiny,
                allocated_vehicles: scope.selected.allocated_vehicles,
                stops: scope.selected.stops,
            }
        },
        addRoute: async function () {
            let scope = this;
            const params = scope.form;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/route/create",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    location.reload()
                }
            }).catch(error => scope.booleans.failed = true)
        },
        getRoutes: async function () {
            let scope = this;
            let request = await $.ajax({
                method: "POST",
                url: "/terminal/api/route/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    scope.routes = response["data"];
                    scope.booleans.load = true;
                }
            });

        },
        updateRoute: async function () {
            let scope = this;
            let params = scope.form;
            params["id"] = scope.selected.id;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/route/update",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    location.reload();
                }
            }).catch(error => scope.booleans.updateFailed = true)
        },
        deleteRoute: async function () {
            let scope = this;
            const params = {id: scope.selected.id};
            $.ajax({
                method: "POST",
                url: "/terminal/api/route/delete",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    delete scope.routes[scope.selected.id];
                    scope.selectRow(1);
                    scope.booleans.update = false;
                }
            }).catch(error => scope.booleans.delete = true)
        },
    },
    filters: {

    },
    mounted: async function () {
        await this.getRoutes();
        this.selectRow(1);
    }
})