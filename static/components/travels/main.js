const delay = ms => new Promise(res => setTimeout(res, ms));

let app = new Vue({
    el: '#travels',
    data: function () {
        return {
            form: {
                route: null,
                departure: null,
                arrival: null,
                base_price: null,
            },
            booleans: {
                add: null,
                load: null,
                update: null,
                updateFailed: null,
                delete: null
            },
            travels: {},
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
            if (scope.travels.length < 1) {
                scope.selected.name = "Não existem objetos cadastrados no banco";
                return null
            }
            scope.selected = scope.travels[id.toString()];
            scope.selected["id"] = id.toString();
        },
        getFirstListElement: function (object) {
            return Object.keys(object)[0]
        },
        fillForm: function () {
            let scope = this;
            scope.form = {
                route: {id: scope.selected["route_id"]},
                departure: scope.selected.departure,
                arrival: scope.selected.arrival,
                base_price: scope.selected.base_price,
            }
        },
        addTravel: async function () {
            let scope = this;
            const params = scope.form;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/travel/create",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    location.reload()
                }
            }).catch(error => scope.booleans.failed = true)
        },
        getTravels: async function () {
            let scope = this;
            let request = await $.ajax({
                method: "POST",
                url: "/terminal/api/travel/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    scope.travels = response["data"];
                    scope.booleans.load = true;
                }
            });

        },
        updateTravel: async function () {
            let scope = this;
            let params = scope.form;
            params["id"] = scope.selected.id;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/travel/update",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    location.reload();
                }
            }).catch(error => scope.booleans.updateFailed = true)
        },
        deleteTravel: async function () {
            let scope = this;
            const params = {id: scope.selected.id};
            $.ajax({
                method: "POST",
                url: "/terminal/api/travel/delete",
                data: params,
                credentials: "include",
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (){
                    delete scope.travels[scope.selected.id];
                    scope.selectRow(1);
                    scope.booleans.update = false;
                }
            }).catch(error => scope.booleans.delete = true)
        },
        getRoute: async function (id) {
            let scope = this;
            const params = {id: id.toString()};
            let request = await $.ajax({
                method: "POST",
                url: "/terminal/api/route/get",
                data: params,
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    console.log("Rota da viagem carregada")
                }
            });
            return request
        },
        getRoutes: async function () {
            let scope = this;
            await $.ajax({
                method: "POST",
                url: "/terminal/api/route/read",
                credentials: 'include',
                headers: {'X-CSRFToken': this.getCookie("csrftoken")},
                success: function (response) {
                    scope.routes = response["data"]
                }
            })
        },
    },
    filters: {
        priceFormat: function (value){
            return "R$"+Number(value).toFixed(2).toString()
        }
    },
    mounted: async function () {
        await this.getRoutes();
        await delay(250);
        await this.getTravels();
        await delay(100);
        this.selectRow(this.getFirstListElement(this.travels));

    }
})